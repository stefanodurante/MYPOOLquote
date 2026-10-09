"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MYPOOLquote application error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">MYPOOL QUOTATION</p>
        <h1>Se produjo un error</h1>
        <p className="muted">No se pudo completar la operación solicitada.</p>
        <button className="primary-button" onClick={() => reset()}>
          Reintentar
        </button>
      </section>
    </main>
  );
}
