"use server";

import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { catalogModels, catalogPrices, clients, quoteEvents, quotes } from "@/lib/db/schema";
import { requireQuoteManager, requireQuoteReader } from "@/lib/session";
import { validateQuotePayload } from "@/lib/quote/validation";
import type {
  AppVersion,
  BomState,
  CatalogModel,
  LineItem,
  QuoteInputs,
  QuoteMode,
  QuoteParty,
  QuoteTotals,
  SavedQuote,
} from "@/lib/quote/types";

export async function loadCatalog(): Promise<{
  models: CatalogModel[];
  prices: Record<string, number>;
}> {
  const context = await requireQuoteManager();
  const modelScope =
    context.role === "staff"
      ? undefined
      : or(isNull(catalogModels.organizationId), eq(catalogModels.organizationId, context.organizationId!));
  const priceScope =
    context.role === "staff"
      ? undefined
      : or(isNull(catalogPrices.organizationId), eq(catalogPrices.organizationId, context.organizationId!));
  const [modelsRows, priceRows] = await Promise.all([
    db
      .select()
      .from(catalogModels)
      .where(and(eq(catalogModels.active, true), modelScope)),
    db.select().from(catalogPrices).where(priceScope),
  ]);

  return {
    models: modelsRows.map((m) => ({
      id: m.id,
      label: m.label,
      l: m.lengthM,
      w: m.widthM,
      h: m.depthM,
      type: m.poolType as CatalogModel["type"],
      imageUrl: m.imageUrl,
      active: m.active,
    })),
    prices: Object.fromEntries(priceRows.map((p) => [p.key, p.value])),
  };
}

export async function listQuotes(options: { search?: string; status?: string; page?: number } = {}): Promise<{
  quotes: (Pick<
    SavedQuote,
    "id" | "clientName" | "appVersion" | "quoteMode" | "status" | "createdAt" | "updatedAt"
  > & { total: number })[];
  hasMore: boolean;
}> {
  const context = await requireQuoteReader();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = 10;
  const customerClientIds =
    context.role === "customer"
      ? db.select({ id: clients.id }).from(clients).where(eq(clients.customerUserId, context.userId))
      : undefined;
  const rows = await db
    .select()
    .from(quotes)
    .where(
      context.role === "staff"
        ? undefined
        : context.role === "professional"
          ? eq(quotes.organizationId, context.organizationId!)
          : inArray(quotes.clientId, customerClientIds!),
    )
    .orderBy(quotes.updatedAt);
  const filtered = rows.reverse().filter((row) => {
    const matchesSearch =
      !options.search ||
      `${row.clientName} ${row.clientAddress}`.toLowerCase().includes(options.search.toLowerCase());
    return matchesSearch && (!options.status || row.status === options.status);
  });
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize + 1);
  const hasMore = pageRows.length > pageSize;
  return {
    hasMore,
    quotes: pageRows.slice(0, pageSize).map((row) => ({
    id: row.id,
    clientName: row.clientName,
    appVersion: row.appVersion as AppVersion,
    quoteMode: row.quoteMode as QuoteMode,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    total: (row.totals as QuoteTotals).total ?? 0,
    })),
  };
}

export async function getQuote(id: string): Promise<SavedQuote | null> {
  const context = await requireQuoteReader();
  const customerClientIds =
    context.role === "customer"
      ? db.select({ id: clients.id }).from(clients).where(eq(clients.customerUserId, context.userId))
      : undefined;
  const [row] = await db
    .select()
    .from(quotes)
    .where(
      and(
        eq(quotes.id, id),
        context.role === "staff"
          ? undefined
          : context.role === "professional"
            ? eq(quotes.organizationId, context.organizationId!)
            : inArray(quotes.clientId, customerClientIds!),
      ),
    )
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    builderName: row.builderName,
    builderRef: row.builderRef,
    builderPiva: row.builderPiva,
    clientName: row.clientName,
    clientAddress: row.clientAddress,
    clientPhone: row.clientPhone || row.clientContact,
    clientEmail: row.clientEmail,
    appVersion: row.appVersion as AppVersion,
    quoteMode: row.quoteMode as QuoteMode,
    status: row.status,
    inputs: row.inputs as QuoteInputs,
    lineItems: row.lineItems as LineItem[],
    bomState: row.bomState as BomState,
    totals: row.totals as QuoteTotals,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getQuoteEvents(id: string) {
  const context = await requireQuoteReader();
  if (context.role === "customer" && !(await getQuote(id))) return [];
  return db
    .select()
    .from(quoteEvents)
    .where(
      and(
        eq(quoteEvents.quoteId, id),
        context.role === "staff" || context.role === "customer"
          ? undefined
          : eq(quoteEvents.organizationId, context.organizationId!),
      ),
    )
    .orderBy(quoteEvents.createdAt);
}

export async function saveQuote(payload: {
  id?: string;
  party: QuoteParty;
  appVersion: AppVersion;
  quoteMode: QuoteMode;
  inputs: QuoteInputs;
  lineItems: LineItem[];
  bomState: BomState;
  totals: QuoteTotals;
}): Promise<{ id: string }> {
  const context = await requireQuoteManager();
  validateQuotePayload(payload);
  const now = new Date();
  const id = payload.id ?? crypto.randomUUID();

  const existingClient = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.name, payload.party.clientName),
        context.role === "staff" ? undefined : eq(clients.organizationId, context.organizationId!),
      ),
    )
    .limit(1);

  let clientId = existingClient[0]?.id;
  if (!clientId) {
    clientId = crypto.randomUUID();
    await db.insert(clients).values({
      id: clientId,
      name: payload.party.clientName,
      address: payload.party.clientAddress,
      contact: [payload.party.clientPhone, payload.party.clientEmail].filter(Boolean).join(" · "),
      phone: payload.party.clientPhone,
      email: payload.party.clientEmail,
      organizationId: context.organizationId,
      createdBy: context.userId,
    });
  }

  const values = {
    createdBy: context.userId,
    clientId,
    organizationId: context.organizationId,
    builderName: payload.party.builderName,
    builderRef: payload.party.builderRef,
    builderPiva: payload.party.builderPiva,
    clientName: payload.party.clientName,
    clientAddress: payload.party.clientAddress,
    clientContact: [payload.party.clientPhone, payload.party.clientEmail].filter(Boolean).join(" · "),
    clientPhone: payload.party.clientPhone,
    clientEmail: payload.party.clientEmail,
    appVersion: payload.appVersion,
    quoteMode: payload.quoteMode,
    status: "saved",
    inputs: payload.inputs,
    lineItems: payload.lineItems,
    bomState: payload.bomState,
    totals: payload.totals,
    updatedAt: now,
  };

  const [existing] = await db
    .select({ id: quotes.id })
    .from(quotes)
    .where(
      and(
        eq(quotes.id, id),
        context.role === "staff" ? undefined : eq(quotes.organizationId, context.organizationId!),
      ),
    )
    .limit(1);
  if (existing) {
    await db.update(quotes).set(values).where(eq(quotes.id, id));
  } else {
    await db.insert(quotes).values({ id, createdAt: now, ...values });
  }
  await db.insert(quoteEvents).values({
    id: crypto.randomUUID(),
    quoteId: id,
    userId: context.userId,
    eventType: existing ? "updated" : "created",
    payload: {
      total: payload.totals.total,
      clientName: payload.party.clientName,
      appVersion: payload.appVersion,
      quoteMode: payload.quoteMode,
    },
    organizationId: context.organizationId,
    createdAt: now,
  });

  return { id };
}
