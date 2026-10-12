"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  const [step, setStep] = useState(1);
  const [party, setParty] = useState<QuoteParty>(initialQuote ?? DEFAULT_PARTY);
  const [inputs, setInputs] = useState<QuoteInputs>(initialQuote?.inputs ?? DEFAULT_INPUTS);
  const [appVersion, setAppVersion] = useState<"pro" | "lite">(initialQuote?.appVersion ?? "pro");
  const [quoteMode, setQuoteMode] = useState<QuoteMode>(initialQuote?.quoteMode ?? "completo");
  const [bom, setBom] = useState<ReturnType<typeof calculateQuote>["bom"]>(
    initialQuote?.bomState ?? {},
  );
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedQuoteId, setSavedQuoteId] = useState(initialQuote?.id ?? "");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!hasChanges) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasChanges]);

  const result = useMemo(
    () => calculateQuote(inputs, prices, appVersion, quoteMode, bom),
    [inputs, prices, appVersion, quoteMode, bom],
  );

  function updateInput<K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) {
    setHasChanges(true);
    setInputs((current) => ({ ...current, [key]: value }));
    setBom({});
  }

  function updateParty<K extends keyof QuoteParty>(key: K, value: string) {
    setHasChanges(true);
    setParty((current) => ({ ...current, [key]: value }));
  }

  function selectModel(id: string) {
    setHasChanges(true);
    const modelValues = applyCatalogModel(models, id);
    if (modelValues) setInputs((current) => ({ ...current, catalogModel: id, ...modelValues }));
    else updateInput("catalogModel", id);
    setBom({});
  }

  function toggleItem(key: string) {
    setHasChanges(true);
    setBom((current) => ({
      ...current,
      [key]: { ...(result.bom[key] ?? { price: 0 }), checked: !result.bom[key]?.checked },
    }));
  }

  function nextStep() {
    if (step === 1 && !party.clientName.trim()) {
      setMessage("Inserisci il nome del cliente prima di continuare.");
      return;
    }
    if (step === 2 && (inputs.poolL <= 0 || inputs.poolW <= 0 || inputs.poolH <= 0)) {
      setMessage("Inserisci misure della piscina maggiori di zero.");
      return;
    }
    if (step === 3 && [inputs.materialMarkup, inputs.laborMarkup, inputs.companyMargin].some((value) => value < 0)) {
      setMessage("I ricarichi e il margine non possono essere negativi.");
      return;
    }
    setMessage("");
    setStep((current) => Math.min(4, current + 1));
  }

  async function save() {
    if (!party.clientName.trim()) {
      setMessage("Inserisci il nome del cliente.");
      setSaveState("error");
      return;
    }
    setSaveState("saving");
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
      setSavedQuoteId(saved.id);
      setHasChanges(false);
      setSaveState("saved");
      setMessage(`Preventivo salvato: ${saved.id.slice(0, 8)}`);
    } catch (error) {
      setSaveState("error");
      const reason = error instanceof Error ? error.message : "";
      setMessage(
        reason === "Unauthorized"
          ? "Sessione scaduta. Accedi nuovamente."
          : reason.startsWith("Invalid")
            ? "Controlla i dati inseriti prima di salvare."
            : "Salvataggio non riuscito. Verifica la connessione e riprova.",
      );
    }
  }

  return (
    <div className="builder">
      <div className="wizard-progress" aria-label="Progresso preventivo">
        {[["1", "Cliente"], ["2", "Piscina"], ["3", "Listino"], ["4", "Revisione"]].map(([number, label]) => (
          <button
            type="button"
            key={number}
            className={step === Number(number) ? "wizard-step active" : "wizard-step"}
            onClick={() => Number(number) < step && setStep(Number(number))}
            disabled={Number(number) > step}
          >
            <strong>{number}</strong>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {step === 1 && <section className="builder-card">
        <h2>1. Dati cliente</h2>
        <div className="form-grid">
          {([
            ["clientName", "Nome cliente"],
            ["clientAddress", "Indirizzo cantiere"],
            ["clientPhone", "Telefono"],
            ["clientEmail", "Email"],
            ["builderName", "Azienda"],
            ["builderRef", "Referente"],
            ["builderPiva", "Partita IVA"],
          ] as const).map(([key, label]) => (
            <label key={key}>{label}<input type={key === "clientEmail" ? "email" : "text"} value={party[key]} onChange={(e) => updateParty(key, e.target.value)} /></label>
          ))}
        </div>
      </section>}

      {step === 2 && <section className="builder-card">
        <div className="section-heading"><h2>2. Catalogo e misure</h2><span className="muted">Calcolo live</span></div>
        <div className="form-grid">
          <label>Modello catalogo<select value={inputs.catalogModel} onChange={(e) => selectModel(e.target.value)} disabled={models.length === 0}>{models.map((model) => <option value={model.id} key={model.id}>{model.label}</option>)}</select>{models.length === 0 && <small className="form-hint">Nessun modello disponibile. Un membro staff deve eseguire il seed del catalogo.</small>}</label>
          <label>Tipologia<select value={inputs.poolType} onChange={(e) => updateInput("poolType", e.target.value as QuoteInputs["poolType"])}><option value="skimmer">Skimmer</option><option value="sfioratore">Bordo sfioratore</option><option value="vetroresina">Vetroresina</option><option value="fuoriterra">Fuori terra</option></select></label>
          {([["poolL", "Lunghezza (m)"], ["poolW", "Larghezza (m)"], ["poolH", "Profondità (m)"], ["solariumArea", "Solarium (mq)"]] as const).map(([key, label]) => <label key={key}>{label}<input type="number" step="0.1" value={inputs[key]} onChange={(e) => updateInput(key, Number(e.target.value))} /></label>)}
          <label>Membrana<select value={inputs.liningModel} onChange={(e) => updateInput("liningModel", e.target.value)}>{LINING_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          <label>Ricircolo<select value={inputs.turnoverTime} onChange={(e) => updateInput("turnoverTime", Number(e.target.value))}><option value={4}>4 ore</option><option value={6}>6 ore</option><option value={8}>8 ore</option></select></label>
        </div>
      </section>}

      {step === 3 && <section className="builder-card">
        <div className="section-heading"><h2>3. Listino e totale</h2><div className="builder-tabs"><button type="button" className={appVersion === "pro" ? "active" : ""} onClick={() => { setHasChanges(true); setAppVersion("pro"); }}>PRO</button><button type="button" className={appVersion === "lite" ? "active" : ""} onClick={() => { setHasChanges(true); setAppVersion("lite"); }}>LITE</button></div></div>
        <div className="form-grid">
          <label>Vista PRO<select value={quoteMode} onChange={(e) => { setHasChanges(true); setQuoteMode(e.target.value as QuoteMode); }}><option value="completo">Globale</option><option value="edile">Opere edili</option><option value="impianto">Impianto</option></select></label>
          {([["materialMarkup", "Ricarico materiali (%)"], ["laborMarkup", "Manodopera (%)"], ["companyMargin", "Margine (%)"]] as const).map(([key, label]) => <label key={key}>{label}<input type="number" value={inputs[key]} onChange={(e) => updateInput(key, Number(e.target.value))} /></label>)}
        </div>
        {appVersion === "pro" && <ul className="bom-editor">{result.items.map((item) => <li key={item.key}><label><input type="checkbox" checked={result.bom[item.key]?.checked ?? true} onChange={() => toggleItem(item.key)} />{item.name}</label><strong>€ {euro(result.bom[item.key]?.price ?? item.price)}</strong></li>)}</ul>}
        <div className="total-box"><p>Imponibile: € {euro(result.totals.imponibile)}</p><p>IVA: € {euro(result.totals.vat)}</p><strong>Totale: € {euro(result.totals.total)}</strong></div>
      </section>}

      {step === 4 && <section className="builder-card">
        <h2>4. Revisione e salvataggio</h2>
        <div className="review-grid">
          <div><span className="muted">Cliente</span><strong>{party.clientName || "Da completare"}</strong><span>{party.clientAddress || "Indirizzo non inserito"}</span></div>
          <div><span className="muted">Configurazione</span><strong>{inputs.poolL} × {inputs.poolW} × {inputs.poolH} m</strong><span>{appVersion.toUpperCase()} · {quoteMode}</span></div>
          <div><span className="muted">Totale preventivo</span><strong>€ {euro(result.totals.total)}</strong><span>IVA inclusa</span></div>
        </div>
        <div className="builder-actions">
          <button type="button" className="primary-button" onClick={save} disabled={saveState === "saving"}>
            {saveState === "saving" ? "Salvataggio..." : "Salva preventivo"}
          </button>
          <button type="button" className="secondary-button" onClick={async () => generateQuotePdf({ party, inputs, appVersion, quoteMode, items: result.items, bom: result.bom, totals: result.totals })}>Genera PDF</button>
          {savedQuoteId && <Link href={`/quotes/${savedQuoteId}`} className="secondary-button">Apri preventivo salvato</Link>}
        </div>
        {message && <p className={saveState === "error" ? "form-error" : "save-message"} role="status">{message}</p>}
      </section>}

      <div className="wizard-navigation">
        <button type="button" className="secondary-button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>← Indietro</button>
        {step < 4 && <button type="button" className="primary-button" onClick={nextStep}>Continua →</button>}
      </div>
    </div>
  );
}
