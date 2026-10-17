# Miglioramenti

## Versione Demo

La versione visibile attuale è `Demo V1.0.2`. Ogni nuova feature deve
incrementare la versione patch: `1.0.2` → `1.0.3`. Aggiorna
`lib/app-version.ts` per mantenere coerenti badge, metadati e PWA.

## Prima della produzione

1. [x] Automatizzare i test di calcolo, login, autorizzazione e persistenza.
2. [x] Aggiungere pagine di errore e logging strutturato.
3. [x] Verificare rate limiting, CSRF, origini affidabili e cookie HTTPS.
4. [x] Validare lato server gli input e i limiti numerici.
5. [x] Aggiungere CI con lint, typecheck, build e migrazione su database di test.
6. [x] Aggiungere test di integrazione Supabase per connessione, schema,
   autenticazione e persistenza.

## Ciclo completato

1. [x] Modifica e dettaglio dei preventivi salvati.
2. [x] Ricerca, filtri, paginazione e stati nel dashboard.
3. [x] Pannello staff per catalogo e prezzi.
4. [x] Storico e audit della creazione e modifica dei preventivi.
5. [x] Esportazione PDF con logo, numerazione e dati fiscali.
6. [x] Seed idempotente e gestione dei modelli piscina.
7. [x] Separazione di telefono ed email del cliente finale.
8. [x] Hub staff di amministrazione.

## Backlog prioritario

### P0 — Fondazione multiutente

1. [x] Definire i ruoli `staff`, `professional` e `customer`.
2. [x] Dividere il modulo preventivo in passi per l'uso mobile.
3. [x] Rendere affidabile il salvataggio del preventivo.
4. [x] Aggiungere la schermata di caricamento.
5. [x] Aggiungere isolamento tramite `organizationId` a utenti, clienti,
   preventivi, catalogo ed eventi.
6. [x] Applicare autorizzazione server-side per separare le organizzazioni.
7. [x] Aggiungere test con due organizzazioni (`npm run test:multiuser`).

### P1 — Prodotto per professionisti

1. Creare onboarding e profilo professionale.
2. Permettere la gestione dei clienti e dei preventivi.
3. Permettere cataloghi, prezzi e modelli propri.
4. Usare i dati fiscali e il marchio del professionista nel PDF.
5. Aggiungere dashboard professionale con stati, ricerca e storico.

### P2 — Accesso del cliente finale

1. Collegare i clienti finali a un professionista.
2. Creare link sicuri per visualizzare solo i preventivi collegati.
3. Aggiungere invio, visualizzazione, accettazione e rifiuto.
4. Aggiungere notifiche email.

### P3 — Commercializzazione e operatività

1. Aggiungere localizzazione completa in italiano, spagnolo e inglese.
2. Aggiungere piani, limiti e abbonamenti.
3. Aggiungere monitoring, backup verificati e preview deployment.
4. [x] Aggiungere la guida italiana per installazione e test della PWA.
5. [x] Rilevare le nuove versioni della PWA e permettere l'aggiornamento
   confermato dall'utente senza interrompere il wizard con modifiche non salvate.

## Note operative

- Per una base esistente eseguire `npm run db:push` e
  `npm run seed:organization`.
- La PWA si installa dal percorso `/install` usando HTTPS.
