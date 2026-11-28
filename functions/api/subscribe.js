// Inscription newsletter : enregistre l'e-mail dans Cloudflare KV (binding DL) et renvoie le code de bienvenue.
const json = (s, o) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return json(400, { error: "json" }); }
  if (b.hp) return json(200, { ok: true, code: "BIENVENUE10" });
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/.test(email) || !b.consent) return json(400, { error: "email" });
  if (!env.DL) return json(500, { error: "kv" });
  const key = "sub:" + email;
  const old = await env.DL.get(key);
  if (!old) await env.DL.put(key, JSON.stringify({ date: new Date().toISOString(), lang: String(b.lang || "fr").slice(0, 2), src: String(b.src || "").slice(0, 20), consent: true }));
  return json(200, { ok: true, code: "BIENVENUE10" });
}
