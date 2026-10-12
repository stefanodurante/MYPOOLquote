# Deploy web

## Vercel

1. Importa il repository `stefanodurante/MYPOOLquote`.
2. Seleziona il branch `master` per la produzione.
3. Configura le variabili in Project Settings, mai nel repository.
4. Esegui il primo deploy.

Variabili minime:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=segreto-produzione-lungo-e-nuovo
BETTER_AUTH_URL=https://preproduction.example.com
BETTER_AUTH_TRUSTED_ORIGINS=https://preproduction.example.com
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=...
STAFF_NAME=MYPOOL Staff
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`BETTER_AUTH_SECRET` deve essere diverso dal segreto locale. `BETTER_AUTH_URL`
e `BETTER_AUTH_TRUSTED_ORIGINS` devono corrispondere esattamente al dominio
HTTPS pubblicato.

Le variabili `NEXT_PUBLIC_SUPABASE_*` non sono segreti privati, ma devono
appartenere allo stesso progetto Supabase indicato da `DATABASE_URL`.

## Database

Collega `DATABASE_URL` al database Supabase corretto ed esegui una volta da un
ambiente sicuro, mai durante il build Vercel:

```bash
npm run db:push
npm run seed:organization
npm run seed:staff
```

Usa una password staff diversa da quella del database. Condividi le
credenziali tramite un canale privato.

## Checklist

- `npm run build` termina correttamente.
- `BETTER_AUTH_URL` corrisponde al dominio HTTPS.
- Il dominio è presente in `BETTER_AUTH_TRUSTED_ORIGINS`.
- `.env.local` non è versionato.
- Il login crea un cookie di sessione HTTPS.
- Lo staff può aprire la dashboard e salvare un preventivo.
- `/manifest.json`, `/icon-192.png` e `/icon-512.png` rispondono con HTTP 200.
- Su Android compare l'opzione per installare MYPOOL.
- Supabase ha backup e limiti verificati.

## Rollback

Vercel permette di tornare al deployment precedente. Durante un rollback non
eseguire `db:push` senza aver prima controllato le modifiche allo schema.
