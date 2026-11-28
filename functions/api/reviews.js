// Avis clients publiés directement : GET = liste, POST = nouvel avis (+ photo facultative) dans Cloudflare KV (binding DL).
const json = (s, o, c) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": c || "no-store" } });
const clean = (v, n) => String(v || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
export async function onRequestGet({ env }) {
  if (!env.DL) return json(200, { reviews: [] });
  const list = (await env.DL.get("reviews", "json")) || [];
  return json(200, { reviews: list.filter(r => r.active !== false) }, "public, max-age=30");
}
export async function onRequestPost({ request, env }) {
  if (!env.DL) return json(500, { error: "kv" });
  let b; try { b = await request.json(); } catch { return json(400, { error: "json" }); }
  if (b.hp) return json(200, { ok: true });
  const rating = Math.round(+b.rating), name = clean(b.name, 40), city = clean(b.city, 40), text = String(b.text || "").replace(/[\u0000-\u0009\u000b-\u001f]/g, "").trim().slice(0, 1200);
  const product = /^[a-z0-9-]{2,60}$/.test(b.product || "") ? b.product : "";
  if (!(rating >= 1 && rating <= 5) || name.length < 2 || text.length < 5) return json(400, { error: "fields" });
  if (/https?:|www\.|<\s*a\s/i.test(text + name + city)) return json(400, { error: "links" });
  const ip = request.headers.get("cf-connecting-ip") || "x";
  if (await env.DL.get("rl:" + ip)) return json(429, { error: "wait" });
  await env.DL.put("rl:" + ip, "1", { expirationTtl: 60 });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  let photo = "";
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(b.photo || "");
  if (m && m[2].length < 900000) {
    const bin = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    await env.DL.put("rvimg:" + id, bin, { metadata: { type: "image/" + m[1] } });
    photo = "/api/rvimg/" + id;
  }
  const r = { id, rating, name, city, product, text, photo, date: new Date().toISOString().slice(0, 10), verified: false, active: true };
  const list = (await env.DL.get("reviews", "json")) || [];
  list.unshift(r);
  await env.DL.put("reviews", JSON.stringify(list.slice(0, 2000)));
  return json(200, { ok: true, review: r });
}
