export default function Loading() {
  return (
    <main className="loading-shell" aria-live="polite" aria-busy="true">
      <div className="loading-card">
        <span className="loading-spinner" aria-hidden="true" />
        <p className="eyebrow">MYPOOL QUOTATION · DEMO V1</p>
        <p className="loading-text">Caricamento...</p>
      </div>
    </main>
  );
}
