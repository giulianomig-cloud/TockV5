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
- Versione attuale: **v5.53**.
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

## Tornei
- L'organizzatore è riconosciuto dal dispositivo (`organizerToken`), non dal nome.
- Aprire un torneo (v5.52): se questo telefono è l'organizzatore si va sempre alla pagina del torneo,
  anche se non è iscritto. La schermata di iscrizione ha "👀 Guarda il torneo senza iscriverti" (da lì,
  in fondo, "Diventa organizzatore da questo dispositivo") e a torneo pieno "Torneo al completo".
- Passare l'organizzazione: si scrive `passa:<playerId>` in `organizerToken`; il telefono di
  quella persona lo sostituisce col proprio token quando apre il torneo.
- Le regole Firebase rifiutano campi nuovi nei tornei: usare solo i campi esistenti.

## Controlli automatici
- In `tests/` ci sono i controlli delle regole del gioco (mazzo, scambio, movimenti, casa,
  Jack, 7, turni, vittoria). Leggono il motore direttamente da `index.html`.
- Si lanciano con `node --test tests/*.test.js` (girano anche su GitHub a ogni aggiornamento).
- Lanciali prima di ogni push; se cambi una regola apposta, aggiorna anche il controllo.

## Scelta del colore nella stanza
- Toccando un colore si scrive una prenotazione in `games/<stanza>/pending/<colore>` (`token`, `ts`)
  con una transazione: vince il primo, l'altro telefono perde la scelta e vede "In scelta…".
  Gli orari usano l'ora del server (`serverNow`), la prenotazione dura 45 s e si rinnova
  da sola mentre si resta sulla schermata. Anche "Entra nella stanza" la rispetta.

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
  (le freccette sulle basi sono state scartate);
  icone dell'interfaccia: restano le EMOJI. Provate e scartate sia le icone a linea oro sia
  quelle nei quadratini colorati (v5.36, tolte nella v5.37): non riproporle.
  Emoji scelte: tutte "oggetti colorati", niente simboli piatti e niente doppioni (Impostazioni:
  ☀️ 🌙 🧊 · 🃏 Classico, 🪵 Legno, 🎰 Notte, 💎 Luminoso, 🕹️ Arcade · 🔊 📳 · 📜 🎓 · 📤 · 👀 🏷️).
- Animazioni (v5.41): la pedina cammina con un saltello morbido fra le caselle (se non piace
  si torna allo scatto di prima); la pedina mangiata atterra senza schiacciarsi (le pedine restano
  sempre tonde); a fine partita le pedine vincenti saltano "a onda" e poi arriva il banner.
  Scartato: ridurre le pulsazioni quando tocca a te (restano come sono). Scartati anche gli effetti
  3D tipo video (pedine di vetro, logo lucido con Three.js): non riproporli.
- Estrazione del mazziere (v5.42-43): mazzetto coperto al centro grande come le carte (64x90), ogni carta vola e si gira, suono a
  ogni carta e "ding" all'Asso, scritta finale con il nome. Scartati: accelerare/rallentare il ritmo,
  bordo che gira a chi tocca pescare, effetto speciale sull'Asso.
  Dalla v5.44 la carta arriva già scoperta (niente giro: quello "piatto" non piaceva, scartati anche
  il giro 3D e "coperta poi si gira"); suono della carta (`cardFlick`) = "scivola e si appoggia".
- Classifica generale (v5.45): tre linguette (Vittorie · Media · Tornei), ogni elenco in un unico
  riquadro con righe divise da una linea, barretta sotto il nome nella Media. Nella Media entra in
  classifica solo chi ha almeno 5 partite (`LB_MIN_PARTITE_MEDIA`); gli altri sotto, in grigio.
- Home (v5.46, scelta "A · Tessere" fra 3 proposte, con i tornei in elenco come la "B"): codice +
  "Gioca ›" sulla stessa riga, suggerimento "Es. TORVA1…" sotto, tessere Classifica / Impara a
  giocare, "Organizza un torneo", tornei in un unico riquadro a righe (concluso in fondo, sbiadito),
  tastini in basso con il nome sotto. Il logo scende se il telefono non riserva spazio all'ora
  (sotto l'ora l'iPhone lo sfocava). Scartate: "B · Elenco" e "C · Copertina".
- Schermata della stanza (v5.47, scelta "C · Squadre" fra 3 proposte): due riquadri, uno per squadra
  ("Squadra 1 · Rosso + Giallo" VS "Squadra 2 · Verde + Blu"), una riga per colore con pallino, nome
  e a destra "Siediti" + 🤖 (il 🤖 apre nella riga la scelta Normale / Difficile / ✕) oppure "Libera"
  per il computer. Qui NON esiste `#picker-wrap`: niente openPicker in questa schermata.
  Scartate: "A · Compatta" (riquadri 2x2) e "B · Tavolo" (posti intorno a un tavolino).
- Pagina del torneo (v5.48): etichette di stato in alto (formato, stato, 👑 Organizzatore), azione
  principale, tavoli/spareggio/classifica in riquadri a righe ("Come si contano i punti" a scomparsa),
  iscritti in un unico elenco (tondino 🤖 o iniziale colorata, ✕ uguale per tutti, pallini 8 posti),
  "Aggiungi bot" solo con posti liberi; in fondo "Gestione": Condividi, Passa l'organizzazione,
  Elimina torneo (scritta rossa, non più pulsante grande in alto).
- Rientro in una partita già in corso (v5.49): elenco di chi è seduto nella stanza, si tocca
  "Sono io ›" sul proprio nome (niente più nome da riscrivere). Il rientro tiene tutti i campi del
  posto, `playerId` compreso (prima si perdeva e le partite dopo il rientro non contavano in classifica).
- "Impara a giocare" (v5.50): barra "Il tuo percorso · X di 9 lezioni", lezioni numerate in un unico
  riquadro a righe, ✓ verde sulle fatte e "Inizia ›" sulla prima ancora da fare.
- Schermate secondarie (v5.51, l'utente ha lasciato decidere a Claude): scelta modalità della stanza,
  estrazione a sorte (nome), Organizza torneo, Iscriviti al torneo usano `smallScreenHeader` (logo
  piccolo + etichetta STANZA/TORNEO) al posto della scritta "Tock"; logo delle testate ridotto a 104px.
  Iscriviti al torneo mostra chi è già iscritto. L'attesa dei giocatori sotto il tabellone usa lo stile
  "Squadre" della stanza (righe per colore, 🤖 Normale/Difficile sui posti liberi).
- Stile "Bento" (v5.53, scelto fra 3 impaginazioni: Bento / Editoriale / Vetro): home con riquadro
  grande a sfumatura nei 4 colori ("Pronto per una partita?" + codice + "Gioca" nero), riquadri di misure
  diverse (podio classifica top 3, anello lezioni X/9, "+ Organizza un torneo" nero), tornei come schede
  che scorrono di lato, tastini 🔊 🌙 🧊 in alto a destra. Tutte le pagine prima della partita: fondo
  `--bx-bg`, riquadri bianchi senza bordo con ombra morbida, pulsanti principali neri (crema nel tema
  scuro). Token `--bx-*` in `:root` e `:root[data-theme="dark"]`. Scartati "Editoriale" e "Vetro" e i
  soli cambi di colore (Blu notte, Bianco e blu, Terracotta).
- Icona dell'app: resta quella attuale (pedine a tappo su blu). Proposte scartate: logo su crema,
  pedine sul tabellone di legno, carta + pedine, pedine su crema. Non riproporle.
- Le modifiche vanno su un branch e arrivano su `main` tramite pull request,
  che l'utente unisce da GitHub (anche dall'app sul telefono).
- Alcuni giocatori usano l'app con il **traduttore di Chrome** (es. in spagnolo): avvolge i testi
  in `<font>`. Regole CSS tipo `.qualcosa * { color: ... }` colpiscono anche quei `<font>`:
  se un elemento interno ha un colore diverso, dagli la regola anche per i suoi figli (`.x, .x *`).
- Prima di eliminare un file, controlla che non sia usato in `index.html`, `sw.js` o `manifest.json`.
- Le conversazioni non si salvano tra una sessione e l'altra: le informazioni importanti
  da ricordare vanno scritte in questo file.
