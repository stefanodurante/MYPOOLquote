# Installazione

## Requisiti

- Node.js 20 o superiore
- npm
- Progetto Supabase con PostgreSQL

## Configurazione locale

```bash
npm install
cp .env.example .env.local
```

Completa `.env.local` con:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=un-segreto-lungo-e-casuale
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=una-password-di-sviluppo
STAFF_NAME=MYPOOL Staff
```

Non usare la password PostgreSQL come password staff.

## Database e utente iniziale

```bash
npm run check:env
npm run db:push
npm run seed:organization
npm run seed:catalog
npm run seed:staff
```

`seed:organization` crea `org-default` e associa i dati esistenti.
`seed:staff` crea l'utente indicato da `STAFF_EMAIL`. Per ricrearlo:

```bash
npm run reset:staff
npm run seed:staff
```

Per verificare l'isolamento tra organizzazioni:

```bash
npm run test:multiuser
```

## Sviluppo

```bash
npm run dev -- --hostname 0.0.0.0
```

Apri `/login`. Se compaiono errori 404 dei chunk, ferma Next.js, elimina
`.next` e riavvia.
