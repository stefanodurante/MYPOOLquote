import Link from "next/link";

export const metadata = {
  title: "Installa MYPOOL · Demo V1",
  description: "Guida italiana per installare MYPOOL come app sul telefono.",
};

export default function InstallPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card install-card">
        <img src="/icon-192.png" alt="MYPOOL" className="auth-logo" />
        <p className="eyebrow">MYPOOL QUOTATION · DEMO V1</p>
        <h1>Installa l&apos;app</h1>
        <p className="muted">
          MYPOOL è una PWA: puoi aggiungerla alla schermata Home senza
          scaricare un&apos;app dagli store.
        </p>

        <div className="install-section">
          <h2>Android</h2>
          <ol>
            <li>Apri questo indirizzo con Chrome.</li>
            <li>Tocca il menu con i tre puntini.</li>
            <li>Scegli <strong>Installa app</strong> o <strong>Aggiungi alla schermata Home</strong>.</li>
            <li>Conferma.</li>
          </ol>
        </div>

        <div className="install-section">
          <h2>iPhone</h2>
          <ol>
            <li>Apri questo indirizzo con Safari.</li>
            <li>Tocca il pulsante <strong>Condividi</strong>.</li>
            <li>Scegli <strong>Aggiungi alla schermata Home</strong>.</li>
            <li>Conferma con <strong>Aggiungi</strong>.</li>
          </ol>
        </div>

        <p className="form-hint">
          L&apos;installazione richiede l&apos;indirizzo HTTPS di test. Non
          funzionerà con un indirizzo locale come localhost.
        </p>
        <div className="builder-actions">
          <Link href="/" className="primary-button">Apri MYPOOL</Link>
          <Link href="/login" className="secondary-button">Vai al login</Link>
        </div>
      </section>
    </main>
  );
}
