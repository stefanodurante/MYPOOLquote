import type {
  AppVersion,
  BomState,
  CatalogModel,
  LineItem,
  QuoteInputs,
  QuoteMode,
  QuoteTotals,
} from "./types";

export function suggestedSolariumArea(l: number, w: number) {
  return Math.round((l + 3) * (w + 3) - l * w);
}

export function catalogVisual(type: string, lining: string) {
  let imageUrl =
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80";
  let badgeText = "Fluidra Skimmer Residential";

  if (type === "sfioratore") {
    imageUrl =
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
    badgeText = "Fluidra Mirror High-End";
  } else if (type === "vetroresina") {
    imageUrl =
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
    badgeText = "Puls Monoblocco Liberty GFK";
  } else if (type === "fuoriterra") {
    imageUrl =
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80";
    badgeText = "Direct Industry / Puls Fuori Terra";
  }

  if (lining === "touch") badgeText += " + Renolit Alkorplan Touch";
  else if (lining === "evolve") badgeText += " + Renolit Alkorplan Ceramics Evolve";

  return { imageUrl, badgeText };
}

export function applyCatalogModel(
  models: CatalogModel[],
  id: string,
): Pick<QuoteInputs, "poolL" | "poolW" | "poolH" | "poolType" | "solariumArea"> | null {
  const model = models.find((m) => m.id === id);
  if (!model) return null;
  return {
    poolL: model.l,
    poolW: model.w,
    poolH: model.h,
    poolType: model.type,
    solariumArea: suggestedSolariumArea(model.l, model.w),
  };
}

function price(prices: Record<string, number>, key: string, fallback = 0) {
  const value = prices[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function calculateQuote(
  inputs: QuoteInputs,
  prices: Record<string, number>,
  appVersion: AppVersion,
  quoteMode: QuoteMode,
  previousBom: BomState = {},
): { items: LineItem[]; bom: BomState; totals: QuoteTotals } {
  const l = inputs.poolL || 0;
  const w = inputs.poolW || 0;
  const h = inputs.poolH || 0;
  const t = inputs.turnoverTime || 6;
  const pType = inputs.poolType;
  const lining = inputs.liningModel;
  const matMarkup = (inputs.materialMarkup || 0) / 100;
  const labMarkup = (inputs.laborMarkup || 0) / 100;
  const compMargin = (inputs.companyMargin || 0) / 100;
  const vatPercentage = inputs.vatRate || 0;

  const volume = l * w * h;
  const flowRate = t ? volume / t : 0;
  const pipeArea = Math.PI * Math.pow(0.027, 2);
  const velocity = pipeArea ? flowRate / 3600 / pipeArea : 0;

  const skimmerCount = l > 10 ? 3 : l > 6 ? 2 : 1;
  const jetsCount = Math.max(2, Math.ceil((l * 2 + w * 2) / 4));
  const ledCount = l > 10 ? 3 : l > 6 ? 2 : 1;

  let baseMatCost = price(prices, "base_mat_skimmer", 140);
  if (pType === "sfioratore") baseMatCost = price(prices, "base_mat_sfioratore", 185);
  if (pType === "vetroresina") baseMatCost = price(prices, "base_mat_vetroresina", 160);
  if (pType === "fuoriterra") baseMatCost = price(prices, "base_mat_fuoriterra", 110);

  const surfaceArea = l * w + 2 * (l + w) * h;
  const rawMaterials = surfaceArea * baseMatCost;
  const solariumMq = inputs.solariumArea || 0;
  const solariumTotal = solariumMq * price(prices, "solarium_per_mq", 55) * (1 + matMarkup);

  const showerVal = inputs.solarShower;
  const showerTotal =
    showerVal === "standard"
      ? price(prices, "shower_standard", 450) * (1 + matMarkup)
      : showerVal === "luxury"
        ? price(prices, "shower_luxury", 850) * (1 + matMarkup)
        : 0;

  const hpVal = inputs.heatPump;
  const hpTotal =
    hpVal === "inverter_std"
      ? price(prices, "heatpump_inverter_std", 1800) * (1 + matMarkup)
      : hpVal === "inverter_pro"
        ? price(prices, "heatpump_inverter_pro", 2800) * (1 + matMarkup)
        : 0;

  const coverVal = inputs.poolCover;
  const coverTotal =
    coverVal === "bubble"
      ? price(prices, "cover_bubble", 650) * (1 + matMarkup)
      : coverVal === "automatic"
        ? price(prices, "cover_automatic", 4500) * (1 + matMarkup)
        : 0;

  let liningUnitPrice = price(prices, "lining_1000", 32);
  if (lining === "2000") liningUnitPrice = price(prices, "lining_2000", 38);
  if (lining === "touch") liningUnitPrice = price(prices, "lining_touch", 48);
  if (lining === "evolve") liningUnitPrice = price(prices, "lining_evolve", 55);

  const itemStruct = rawMaterials * 0.35 * (1 + matMarkup);
  const itemLining = surfaceArea * liningUnitPrice * (1 + matMarkup);
  const filterThreshold = price(prices, "filter_flow_threshold", 25);
  const itemFilter =
    (flowRate > filterThreshold
      ? price(prices, "filter_large", 2400)
      : price(prices, "filter_small", 1600)) *
    (1 + matMarkup);

  let itemHydraulics = 0;
  let hydraulicsLabel = "";
  if (pType === "sfioratore") {
    hydraulicsLabel = "Canale Bordo Sfioratore Mirror & Vasca Compenso (Fluidra)";
    itemHydraulics =
      ((l * 2 + w * 2) * price(prices, "overflow_per_meter", 95) +
        jetsCount * price(prices, "jet_unit", 45)) *
      (1 + matMarkup);
  } else {
    hydraulicsLabel = `Skimmer Fluidra (${skimmerCount} pz) & Bocchette (${jetsCount} pz)`;
    itemHydraulics =
      (skimmerCount * price(prices, "skimmer_unit", 120) +
        jetsCount * price(prices, "jet_unit", 45)) *
      (1 + matMarkup);
  }

  const itemElectric =
    (ledCount * price(prices, "led_unit", 220) + price(prices, "electric_base", 450)) *
    (1 + matMarkup);
  const itemPipes = l * w * price(prices, "pipes_per_mq", 12) * (1 + matMarkup);

  const allItemsList: LineItem[] = [
    {
      key: "struct",
      name: `Struttura & Scavi [Catalog: ${pType.toUpperCase()}]`,
      price: itemStruct,
      cat: "edile",
    },
    {
      key: "lining",
      name: `Membrana Renolit Alkorplan [${lining.toUpperCase()}] (~${surfaceArea.toFixed(0)} mq)`,
      price: itemLining,
      cat: "edile",
    },
    {
      key: "solarium",
      name: `Pavimentazione Solare Perimetrale (${solariumMq} mq)`,
      price: solariumTotal,
      cat: "edile",
    },
    {
      key: "filter",
      name: `Filtro a Sabbia & Pompa Fluidra (${flowRate.toFixed(1)} m³/h)`,
      price: itemFilter,
      cat: "impianto",
    },
    {
      key: "hydraulics",
      name: hydraulicsLabel,
      price: itemHydraulics,
      cat: "impianto",
    },
    {
      key: "electric",
      name: `Quadro Elettrico CE & ${ledCount} Fari LED`,
      price: itemElectric,
      cat: "impianto",
    },
    {
      key: "pipes",
      name: "Tubazioni PN16 & Pozzetti di Ispezione",
      price: itemPipes,
      cat: "impianto",
    },
    {
      key: "shower",
      name: "Doccia Solare da Esterno (Puls/Fluidra)",
      price: showerTotal,
      cat: "impianto",
    },
    {
      key: "heatpump",
      name: "Pompa di Calore Inverter",
      price: hpTotal,
      cat: "impianto",
    },
    {
      key: "cover",
      name: "Copertura Piscina",
      price: coverTotal,
      cat: "impianto",
    },
  ];

  const rawItemsList =
    appVersion === "lite"
      ? allItemsList
      : allItemsList.filter((it) => quoteMode === "completo" || it.cat === quoteMode);

  const bom: BomState = { ...previousBom };

  const mergeItem = (item: LineItem) => {
    const prev = bom[item.key];
    if (!prev) {
      bom[item.key] = { checked: true, price: item.price };
    } else if (prev.overridden) {
      bom[item.key] = { ...prev, price: prev.price };
    } else {
      bom[item.key] = { ...prev, price: item.price };
    }
  };

  rawItemsList.forEach(mergeItem);

  const subMatActive = rawItemsList.reduce((acc, curr) => {
    const entry = bom[curr.key];
    return acc + (entry?.checked ? entry.price : 0);
  }, 0);

  const sumEdileMaterials = allItemsList
    .filter((it) => it.cat === "edile")
    .reduce((acc, curr) => acc + curr.price, 0);
  const sumImpiantoMaterials = allItemsList
    .filter((it) => it.cat === "impianto")
    .reduce((acc, curr) => acc + curr.price, 0);

  const laborCost = subMatActive * labMarkup;
  const companyUtile = (subMatActive + laborCost) * compMargin;

  const ratioEdile = subMatActive > 0 ? sumEdileMaterials / subMatActive : 0.5;
  const ratioImpianto = subMatActive > 0 ? sumImpiantoMaterials / subMatActive : 0.5;
  const subEdileFinal = sumEdileMaterials + laborCost * ratioEdile + companyUtile * ratioEdile;
  const subImpiantoFinal =
    sumImpiantoMaterials + laborCost * ratioImpianto + companyUtile * ratioImpianto;

  const laborLabel =
    quoteMode === "edile"
      ? "Manodopera Opere Edili & Scavi"
      : quoteMode === "impianto"
        ? "Installazione & Montaggio Impianto"
        : "Manodopera Specializzata & Scavi Edili";

  const laborItem: LineItem = { key: "labor", name: laborLabel, price: laborCost, cat: "other" };
  const marginItem: LineItem = {
    key: "margin",
    name: "Margine d'Impresa / Utile",
    price: companyUtile,
    cat: "other",
  };

  mergeItem(laborItem);
  mergeItem(marginItem);
  if (!bom.labor?.overridden) bom.labor.price = laborCost;
  if (!bom.margin?.overridden) bom.margin.price = companyUtile;

  const items = [
    ...rawItemsList,
    { ...laborItem, price: bom.labor.price },
    { ...marginItem, price: bom.margin.price },
  ];

  let totalImponibile = 0;
  items.forEach((it) => {
    if (bom[it.key]?.checked) totalImponibile += bom[it.key].price;
  });

  const calculatedVat = totalImponibile * vatPercentage;
  const totals: QuoteTotals = {
    imponibile: totalImponibile,
    vat: calculatedVat,
    total: totalImponibile + calculatedVat,
    vatRateVal: vatPercentage,
    edileFinal: subEdileFinal * (1 + vatPercentage),
    impiantoFinal: subImpiantoFinal * (1 + vatPercentage),
    volume,
    flowRate,
    velocity,
  };

  return { items, bom, totals };
}

export function euro(value: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
