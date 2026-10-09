import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuote } from "@/app/actions/quotes";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) notFound();

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>Detalle del presupuesto</h1>
        </div>
        <Link href="/" className="muted">← Preventivos</Link>
      </header>
      <section className="builder-card">
        <div className="section-heading">
          <div>
            <h2>{quote.clientName}</h2>
            <p className="muted">{quote.status} · {quote.appVersion.toUpperCase()} · {quote.quoteMode}</p>
          </div>
          <Link href={`/quotes/new?edit=${quote.id}`} className="primary-button">Editar</Link>
        </div>
        <div className="form-grid">
          <p><strong>Dirección</strong><br />{quote.clientAddress}</p>
          <p><strong>Contacto</strong><br />{quote.clientContact}</p>
          <p><strong>Dimensiones</strong><br />{quote.inputs.poolL} × {quote.inputs.poolW} × {quote.inputs.poolH} m</p>
          <p><strong>Total</strong><br />€ {quote.totals.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</p>
        </div>
      </section>
    </main>
  );
}
