// Outils communs : lit le catalogue publié sur le site et parle à SumUp. Clés SumUp dans les variables d'environnement Netlify.
const E = require("../../../engine.js");
async function loadData() {
  const base = process.env.URL || "https://darlinmaison.fr";
  const get = f => fetch(base + "/" + f + "?t=" + Date.now()).then(r => r.json());
  const [p, pr, s] = await Promise.all([get("products.json"), get("promos.json"), get("settings.json")]);
  return { products: p.products, promos: pr.promos, settings: s };
}
async function sumup(pathname, opts) {
  const res = await fetch("https://api.sumup.com" + pathname, {
    ...opts,
    headers: { "Authorization": "Bearer " + process.env.SUMUP_API_KEY, "Content-Type": "application/json" }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error("SumUp " + res.status); e.body = body; throw e; }
  return body;
}
const json = (code, obj) => ({ statusCode: code, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
module.exports = { E, loadData, sumup, json };
