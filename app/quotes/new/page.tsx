import Link from "next/link";
import { getQuote, loadCatalog } from "@/app/actions/quotes";
import QuoteBuilder from "./quote-builder";

export const dynamic = "force-dynamic";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [catalog, initialQuote] = await Promise.all([
    loadCatalog(),
    edit ? getQuote(edit) : Promise.resolve(null),
  ]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>{initialQuote ? "Modifica preventivo" : "Nuovo preventivo"}</h1>
        </div>
        <Link href="/" className="muted">← Preventivi</Link>
      </header>
      <QuoteBuilder models={catalog.models} prices={catalog.prices} initialQuote={initialQuote} />
    </main>
  );
}
