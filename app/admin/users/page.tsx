import { db } from "@/lib/db";
import { clients, organizations, user } from "@/lib/db/schema";
import { requireStaff } from "@/lib/session";
import { createManagedUser, linkCustomerToClient } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireStaff();
  const [organizationRows, users, clientRows] = await Promise.all([
    db.select({ id: organizations.id, name: organizations.name }).from(organizations),
    db.select({ id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId }).from(user),
    db.select({ id: clients.id, name: clients.name, customerUserId: clients.customerUserId }).from(clients),
  ]);
  const customers = users.filter((item) => item.role === "customer");

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div><p className="eyebrow">MYPOOL QUOTATION · Demo V1</p><h1>Usuarios y organizaciones</h1></div>
        <a href="/admin" className="muted">← Administración</a>
      </header>
      <section className="builder-card">
        <h2>Crear profesional o cliente</h2>
        <form action={createManagedUser} className="form-grid">
          <input name="name" placeholder="Nombre" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" minLength={12} placeholder="Contraseña (12 caracteres)" required />
          <select name="role" defaultValue="professional"><option value="professional">Professional</option><option value="customer">Customer</option></select>
          <select name="organizationId" required><option value="">Organización</option>{organizationRows.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}</select>
          <button className="primary-button">Crear usuario</button>
        </form>
      </section>
      <section className="builder-card">
        <h2>Vincular customer con cliente final</h2>
        <form action={linkCustomerToClient} className="form-grid">
          <select name="customerUserId" required><option value="">Customer</option>{customers.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.email}</option>)}</select>
          <select name="clientId" required><option value="">Cliente final</option>{clientRows.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <button className="secondary-button">Vincular</button>
        </form>
      </section>
      <section className="builder-card">
        <h2>Usuarios existentes</h2>
        <ul className="audit-list">{users.map((item) => <li key={item.id}><strong>{item.name}</strong><span>{item.role} · {item.email} · {item.organizationId ?? "global"}</span></li>)}</ul>
      </section>
    </main>
  );
}
