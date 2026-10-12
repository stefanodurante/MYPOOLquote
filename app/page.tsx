import Link from "next/link";
import { redirect } from "next/navigation";
import { listQuotes, loadCatalog } from "@/app/actions/quotes";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const session = await getSession();
  if (!session?.user || session.user.role !== "staff") {
    redirect("/login");
  }
  const [quotePage, catalog] = await Promise.all([
    listQuotes({ search: params.q, status: params.status, page }),
    loadCatalog(),
  ]);
  const quotes = quotePage.quotes;
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  const queryString = query.toString();
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand"><img src="/logo-piscina.png" alt="MYPOOL" /><div><p className="eyebrow">MYPOOL QUOTATION</p><h1>Preventivi</h1></div></div>
        <span className="user-pill">{session?.user.name ?? "Staff"}</span>
      </header>
      <section className="dashboard-hero"><div><p className="muted">Area riservata staff</p><h2>Gestisci i tuoi preventivi</h2><p className="muted">Cataloghi attivi: {catalog.models.length} · Voci di listino: {Object.keys(catalog.prices).length}</p></div><div className="builder-actions"><Link href="/admin/catalog" className="secondary-button">Catálogo</Link><Link href="/quotes/new" className="primary-button">Nuovo preventivo</Link></div></section>
      <section className="quote-list">
        <div className="section-heading"><h2>Preventivos recientes</h2><span className="muted">Página {page}</span></div>
        <form className="quote-filters">
          <input name="q" defaultValue={params.q} placeholder="Buscar cliente o dirección" />
          <select name="status" defaultValue={params.status}><option value="">Todos los estados</option><option value="saved">Guardados</option><option value="draft">Borradores</option></select>
          <button className="secondary-button">Filtrar</button>
        </form>
        {quotes.length === 0 ? <div className="empty-state"><p>Ningún presupuesto coincide.</p><Link href="/quotes/new">Crea uno nuevo</Link></div> : <div className="quote-grid">{quotes.map((quote) => <Link href={`/quotes/${quote.id}`} className="quote-card" key={quote.id}><div><strong>{quote.clientName}</strong><p className="muted">{quote.status} · {quote.quoteMode} · {quote.appVersion.toUpperCase()}</p></div><strong>€ {quote.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</strong></Link>)}</div>}
        <div className="pagination">{page > 1 && <Link href={`/?${queryString}${queryString ? "&" : ""}page=${page - 1}`}>← Anterior</Link>}{quotePage.hasMore && <Link href={`/?${queryString}${queryString ? "&" : ""}page=${page + 1}`}>Siguiente →</Link>}</div>
      </section>
    </main>
  );
}
