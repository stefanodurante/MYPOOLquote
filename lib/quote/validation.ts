import type {
  AppVersion,
  BomState,
  LineItem,
  QuoteInputs,
  QuoteMode,
  QuoteParty,
  QuoteTotals,
} from "./types";

const appVersions: AppVersion[] = ["pro", "lite"];
const quoteModes: QuoteMode[] = ["completo", "edile", "impianto"];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function text(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > maxLength) {
    throw new Error(`Invalid ${field}.`);
  }
}

function numberInRange(value: unknown, field: string, min: number, max: number) {
  if (!isFiniteNumber(value) || value < min || value > max) {
    throw new Error(`Invalid ${field}.`);
  }
}

export function validateQuotePayload(payload: {
  party: QuoteParty;
  appVersion: AppVersion;
  quoteMode: QuoteMode;
  inputs: QuoteInputs;
  lineItems: LineItem[];
  bomState: BomState;
  totals: QuoteTotals;
}) {
  text(payload.party.builderName, "builder name", 160);
  text(payload.party.builderRef, "builder reference", 160);
  text(payload.party.builderPiva, "builder VAT number", 40);
  text(payload.party.clientName, "client name", 160);
  text(payload.party.clientAddress, "client address", 300);
  text(payload.party.clientContact, "client contact", 160);

  if (!appVersions.includes(payload.appVersion) || !quoteModes.includes(payload.quoteMode)) {
    throw new Error("Invalid quote mode.");
  }

  const inputs = payload.inputs;
  numberInRange(inputs.poolL, "pool length", 0.1, 100);
  numberInRange(inputs.poolW, "pool width", 0.1, 100);
  numberInRange(inputs.poolH, "pool depth", 0.1, 10);
  numberInRange(inputs.turnoverTime, "turnover time", 1, 48);
  numberInRange(inputs.solariumArea, "solarium area", 0, 10000);
  numberInRange(inputs.materialMarkup, "material markup", 0, 1000);
  numberInRange(inputs.laborMarkup, "labor markup", 0, 1000);
  numberInRange(inputs.companyMargin, "company margin", 0, 1000);
  numberInRange(inputs.vatRate, "VAT rate", 0, 1);

  if (!Array.isArray(payload.lineItems) || payload.lineItems.length > 50) {
    throw new Error("Invalid quote line items.");
  }
  for (const item of payload.lineItems) {
    text(item.key, "line item key", 80);
    text(item.name, "line item name", 300);
    numberInRange(item.price, "line item price", 0, 1_000_000_000);
  }

  for (const [key, entry] of Object.entries(payload.bomState)) {
    text(key, "BOM key", 80);
    if (typeof entry.checked !== "boolean") throw new Error("Invalid BOM selection.");
    numberInRange(entry.price, "BOM price", 0, 1_000_000_000);
  }

  for (const [key, value] of Object.entries(payload.totals)) {
    numberInRange(value, `total ${key}`, 0, 1_000_000_000);
  }
}
