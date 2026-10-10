# Tock V5 — istruzioni per Claude

## Lingua
- Rispondi sempre in **italiano**, con spiegazioni semplici: l'utente non è un programmatore.
- Spiega i passaggi GitHub (branch, pull request, merge) in parole semplici quando servono.

## Il progetto
- Tock: gioco da tavolo multigiocatore come web app (PWA) installabile sul telefono.
- Tutto il gioco è in un solo file: `index.html` (HTML + CSS + JavaScript).
- Multigiocatore online tramite Firebase Realtime Database (script caricati da gstatic in `index.html`).
- Grafiche disponibili (skin, `html[data-skin=...]`): `wood`, `bright`, `night`, `arcade`.
- Altri file: `sw.js` (service worker / cache offline), `manifest.json` (icone e nome app),
  icone `icon-v3-*.png`, loghi `logo.png` e `logo-dark.png`.

## Versione
- Versione attuale: **v5.29**.
- La numerazione è **ripartita** a un certo punto: le etichette più alte nei commenti
  (es. "v5.175" sulla skin Arcade retro) sono della vecchia numerazione e vanno ignorate.
- A **ogni** aggiornamento pubblicato, aumenta la versione in entrambi i file, sempre allineati:
  - `APP_VERSION` in `index.html` (es. `"v5.30"`) — è il numero mostrato nella lobby;
  - `CACHE_VERSION` in `sw.js` (es. `"v5-30"`) — serve a scartare le cache vecchie sui telefoni.

## Come lavorare
- Le modifiche vanno su un branch e arrivano su `main` tramite pull request,
  che l'utente unisce da GitHub (anche dall'app sul telefono).
- Prima di eliminare un file, controlla che non sia usato in `index.html`, `sw.js` o `manifest.json`.
- Le conversazioni non si salvano tra una sessione e l'altra: le informazioni importanti
  da ricordare vanno scritte in questo file.
