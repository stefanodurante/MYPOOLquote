export type AppVersion = "pro" | "lite";
export type QuoteMode = "completo" | "edile" | "impianto";
export type PoolType = "skimmer" | "sfioratore" | "vetroresina" | "fuoriterra";

export type CatalogModel = {
  id: string;
  label: string;
  l: number;
  w: number;
  h: number;
  type: PoolType;
  imageUrl?: string | null;
};

export type QuoteInputs = {
  catalogModel: string;
  poolType: PoolType;
  poolL: number;
  poolW: number;
  poolH: number;
  turnoverTime: number;
  liningModel: string;
  solariumArea: number;
  solarShower: string;
  heatPump: string;
  poolCover: string;
  materialMarkup: number;
  laborMarkup: number;
  companyMargin: number;
  vatRate: number;
};

export type LineItem = {
  key: string;
  name: string;
  price: number;
  cat: "edile" | "impianto" | "other";
};

export type BomEntry = {
  checked: boolean;
  price: number;
  overridden?: boolean;
};

export type BomState = Record<string, BomEntry>;

export type QuoteTotals = {
  imponibile: number;
  vat: number;
  total: number;
  vatRateVal: number;
  edileFinal: number;
  impiantoFinal: number;
  volume: number;
  flowRate: number;
  velocity: number;
};

export type QuoteParty = {
  builderName: string;
  builderRef: string;
  builderPiva: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
};

export type SavedQuote = QuoteParty & {
  id: string;
  appVersion: AppVersion;
  quoteMode: QuoteMode;
  status: string;
  inputs: QuoteInputs;
  lineItems: LineItem[];
  bomState: BomState;
  totals: QuoteTotals;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_INPUTS: QuoteInputs = {
  catalogModel: "fluidra_8x4",
  poolType: "skimmer",
  poolL: 8,
  poolW: 4,
  poolH: 1.4,
  turnoverTime: 6,
  liningModel: "touch",
  solariumArea: 50,
  solarShower: "standard",
  heatPump: "inverter_std",
  poolCover: "bubble",
  materialMarkup: 35,
  laborMarkup: 40,
  companyMargin: 18,
  vatRate: 0.22,
};

export const DEFAULT_PARTY: QuoteParty = {
  builderName: "MYPOOL S.r.l.",
  builderRef: "Mario Rossi",
  builderPiva: "IT12345678901",
  clientName: "Giuseppe Verdi",
  clientAddress: "Via Roma 10, Milano",
  clientContact: "333 1234567 - info@email.it",
};

export const LINING_OPTIONS = [
  { value: "1000", label: "Alkorplan 1000 (Tinta Unita 1,5 mm)" },
  { value: "2000", label: "Alkorplan 2000 (Laccato 1,5 mm)" },
  { value: "touch", label: "Alkorplan Touch (Effetto Pietra 2 mm)" },
  { value: "evolve", label: "Alkorplan Ceramics Evolve" },
] as const;
