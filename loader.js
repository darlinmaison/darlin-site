Promise.all(["data/settings.json","data/products.json","data/promos.json"].map(u => fetch(u, {cache:"no-cache"}).then(r => { if(!r.ok) throw new Error(u); return r.json(); })))
  .then(([s, p, pr]) => window.DL_BOOT({settings: s, products: p.products, promos: pr.promos}))
  .catch(() => { document.getElementById("app").innerHTML = '<p style="padding:40px;text-align:center">Chargement impossible. Rechargez la page.</p>'; });
