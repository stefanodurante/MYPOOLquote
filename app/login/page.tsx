"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setError("Email o password non validi.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <img src="/logo-piscina.png" alt="MYPOOL" className="auth-logo" />
        <p className="eyebrow">MYPOOL QUOTATION</p>
        <h1>Accesso staff</h1>
        <p className="muted">Accedi per creare e gestire i preventivi.</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </section>
    </main>
  );
}
