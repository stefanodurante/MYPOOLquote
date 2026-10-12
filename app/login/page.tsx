import { signInStaff } from "./actions";
import { PasswordInput } from "./password-input";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <img src="/logo-piscina.png" alt="MYPOOL" className="auth-logo" />
        <p className="eyebrow">MYPOOL QUOTATION</p>
        <h1>Accesso staff</h1>
        <p className="muted">Accedi per creare e gestire i preventivi.</p>

        <form action={signInStaff} className="auth-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <PasswordInput />
          </label>
          {params.error && <p className="form-error">Email o password non validi.</p>}
          <button className="primary-button">Accedi</button>
        </form>
        <p className="form-hint">
          Vuoi provarla sul telefono?{" "}
          <Link href="/install">Installa MYPOOL come app</Link>
        </p>
      </section>
    </main>
  );
}
