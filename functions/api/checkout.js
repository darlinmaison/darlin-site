// Crée un paiement SumUp. Le total est recalculé ici (le navigateur ne décide pas du prix).
import { E, loadData, sumup, json } from "../../cf/lib.mjs";
export async function onRequestPost({ request, env }) {
  try {
    const { cart, mode, code, customer } = await request.json().catch(() => ({}));
    if (!Array.isArray(cart) || !cart.length || cart.length > 50) return json(400, { error: "cart" });
    const data = await loadData(env, request);
    const r = E.compute(cart, data, { mode, code });
    if (r.total < 100) return json(400, { error: "amount" });
    const reference = "DL-" + Date.now().toString(36).toUpperCase();
    const desc = r.lines.map(l => `${l.q}x ${l.product.fr.name}`).join(", ").slice(0, 200);
    const c = await sumup(env, "/v0.1/checkouts", { method: "POST", body: JSON.stringify({
      checkout_reference: reference, amount: +(r.total / 100).toFixed(2), currency: "EUR",
      merchant_code: env.SUMUP_MERCHANT_CODE,
      description: `Dar Lin ${reference} – ${desc} – ${((customer && customer.name) || "").slice(0, 60)} ${((customer && customer.phone) || "").slice(0, 20)}`
    }) });
    return json(200, { checkoutId: c.id, reference, total: r.total });
  } catch (e) {
    console.error(e.message, JSON.stringify(e.body || {}));
    return json(500, { error: "payment" });
  }
}
export const onRequest = () => json(405, { error: "method" });
