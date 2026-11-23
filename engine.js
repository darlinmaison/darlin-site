/* Dar Lin – moteur de prix et de promotions.
   Utilisé par la boutique (navigateur) ET par le serveur de paiement, pour que le total soit toujours le même.
   Tous les calculs internes sont en centimes. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DLEngine = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const cents = e => Math.round(Number(e || 0) * 100);

  function isLive(promo, now) {
    if (!promo || promo.active === false) return false;
    const t = now || new Date();
    if (promo.start && new Date(promo.start) > t) return false;
    if (promo.end && new Date(promo.end + "T23:59:59") < t) return false;
    return true;
  }
  function appliesTo(promo, product) {
    const byP = Array.isArray(promo.products) && promo.products.length;
    const byC = Array.isArray(promo.categories) && promo.categories.length;
    if (!byP && !byC) return true; // toute la boutique
    return (byP && promo.products.includes(product.id)) || (byC && promo.categories.includes(product.cat));
  }

  /* Promotions automatiques visibles sur un produit (pour les badges) */
  function promosFor(product, promos, now) {
    return (promos || []).filter(p => p.type !== "code" && isLive(p, now) && appliesTo(p, product));
  }

  /* Remise d'une promo sur un groupe d'unités (prix unitaires en centimes, triés du plus cher au moins cher) */
  function discountFor(promo, unitPrices) {
    const n = unitPrices.length;
    if (!n) return 0;
    const sorted = unitPrices.slice().sort((a, b) => b - a);
    const sum = sorted.reduce((a, b) => a + b, 0);
    switch (promo.type) {
      case "pack": { // X articles pour Y €
        const q = Math.max(1, +promo.qty || 1), packs = Math.floor(n / q);
        if (!packs) return 0;
        // les lots prennent les articles les plus chers
        const inPacks = sorted.slice(0, packs * q).reduce((a, b) => a + b, 0);
        return Math.max(0, inPacks - packs * cents(promo.price));
      }
      case "bogo": { // X achetés = Y offerts (les moins chers sont offerts)
        const buy = Math.max(1, +promo.buy || 1), get = Math.max(1, +promo.get || 1);
        const groups = Math.floor(n / (buy + get));
        if (!groups) return 0;
        return sorted.slice(n - groups * get).reduce((a, b) => a + b, 0);
      }
      case "percent_qty": { // -X % dès N articles
        if (n < (+promo.minQty || 1)) return 0;
        return Math.round(sum * (+promo.percent || 0) / 100);
      }
      case "percent": { // -X % simple
        return Math.round(sum * (+promo.percent || 0) / 100);
      }
      case "amount_qty": { // -X € dès N articles
        if (n < (+promo.minQty || 1)) return 0;
        return Math.min(sum, cents(promo.amount));
      }
      default: return 0;
    }
  }

  /* cart = [{id, v, q}] ; renvoie le détail complet */
  function compute(cart, data, opts) {
    const products = data.products || [], promos = data.promos || [], shop = (data.settings && data.settings.shop) || {};
    const o = opts || {}, now = o.now ? new Date(o.now) : new Date();
    const byId = id => products.find(p => p.id === id);
    const lines = [];
    (cart || []).forEach(l => {
      const p = byId(l.id); if (!p || p.active === false) return;
      const q = Math.max(1, Math.min(99, parseInt(l.q, 10) || 1));
      const v = (p.variants || [])[l.v] || (p.variants || [])[0] || {};
      lines.push({ id: p.id, v: l.v || 0, q, unit: cents(p.price), total: cents(p.price) * q, product: p, variant: v });
    });
    const sub = lines.reduce((a, l) => a + l.total, 0);

    // Promotions automatiques : chaque unité n'est utilisée que par une promo (la plus avantageuse en premier)
    const auto = promos.filter(p => p.type !== "code" && isLive(p, now));
    const used = new Set(); // index de ligne : une ligne ne profite que d'une promo
    const discounts = [];
    const ranked = auto.map(pr => {
      const idx = lines.map((l, i) => i).filter(i => appliesTo(pr, lines[i].product));
      const units = []; idx.forEach(i => { for (let k = 0; k < lines[i].q; k++) units.push(lines[i].unit); });
      return { pr, idx, gain: discountFor(pr, units) };
    }).sort((a, b) => b.gain - a.gain);
    ranked.forEach(r => {
      const free = r.idx.filter(i => !used.has(i));
      if (!free.length) return;
      const units = []; free.forEach(i => { for (let k = 0; k < lines[i].q; k++) units.push(lines[i].unit); });
      const gain = discountFor(r.pr, units);
      if (gain > 0) { free.forEach(i => used.add(i)); discounts.push({ id: r.pr.id, label_fr: r.pr.label_fr, label_ar: r.pr.label_ar, amount: gain }); }
    });
    let net = sub - discounts.reduce((a, d) => a + d.amount, 0);

    // Code promo
    let codeResult = null;
    if (o.code) {
      const code = String(o.code).trim().toUpperCase();
      const pr = promos.find(p => p.type === "code" && String(p.code || "").toUpperCase() === code && isLive(p, now));
      if (!pr) codeResult = { ok: false, reason: "invalid" };
      else if (net < cents(pr.minOrder)) codeResult = { ok: false, reason: "min", min: cents(pr.minOrder) };
      else {
        const amount = pr.percent ? Math.round(net * pr.percent / 100) : Math.min(net, cents(pr.amount));
        codeResult = { ok: true, code, amount, label_fr: pr.label_fr, label_ar: pr.label_ar };
        discounts.push({ id: pr.id, label_fr: pr.label_fr || code, label_ar: pr.label_ar || code, amount });
        net -= amount;
      }
    }

    const mode = o.mode === "home" ? "home" : "market";
    const delivery = mode === "home" ? (net >= cents(shop.freeDeliveryFrom) ? 0 : cents(shop.deliveryFee)) : 0;
    return { lines, sub, discounts, net, delivery, total: net + delivery, code: codeResult, mode };
  }

  return { compute, promosFor, isLive, cents };
});
