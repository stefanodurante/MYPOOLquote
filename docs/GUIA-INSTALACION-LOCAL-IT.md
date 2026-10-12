# Guida semplice all'installazione locale

**Versione del documento:** 1.2

Questa guida è pensata per un installatore di piscine che deve eseguire
MYPOOLquote sul proprio computer senza conoscenze di programmazione.

## 1. Cosa serve

Installa:

- Node.js 20 o superiore: <https://nodejs.org/>
- Git: <https://git-scm.com/downloads>
- Un database Supabase preparato dal responsabile del progetto.

Verifica l'installazione:

```bash
node --version
npm --version
```

## 2. Scaricare il progetto

```bash
git clone https://github.com/stefanodurante/MYPOOLquote.git
cd MYPOOLquote
git checkout master
npm install
```

Se il progetto è già presente:

```bash
cd MYPOOLquote
git pull
npm install
```

## 3. Creare la configurazione locale

```bash
cp .env.example .env.local
nano .env.local
```

Completa le variabili con i dati del responsabile. Non pubblicare `.env.local`,
non inviarlo via email e non caricarlo su GitHub.

Per creare un nuovo segreto:

```bash
openssl rand -base64 32
```

## 4. Preparare database e utente

```bash
npm run check:env
npm run db:push
npm run seed:organization
npm run seed:catalog
npm run seed:staff
```

Se compare `User already exists`, ricrea l'account:

```bash
npm run reset:staff
npm run seed:staff
```

## 5. Avviare l'applicazione

```bash
npm run dev -- --hostname 0.0.0.0
```

Sul computer apri:

```text
http://localhost:3000/login
```

Per fermare l'applicazione premi `Ctrl+C` nella terminale.

## 6. Aprire dal telefono

Collega telefono e computer alla stessa rete Wi-Fi e trova l'indirizzo:

```bash
hostname -I
```

Apri dal telefono l'indirizzo locale, per esempio:

```text
http://192.168.1.123:3000/login
```

Per installare MYPOOL come app usa il deployment HTTPS e apri:

```text
https://TUO-DOMINIO/install
```

## 7. Problemi comuni

### L'applicazione non parte

```bash
pkill -f "next dev" || true
rm -rf .next
npm run dev -- --hostname 0.0.0.0
```

### Email o password non valide

Controlla `STAFF_EMAIL` e `STAFF_PASSWORD`, poi ricrea l'utente con
`reset:staff` e `seed:staff`.

### Errore Server Action obsoleta

Chiudi le schede dell'applicazione, apri una finestra privata e accedi di nuovo.

### Errore 500

Annota URL, ora, dispositivo, browser e operazione. Non inviare password o
screenshot che mostrano segreti.

## 8. Test opzionali

```bash
npm run test:quote
npm run test:roles
npm run test:integration
npm run test:supabase
```
