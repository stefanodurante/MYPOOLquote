import Link from "next/link";
import { getQuote, loadCatalog } from "@/app/actions/quotes";
import { getAuthContext } from "@/lib/session";
import { getOrganizationProfile } from "@/lib/organization";
import QuoteBuilder from "./quote-builder";

export const dynamic = "force-dynamic";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const context = await getAuthContext();
  const [catalog, initialQuote] = await Promise.all([
    loadCatalog(),
    edit ? getQuote(edit) : Promise.resolve(null),
  ]);
  const organization = context.role === "professional" && context.organizationId
    ? await getOrganizationProfile(context.organizationId)
    : null;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>{initialQuote ? "Modifica preventivo" : "Nuovo preventivo"}</h1>
        </div>
        <div className="builder-actions"><Link href="/" className="muted">← Preventivi</Link>{context.role === "staff" && <Link href="/admin" className="muted">Amministrazione</Link>}</div>
      </header>
      <QuoteBuilder models={catalog.models} prices={catalog.prices} initialQuote={initialQuote} organization={organization} />
    </main>
  );
}
