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

export async function generateQuotePdf(opts: {
  party: QuoteParty;
  inputs: QuoteInputs;
  appVersion: AppVersion;
  quoteMode: QuoteMode;
  items: LineItem[];
  bom: BomState;
  totals: QuoteTotals;
  organization?: {
    legalName: string;
    taxId: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
    logoUrl: string | null;
    quotePrefix: string;
    quoteFooter: string;
  };
}) {
  const { party, inputs, appVersion, quoteMode, items, bom, totals, organization } = opts;
  const doc = new jsPDF();
  const quoteNumber = `${organization?.quotePrefix || "MP"}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${party.clientName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase()}`;

  try {
    const response = await fetch(organization?.logoUrl || "/logo-piscina.png");
    const logoData = await response.blob();
    const reader = new FileReader();
    const logo = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(logoData);
    });
    doc.addImage(logo, "PNG", 166, 8, 28, 28);
  } catch {
    // PDF generation remains available if the optional logo asset cannot load.
  }

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
  doc.text(`Nº: ${quoteNumber}`, 170, 32, { align: "right" });

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("DATI COSTRUTTORE:", 14, 39);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Azienda: ${organization?.legalName || party.builderName} (P.IVA: ${organization?.taxId || party.builderPiva})`,
    14,
    45,
  );
  if (organization) {
    doc.text(`${organization.address}, ${organization.postalCode} ${organization.city}`, 14, 50);
    doc.text(`Telefono: ${organization.phone} - Email: ${organization.email}`, 14, 55);
  }

  doc.setFont("helvetica", "bold");
  doc.text("DATI CLIENTE:", 14, organization ? 63 : 53);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Cliente: ${party.clientName} - Cantiere: ${party.clientAddress}`,
    14,
    organization ? 69 : 59,
  );
  doc.text(`Telefono: ${party.clientPhone} - Email: ${party.clientEmail}`, 14, organization ? 75 : 65);

  doc.setFont("helvetica", "bold");
  doc.text("SPECIFICHE CATALOGO UFFICIALE:", 14, organization ? 83 : 73);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Tipologia: ${inputs.poolType.toUpperCase()} | Membrana: Renolit Alkorplan ${inputs.liningModel.toUpperCase()}`,
    14,
    organization ? 89 : 79,
  );
  doc.text(`Dimensioni: ${inputs.poolL}m x ${inputs.poolW}m x ${inputs.poolH}m`, 14, organization ? 95 : 85);

  let y = organization ? 106 : 96;

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
  if (organization?.quoteFooter) {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(organization.quoteFooter, 14, 285, { maxWidth: 180 });
  }

  const filename = `Preventivo_Catalog_${appVersion}_${party.clientName.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
