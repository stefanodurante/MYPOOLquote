import { jsPDF } from "jspdf";
import { euro } from "./calculate";
import type {
  AppVersion,
  BomState,
  LineItem,
  QuoteInputs,
  QuoteMode,
  QuoteParty,
  QuoteTotals,
} from "./types";

export function generateQuotePdf(opts: {
  party: QuoteParty;
  inputs: QuoteInputs;
  appVersion: AppVersion;
  quoteMode: QuoteMode;
  items: LineItem[];
  bom: BomState;
  totals: QuoteTotals;
}) {
  const { party, inputs, appVersion, quoteMode, items, bom, totals } = opts;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(14, 165, 233);
  doc.text("MYPOOL QUOTATION", 14, 18);

  const titlePDF =
    appVersion === "lite"
      ? "PREVENTIVO CATALOGO (LITE)"
      : `PREVENTIVO PRO CATALOGO (${quoteMode.toUpperCase()})`;
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(titlePDF, 14, 25);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Data: ${new Date().toLocaleDateString("it-IT")}`, 14, 32);

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("DATI COSTRUTTORE:", 14, 39);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Azienda: ${party.builderName} (P.IVA: ${party.builderPiva}) - Rif: ${party.builderRef}`,
    14,
    45,
  );

  doc.setFont("helvetica", "bold");
  doc.text("DATI CLIENTE:", 14, 53);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Cliente: ${party.clientName} - Cantiere: ${party.clientAddress} (${party.clientContact})`,
    14,
    59,
  );

  doc.setFont("helvetica", "bold");
  doc.text("SPECIFICHE CATALOGO UFFICIALE:", 14, 67);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Tipologia: ${inputs.poolType.toUpperCase()} | Membrana: Renolit Alkorplan ${inputs.liningModel.toUpperCase()}`,
    14,
    73,
  );
  doc.text(`Dimensioni: ${inputs.poolL}m x ${inputs.poolW}m x ${inputs.poolH}m`, 14, 79);

  let y = 90;

  if (appVersion === "lite") {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SINTESI ECONOMICA MACRO-VOCI:", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("- Subtotale Lavori Edili (IVA incl.):", 14, y);
    doc.text(`€ ${euro(totals.edileFinal)}`, 170, y, { align: "right" });
    y += 7;
    doc.text("- Subtotale Impianto & Accessori (IVA incl.):", 14, y);
    doc.text(`€ ${euro(totals.impiantoFinal)}`, 170, y, { align: "right" });
    y += 10;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VOCI DI COMPUTO SELEZIONATE:", 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      if (bom[item.key]?.checked) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`- ${item.name}`.slice(0, 90), 14, y);
        doc.text(`€ ${euro(bom[item.key].price)}`, 170, y, { align: "right" });
        y += 7;
      }
    });
    y += 8;
  }

  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.text(`Imponibile: € ${euro(totals.imponibile)}`, 170, y, { align: "right" });
  y += 7;
  doc.text(
    `IVA (${(totals.vatRateVal * 100).toFixed(0)}%): € ${euro(totals.vat)}`,
    170,
    y,
    { align: "right" },
  );
  y += 9;
  doc.setFontSize(13);
  doc.setTextColor(14, 165, 233);
  doc.text(`TOTALE: € ${euro(totals.total)}`, 170, y, { align: "right" });

  const filename = `Preventivo_Catalog_${appVersion}_${party.clientName.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
