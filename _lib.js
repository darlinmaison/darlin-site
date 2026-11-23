// Outils communs aux fonctions de paiement (Vercel). Les clés SumUp sont dans les variables d'environnement Vercel, jamais dans le code.
const fs = require("fs"), path = require("path");
const E = require("../engine.js");
const read = f => JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8"));
function loadData() {
  return { products: read("products.json").products, promos: read("promos.json").promos, settings: read("settings.json") };
}
async function sumup(pathname, opts) {
  const res = await fetch("https://api.sumup.com" + pathname, {
    ...opts,
    headers: { "Authorization": "Bearer " + process.env.SUMUP_API_KEY, "Content-Type": "application/json", ...(opts && opts.headers) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error("SumUp " + res.status); e.body = body; throw e; }
  return body;
}
module.exports = { E, loadData, sumup };
