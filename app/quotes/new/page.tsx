import Link from "next/link";
import { loadCatalog } from "@/app/actions/quotes";
import QuoteBuilder from "./quote-builder";

export const dynamic = "force-dynamic";

export default async function NewQuotePage() {
  const catalog = await loadCatalog();

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>Nuovo preventivo</h1>
        </div>
        <Link href="/" className="muted">← Preventivi</Link>
      </header>
      <QuoteBuilder models={catalog.models} prices={catalog.prices} />
    </main>
  );
}
