// Crée un paiement SumUp. Le total est recalculé ici à partir du catalogue et des promotions (le navigateur ne décide pas du prix).
const { E, loadData, sumup } = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { cart, mode, code, customer } = req.body || {};
    if (!Array.isArray(cart) || !cart.length || cart.length > 50) return res.status(400).json({ error: "cart" });
    const data = loadData();
    const r = E.compute(cart, data, { mode, code });
    if (r.total < 100) return res.status(400).json({ error: "amount" });
    const reference = "DL-" + Date.now().toString(36).toUpperCase();
    const desc = r.lines.map(l => `${l.q}x ${l.product.fr.name}`).join(", ").slice(0, 250);
    const c = await sumup("/v0.1/checkouts", { method: "POST", body: JSON.stringify({
      checkout_reference: reference, amount: +(r.total / 100).toFixed(2), currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: `Dar Lin ${reference} – ${desc} – ${(customer && customer.name || "").slice(0, 60)} ${(customer && customer.phone || "").slice(0, 20)}`
    }) });
    res.status(200).json({ checkoutId: c.id, reference, total: r.total });
  } catch (e) {
    console.error(e.message, e.body);
    res.status(500).json({ error: "payment" });
  }
};
