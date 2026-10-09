"use client";

import { useMemo, useState } from "react";
import { saveQuote } from "@/app/actions/quotes";
import { calculateQuote, euro, applyCatalogModel } from "@/lib/quote/calculate";
import { generateQuotePdf } from "@/lib/quote/pdf";
import {
  DEFAULT_INPUTS,
  DEFAULT_PARTY,
  LINING_OPTIONS,
  type CatalogModel,
  type QuoteInputs,
  type QuoteMode,
  type QuoteParty,
  type SavedQuote,
} from "@/lib/quote/types";

type Props = {
  models: CatalogModel[];
  prices: Record<string, number>;
  initialQuote?: SavedQuote | null;
};

export default function QuoteBuilder({ models, prices, initialQuote }: Props) {
  const [party, setParty] = useState<QuoteParty>(initialQuote ?? DEFAULT_PARTY);
  const [inputs, setInputs] = useState<QuoteInputs>(initialQuote?.inputs ?? DEFAULT_INPUTS);
  const [appVersion, setAppVersion] = useState<"pro" | "lite">(initialQuote?.appVersion ?? "pro");
  const [quoteMode, setQuoteMode] = useState<QuoteMode>(initialQuote?.quoteMode ?? "completo");
  const [bom, setBom] = useState<ReturnType<typeof calculateQuote>["bom"]>(
    initialQuote?.bomState ?? {},
  );
  const [message, setMessage] = useState("");

  const result = useMemo(
    () => calculateQuote(inputs, prices, appVersion, quoteMode, bom),
    [inputs, prices, appVersion, quoteMode, bom],
  );

  function updateInput<K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) {
    setInputs((current) => ({ ...current, [key]: value }));
    setBom({});
  }

  function updateParty<K extends keyof QuoteParty>(key: K, value: string) {
    setParty((current) => ({ ...current, [key]: value }));
  }

  function selectModel(id: string) {
    const modelValues = applyCatalogModel(models, id);
    if (modelValues) setInputs((current) => ({ ...current, catalogModel: id, ...modelValues }));
    else updateInput("catalogModel", id);
    setBom({});
  }

  function toggleItem(key: string) {
    setBom((current) => ({
      ...current,
      [key]: { ...(result.bom[key] ?? { price: 0 }), checked: !result.bom[key]?.checked },
    }));
  }

  async function save() {
    if (!party.clientName.trim()) {
      setMessage("Inserisci il nome del cliente.");
      return;
    }
    setMessage("Salvataggio...");
    try {
      const saved = await saveQuote({
        id: initialQuote?.id,
        party,
        appVersion,
        quoteMode,
        inputs,
        lineItems: result.items,
        bomState: result.bom,
        totals: result.totals,
      });
      setMessage(`Preventivo salvato: ${saved.id.slice(0, 8)}`);
    } catch {
      setMessage("Salvataggio non riuscito. Verifica DATABASE_URL e la sessione staff.");
    }
  }

  return (
    <div className="builder">
      <section className="builder-card">
        <h2>1. Dati cliente</h2>
        <div className="form-grid">
          {([
            ["clientName", "Nome cliente"],
            ["clientAddress", "Indirizzo cantiere"],
            ["clientContact", "Telefono / email"],
            ["builderName", "Azienda"],
            ["builderRef", "Referente"],
            ["builderPiva", "Partita IVA"],
          ] as const).map(([key, label]) => (
            <label key={key}>{label}<input value={party[key]} onChange={(e) => updateParty(key, e.target.value)} /></label>
          ))}
        </div>
      </section>

      <section className="builder-card">
        <div className="section-heading"><h2>2. Catalogo e misure</h2><span className="muted">Calcolo live</span></div>
        <div className="form-grid">
          <label>Modello catalogo<select value={inputs.catalogModel} onChange={(e) => selectModel(e.target.value)}>{models.map((model) => <option value={model.id} key={model.id}>{model.label}</option>)}</select></label>
          <label>Tipologia<select value={inputs.poolType} onChange={(e) => updateInput("poolType", e.target.value as QuoteInputs["poolType"])}><option value="skimmer">Skimmer</option><option value="sfioratore">Bordo sfioratore</option><option value="vetroresina">Vetroresina</option><option value="fuoriterra">Fuori terra</option></select></label>
          {([["poolL", "Lunghezza (m)"], ["poolW", "Larghezza (m)"], ["poolH", "Profondità (m)"], ["solariumArea", "Solarium (mq)"]] as const).map(([key, label]) => <label key={key}>{label}<input type="number" step="0.1" value={inputs[key]} onChange={(e) => updateInput(key, Number(e.target.value))} /></label>)}
          <label>Membrana<select value={inputs.liningModel} onChange={(e) => updateInput("liningModel", e.target.value)}>{LINING_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          <label>Ricircolo<select value={inputs.turnoverTime} onChange={(e) => updateInput("turnoverTime", Number(e.target.value))}><option value={4}>4 ore</option><option value={6}>6 ore</option><option value={8}>8 ore</option></select></label>
        </div>
      </section>

      <section className="builder-card">
        <div className="section-heading"><h2>3. Listino e totale</h2><div className="builder-tabs"><button className={appVersion === "pro" ? "active" : ""} onClick={() => setAppVersion("pro")}>PRO</button><button className={appVersion === "lite" ? "active" : ""} onClick={() => setAppVersion("lite")}>LITE</button></div></div>
        <div className="form-grid">
          <label>Vista PRO<select value={quoteMode} onChange={(e) => setQuoteMode(e.target.value as QuoteMode)}><option value="completo">Globale</option><option value="edile">Opere edili</option><option value="impianto">Impianto</option></select></label>
          {([["materialMarkup", "Ricarico materiali (%)"], ["laborMarkup", "Manodopera (%)"], ["companyMargin", "Margine (%)"]] as const).map(([key, label]) => <label key={key}>{label}<input type="number" value={inputs[key]} onChange={(e) => updateInput(key, Number(e.target.value))} /></label>)}
        </div>
        {appVersion === "pro" && <ul className="bom-editor">{result.items.map((item) => <li key={item.key}><label><input type="checkbox" checked={result.bom[item.key]?.checked ?? true} onChange={() => toggleItem(item.key)} />{item.name}</label><strong>€ {euro(result.bom[item.key]?.price ?? item.price)}</strong></li>)}</ul>}
        <div className="total-box"><p>Imponibile: € {euro(result.totals.imponibile)}</p><p>IVA: € {euro(result.totals.vat)}</p><strong>Totale: € {euro(result.totals.total)}</strong></div>
        <div className="builder-actions"><button className="primary-button" onClick={save}>Salva preventivo</button><button className="secondary-button" onClick={async () => generateQuotePdf({ party, inputs, appVersion, quoteMode, items: result.items, bom: result.bom, totals: result.totals })}>Genera PDF</button>{message && <span className="muted">{message}</span>}</div>
      </section>
    </div>
  );
}
