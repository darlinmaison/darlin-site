const DL_get = u => fetch(u, {cache:"no-cache"}).then(r => { if(!r.ok) throw new Error(u); return r.json(); });
Promise.all([DL_get("data/settings.json"), DL_get("data/products.json"), DL_get("data/promos.json"), DL_get("data/reviews.json").catch(() => ({reviews:[]}))])
  .then(([s, p, pr, rv]) => window.DL_BOOT({settings: s, products: p.products, promos: pr.promos, reviews: (rv.reviews || []).filter(r => r.active !== false)}))
  .catch(() => { document.getElementById("app").innerHTML = '<p style="padding:40px;text-align:center">Chargement impossible. Rechargez la page.</p>'; });
