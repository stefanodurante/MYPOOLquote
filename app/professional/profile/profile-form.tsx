import Link from "next/link";
import { updateProfessionalProfile } from "./actions";

type OrganizationProfile = {
  name: string;
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

export function ProfileForm({
  organization,
  onboarding = false,
}: {
  organization: OrganizationProfile;
  onboarding?: boolean;
}) {
  return (
    <section className="builder-card">
      <h2>{onboarding ? "Configura il profilo aziendale" : "Profilo professionale"}</h2>
      <p className="muted">
        Questi dati saranno usati nel dashboard e nei PDF dei preventivi.
      </p>
      <form action={updateProfessionalProfile} className="form-grid">
        <label htmlFor="organization-name">Nome commerciale<input id="organization-name" name="name" defaultValue={organization.name} required /></label>
        <label htmlFor="organization-legalName">Ragione sociale<input id="organization-legalName" name="legalName" defaultValue={organization.legalName} required /></label>
        <label htmlFor="organization-taxId">Partita IVA<input id="organization-taxId" name="taxId" defaultValue={organization.taxId} required /></label>
        <label htmlFor="organization-email">Email aziendale<input id="organization-email" name="email" type="email" autoComplete="email" defaultValue={organization.email} required /></label>
        <label htmlFor="organization-phone">Telefono<input id="organization-phone" name="phone" type="tel" inputMode="tel" defaultValue={organization.phone} /></label>
        <label htmlFor="organization-address">Indirizzo<input id="organization-address" name="address" autoComplete="street-address" defaultValue={organization.address} required /></label>
        <label htmlFor="organization-postalCode">CAP<input id="organization-postalCode" name="postalCode" inputMode="numeric" defaultValue={organization.postalCode} /></label>
        <label htmlFor="organization-city">Città<input id="organization-city" name="city" defaultValue={organization.city} required /></label>
        <label htmlFor="organization-logoUrl">URL logo<input id="organization-logoUrl" name="logoUrl" type="url" defaultValue={organization.logoUrl ?? ""} placeholder="https://..." /></label>
        <label htmlFor="organization-quotePrefix">Prefisso preventivo<input id="organization-quotePrefix" name="quotePrefix" maxLength={12} defaultValue={organization.quotePrefix} /></label>
        <label htmlFor="organization-quoteFooter">Nota a piè di pagina<textarea id="organization-quoteFooter" name="quoteFooter" defaultValue={organization.quoteFooter} rows={3} /></label>
        <div className="builder-actions">
          <button className="primary-button">Salva profilo</button>
          {!onboarding && <Link href="/" className="secondary-button">← Dashboard</Link>}
        </div>
      </form>
    </section>
  );
}
