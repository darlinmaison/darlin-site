// Photo d'un avis client, stockée dans Cloudflare KV.
export async function onRequestGet({ params, env }) {
  const id = String(params.id || "");
  if (!/^[a-z0-9]{6,20}$/.test(id) || !env.DL) return new Response("", { status: 404 });
  const { value, metadata } = await env.DL.getWithMetadata("rvimg:" + id, "arrayBuffer");
  if (!value) return new Response("", { status: 404 });
  return new Response(value, { headers: { "content-type": (metadata && metadata.type) || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" } });
}
