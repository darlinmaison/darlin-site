// Vérifie auprès de SumUp qu'un paiement est bien PAYÉ.
const { sumup } = require("./_lib");
module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || "");
  if (!/^[\w-]{6,80}$/.test(id)) return res.status(400).json({ error: "id" });
  try { const c = await sumup("/v0.1/checkouts/" + encodeURIComponent(id), { method: "GET" }); res.status(200).json({ status: c.status }); }
  catch (e) { res.status(500).json({ error: "status" }); }
};
