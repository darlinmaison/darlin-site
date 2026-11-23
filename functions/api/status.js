// Vérifie auprès de SumUp qu'un paiement est bien PAYÉ.
import { sumup, json } from "../../cf/lib.mjs";
export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[\w-]{6,80}$/.test(id)) return json(400, { error: "id" });
  try { const c = await sumup(env, "/v0.1/checkouts/" + encodeURIComponent(id), { method: "GET" }); return json(200, { status: c.status }); }
  catch (e) { return json(500, { error: "status" }); }
}
