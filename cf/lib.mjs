// Outils communs Cloudflare : lit le catalogue publié et parle à SumUp. Clés dans les variables Cloudflare.
import E from "./engine.mjs";
export { E };
export async function loadData(env, request) {
  const get = f => env.ASSETS.fetch(new URL("/" + f, request.url)).then(r => r.json());
  const [p, pr, s] = await Promise.all([get("products.json"), get("promos.json"), get("settings.json")]);
  return { products: p.products, promos: pr.promos, settings: s };
}
export async function sumup(env, pathname, opts) {
  const res = await fetch("https://api.sumup.com" + pathname, {
    ...opts,
    headers: { "Authorization": "Bearer " + env.SUMUP_API_KEY, "Content-Type": "application/json" }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error("SumUp " + res.status); e.body = body; throw e; }
  return body;
}
export const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { "Content-Type": "application/json" } });
