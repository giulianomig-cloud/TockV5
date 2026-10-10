// Carica il motore di gioco direttamente da index.html (i blocchi <script>
// con la geometria del tabellone e con "Tock — motore di gioco"), così i
// controlli girano sempre sul codice vero dell'app, senza copie a parte.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function caricaMotore() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const blocchi = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const tabellone = blocchi.find((b) => b.includes("const BOARD ="));
  const motore = blocchi.find((b) => b.includes("Tock — motore di gioco"));
  if (!tabellone || !motore) throw new Error("blocchi del motore non trovati in index.html");
  // Eseguito nello stesso "mondo" JavaScript dei test (runInThisContext,
  // dentro una funzione così le variabili del motore restano isolate):
  // con un contesto separato liste e oggetti non risulterebbero uguali nei confronti.
  const module = { exports: {} };
  const avvia = vm.runInThisContext("(function (module) {\n" + tabellone + "\n" + motore + "\n;module.exports.BOARD = BOARD;\n})");
  avvia(module);
  return module.exports;
}

module.exports = { caricaMotore };
