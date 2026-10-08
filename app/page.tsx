import Link from "next/link";
import { listQuotes, loadCatalog } from "@/app/actions/quotes";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [session, quotes, catalog] = await Promise.all([getSession(), listQuotes(), loadCatalog()]);
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand"><img src="/logo-piscina.png" alt="MYPOOL" /><div><p className="eyebrow">MYPOOL QUOTATION</p><h1>Preventivi</h1></div></div>
        <span className="user-pill">{session?.user.name ?? "Staff"}</span>
      </header>
      <section className="dashboard-hero"><div><p className="muted">Area riservata staff</p><h2>Gestisci i tuoi preventivi</h2><p className="muted">Cataloghi attivi: {catalog.models.length} · Voci di listino: {Object.keys(catalog.prices).length}</p></div><Link href="/quotes/new" className="primary-button">Nuovo preventivo</Link></section>
      <section className="quote-list"><div className="section-heading"><h2>Preventivi recenti</h2><span className="muted">{quotes.length} salvati</span></div>{quotes.length === 0 ? <div className="empty-state"><p>Nessun preventivo salvato.</p><Link href="/quotes/new">Crea il primo preventivo</Link></div> : <div className="quote-grid">{quotes.map((quote) => <Link href={`/quotes/${quote.id}`} className="quote-card" key={quote.id}><div><strong>{quote.clientName}</strong><p className="muted">{quote.quoteMode} · {quote.appVersion.toUpperCase()}</p></div><strong>€ {quote.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</strong></Link>)}</div>}</section>
    </main>
  );
}
