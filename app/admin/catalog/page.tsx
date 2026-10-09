import Link from "next/link";
import { db } from "@/lib/db";
import { catalogPrices } from "@/lib/db/schema";
import { requireStaff } from "@/lib/session";
import { updateCatalogPrice } from "./actions";

export const dynamic = "force-dynamic";

export default async function CatalogAdminPage() {
  await requireStaff();
  const prices = await db.select().from(catalogPrices).orderBy(catalogPrices.category);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div><p className="eyebrow">MYPOOL QUOTATION</p><h1>Administrar catálogo</h1></div>
        <Link href="/" className="muted">← Preventivos</Link>
      </header>
      <section className="builder-card">
        <p className="muted">Los cambios afectan a nuevos cálculos. Los presupuestos guardados conservan sus importes.</p>
        <div className="catalog-admin-list">
          {prices.map((price) => (
            <form action={updateCatalogPrice} className="catalog-admin-row" key={price.key}>
              <input type="hidden" name="key" value={price.key} />
              <div><strong>{price.label}</strong><small>{price.category} · {price.key}</small></div>
              <input name="value" type="number" min="0" step="0.01" defaultValue={price.value} required />
              <button className="secondary-button">Guardar</button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
