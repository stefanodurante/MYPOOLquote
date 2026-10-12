import Link from "next/link";
import { requireStaff } from "@/lib/session";

export default async function AdminPage() {
  await requireStaff();

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>Amministrazione</h1>
        </div>
        <Link href="/" className="muted">← Preventivi</Link>
      </header>
      <section className="admin-grid">
        <Link href="/" className="admin-card">
          <strong>Preventivi</strong>
          <span>Gestisci i preventivi creati.</span>
        </Link>
        <Link href="/admin/catalog" className="admin-card">
          <strong>Listino e prezzi</strong>
          <span>Gestisci i prezzi usati nei calcoli.</span>
        </Link>
        <Link href="/admin/catalog/models" className="admin-card">
          <strong>Modelli piscine</strong>
          <span>Aggiungi e attiva i modelli disponibili nel wizard.</span>
        </Link>
        <div className="admin-card admin-card-disabled">
          <strong>Clienti finali</strong>
          <span>Gestione clienti collegati ai professionisti.</span>
          <small>In arrivo</small>
        </div>
        <div className="admin-card admin-card-disabled">
          <strong>Professionisti</strong>
          <span>Gestione installatori e organizzazioni.</span>
          <small>In arrivo</small>
        </div>
      </section>
    </main>
  );
}
