import { signInStaff } from "./actions";

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
        <p className="eyebrow">MYPOOL QUOTATION · DEMO V1</p>
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
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          {params.error && <p className="form-error">Email o password non validi.</p>}
          <button className="primary-button">Accedi</button>
        </form>
      </section>
    </main>
  );
}
