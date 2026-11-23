// Vérifie auprès de SumUp qu'un paiement est bien PAYÉ.
const { sumup, json } = require("./_lib/lib.js");
exports.handler = async (event) => {
  const id = String((event.queryStringParameters && event.queryStringParameters.id) || "");
  if (!/^[\w-]{6,80}$/.test(id)) return json(400, { error: "id" });
  try { const c = await sumup("/v0.1/checkouts/" + encodeURIComponent(id), { method: "GET" }); return json(200, { status: c.status }); }
  catch (e) { return json(500, { error: "status" }); }
};
