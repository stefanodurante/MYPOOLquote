# Guida rapida per il tester

## 1. Aprire l'applicazione

Apri l'URL di test ricevuto, ad esempio:

```text
https://URL-DELL-APP.vercel.app
```

Usa Chrome su Android oppure Safari su iPhone. L'applicazione richiede una
connessione HTTPS.

## 2. Installare MYPOOL sul telefono

### Android

1. Apri l'URL con Chrome.
2. Tocca il menu con i tre puntini.
3. Scegli **Installa app** o **Aggiungi alla schermata Home**.
4. Conferma l'installazione.

### iPhone

1. Apri l'URL con Safari.
2. Tocca il pulsante **Condividi**.
3. Scegli **Aggiungi alla schermata Home**.
4. Conferma con **Aggiungi**.

## 3. Accedere a Demo V1

Questa è una credenziale temporanea per la demo:

```text
Email: staff@mypoolquote.local
Password: DemoV1-MYPOOL-2026!
```

Non usare questa credenziale in produzione reale. Dopo la demo, cambia la
password e ricrea l'utente staff.

## 4. Test principale

Verifica in questo ordine:

1. La pagina di login si apre senza errori.
2. Il login porta alla dashboard.
3. Puoi aprire **Nuovo preventivo**.
4. Puoi compilare i dati del cliente e del preventivo.
5. Puoi salvare il preventivo.
6. Il preventivo appare nella dashboard.
7. Puoi aprire il dettaglio e modificarlo.
8. Puoi scaricare il PDF con logo e numero del preventivo.
9. Il logout riporta alla pagina di login.

## 5. Segnalare un problema

Per ogni problema, invia:

- URL della pagina;
- dispositivo e versione del sistema;
- browser utilizzato;
- descrizione dei passaggi;
- screenshot, se possibile;
- ora approssimativa del problema.

Non inviare mai password, chiavi Supabase o altri dati riservati.

## Problemi comuni

- **La pagina non si apre:** controlla la connessione e ricarica la pagina.
- **Login non valido:** verifica email e password ricevute; non usare le
  credenziali del database.
- **L'app non si installa:** usa HTTPS e apri il sito direttamente in Chrome
  Android o Safari iPhone.
- **Errore 500:** invia URL, ora, dispositivo e screenshot; non ripetere
  molte volte il salvataggio dello stesso preventivo.
