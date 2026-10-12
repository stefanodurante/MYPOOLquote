import Link from "next/link";
import { db } from "@/lib/db";
import { catalogModels } from "@/lib/db/schema";
import { requireStaff } from "@/lib/session";
import { createCatalogModel, updateCatalogModel } from "../actions";

export const dynamic = "force-dynamic";

const poolTypes = [
  ["skimmer", "Skimmer"],
  ["sfioratore", "Bordo sfioratore"],
  ["vetroresina", "Vetroresina"],
  ["fuoriterra", "Fuori terra"],
] as const;

export default async function CatalogModelsPage() {
  await requireStaff();
  const models = await db.select().from(catalogModels).orderBy(catalogModels.label);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MYPOOL QUOTATION</p>
          <h1>Modelli di piscine</h1>
        </div>
        <Link href="/admin" className="muted">← Amministrazione</Link>
      </header>
      <section className="builder-card">
        <h2>Aggiungi modello</h2>
        <form action={createCatalogModel} className="form-grid catalog-model-form">
          <label>ID interno<input name="id" placeholder="modello-8x4" required /></label>
          <label>Nome<input name="label" placeholder="Modello 8 x 4 m" required /></label>
          <label>Lunghezza (m)<input name="lengthM" type="number" min="0.1" step="0.1" required /></label>
          <label>Larghezza (m)<input name="widthM" type="number" min="0.1" step="0.1" required /></label>
          <label>Profondità (m)<input name="depthM" type="number" min="0.1" step="0.1" required /></label>
          <label>Tipologia<select name="poolType" defaultValue="skimmer">{poolTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <button className="primary-button">Aggiungi modello</button>
        </form>
      </section>
      <section className="builder-card">
        <h2>Modelli esistenti</h2>
        <div className="catalog-admin-list">
          {models.map((model) => (
            <form action={updateCatalogModel} className="catalog-admin-row" key={model.id}>
              <input type="hidden" name="id" value={model.id} />
              <div><strong>{model.label}</strong><small>{model.id} · {model.poolType}</small></div>
              <input name="label" value={model.label} readOnly aria-label={`Nombre ${model.label}`} />
              <input name="lengthM" type="hidden" value={model.lengthM} readOnly />
              <input name="widthM" type="hidden" value={model.widthM} readOnly />
              <input name="depthM" type="hidden" value={model.depthM} readOnly />
              <input name="poolType" type="hidden" value={model.poolType} readOnly />
              <label className="catalog-active"><input name="active" type="checkbox" defaultChecked={model.active} /> Activo</label>
              <button className="secondary-button">Guardar</button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
