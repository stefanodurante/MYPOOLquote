# Operazioni

## Account staff

Variabili locali:

```env
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=...
```

Per ricreare un account in un ambiente controllato:

```bash
npm run reset:staff
npm run seed:staff
```

Non eseguire il reset in produzione senza aver verificato account e database.

## Diagnosi rapida

- `DATABASE_URL` assente: esegui `npm run check:env`.
- Login senza sessione: controlla `BETTER_AUTH_URL`,
  `BETTER_AUTH_TRUSTED_ORIGINS` e HTTPS.
- Chunk Turbopack 404: ferma Next.js, elimina `.next` e riavvia.
- Errore schema: controlla `npm run db:push` e i log Supabase.
- Prima del deploy: esegui `npm run build`.
- PWA: verifica `/install`, `/manifest.json` e gli icon 192/512.

## Dati

Configura i backup Supabase e prova periodicamente i ripristini. Controlla le
modifiche allo schema prima di applicarle in produzione.
