import Link from "next/link";

export default function NotFound() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">MYPOOL QUOTATION</p>
        <h1>Página no encontrada</h1>
        <p className="muted">La dirección solicitada no existe.</p>
        <Link href="/" className="primary-button">
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}
