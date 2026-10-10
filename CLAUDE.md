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
- Versione attuale: **v5.36**.
- La numerazione è **ripartita** a un certo punto: le etichette più alte nei commenti
  (es. "v5.175" sulla skin Arcade retro) sono della vecchia numerazione e vanno ignorate.
- A **ogni** aggiornamento pubblicato, aumenta la versione in entrambi i file, sempre allineati:
  - `APP_VERSION` in `index.html` (es. `"v5.30"`) — è il numero mostrato nella lobby;
  - `CACHE_VERSION` in `sw.js` (es. `"v5-30"`) — serve a scartare le cache vecchie sui telefoni.

## Regole da ricordare
- Tutte le pedine (proprie, del compagno, avversarie) si mangiano con le stesse regole:
  con una carta normale arrivandoci sopra (senza scavalcare nessuno), col 7 anche a metà strada.
  Se si mangia una pedina del proprio colore l'app chiede conferma.
- Le pedine protette (appena entrate sulla propria base) non si mangiano né si scavalcano.

## Icone
- Le icone dell'interfaccia sono icone a linea BIANCHE dentro un QUADRATINO COLORATO
  (stile Impostazioni dell'iPhone, scelto dall'utente; lo stile solo-oro è stato scartato).
  Codice: `UI_ICONS` (disegni) + `UI_ICON_BG` (colore del quadratino) + `ico(nome)` in `index.html`.
  Per una nuova icona aggiungi disegno e colore. Senza quadratino solo i simboli di controllo
  (✕ chiudi, ✓ fatto) e la freccia del Jack sul tabellone.
- Restano emoji solo i contenuti: semi delle carte, chat e frasi dei bot, reazioni,
  fuoco della carta bruciata, stelline della pedina in casa, titolo della scheda del browser.

## Tornei
- L'organizzatore è riconosciuto dal dispositivo (`organizerToken`), non dal nome.
- Passare l'organizzazione: si scrive `passa:<playerId>` in `organizerToken`; il telefono di
  quella persona lo sostituisce col proprio token quando apre il torneo.
- Le regole Firebase rifiutano campi nuovi nei tornei: usare solo i campi esistenti.

## Controlli automatici
- In `tests/` ci sono i controlli delle regole del gioco (mazzo, scambio, movimenti, casa,
  Jack, 7, turni, vittoria). Leggono il motore direttamente da `index.html`.
- Si lanciano con `node --test tests/*.test.js` (girano anche su GitHub a ogni aggiornamento).
- Lanciali prima di ogni push; se cambi una regola apposta, aggiorna anche il controllo.

## Bot e versioni in stanza
- Dalla v5.30 ogni telefono scrive la propria `APP_VERSION` nella presenza
  (`presence/<stanza>/<colore>/<connessione>`). Chi ha una versione più vecchia di un altro
  giocatore vede un avviso non chiudibile e non fa muovere i bot.

## Come lavorare
- **Non fare modifiche che l'utente non ha chiesto.** Per le proposte (soprattutto grafiche)
  prepara prima delle anteprime "prima/dopo" (screenshot) e aspetta il suo ok.
- Scelte grafiche già decise: le carte in mano restano come sono; i numeri accanto alle
  pedine solo nello stile Arcade; Rilievo 3D senza tabellone in prospettiva (deciso);
  verso di marcia = righe con freccia nella cornice del tabellone, che non toccano caselle né bordi
  (le freccette sulle basi sono state scartate).
- Le modifiche vanno su un branch e arrivano su `main` tramite pull request,
  che l'utente unisce da GitHub (anche dall'app sul telefono).
- Prima di eliminare un file, controlla che non sia usato in `index.html`, `sw.js` o `manifest.json`.
- Le conversazioni non si salvano tra una sessione e l'altra: le informazioni importanti
  da ricordare vanno scritte in questo file.
