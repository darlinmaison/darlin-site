window.DL_BOOT = function(DATA){
"use strict";
const S = DATA.settings, SHOP = S.shop, E = window.DLEngine;
const P = DATA.products.filter(p => p.active !== false), CATS = S.categories, PROMOS = DATA.promos || [], REV = (DATA.reviews || []).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
const C = { whatsapp: SHOP.whatsapp, phoneDisplay: SHOP.phoneDisplay, email: SHOP.email, instagram: SHOP.instagram, facebook: SHOP.facebook,
  deliveryFee: E.cents(SHOP.deliveryFee), freeDeliveryFrom: E.cents(SHOP.freeDeliveryFrom), cardPayment: !!SHOP.cardPayment };
const pc = p => E.cents(p.price);
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- textes ---------- */
const T = {
  fr: {
    top1:"Retrait gratuit au marché d'Amiens", top2:"Livraison à domicile sur Amiens", top3:"Commande facile par WhatsApp",
    nav_chambre:"Chambre", nav_bain:"Salle de bain", nav_table:"Table & cuisine", nav_rideaux:"Rideaux", nav_affaires:"Petits prix", nav_marche:"Nous trouver",
    search:"Rechercher un produit (drap, nappe, serviette…)", cart:"Panier", menu:"Menu", lang:"العربية",
    hero_eyebrow:"Linge de maison · Amiens",
    hero_h:"Dormez bien,<br><em>vivez doux.</em>",
    hero_p:"Parures, draps, serviettes, nappes et rideaux de grandes marques, à petits prix. À retirer au marché ou livrés chez vous à Amiens.",
    hero_cta:"Découvrir la boutique", hero_cta2:"Commander sur WhatsApp", hero_cap:"Parure 3 pièces · 25 €",
    cats_eyebrow:"Nos univers", cats_h:"Toute la maison, pièce par pièce", items:"articles",
    best_eyebrow:"Coups de cœur", best_h:"Les plus demandés au marché", see_all:"Tout voir",
    small_eyebrow:"Petits prix", small_h:"À moins de 5 €",
    why_eyebrow:"Pourquoi Dar Lin",
    why1_h:"Grandes marques", why1_p:"Gérard Pasquier, Amphora, Hygie : du linge de qualité, neuf et emballé.",
    why2_h:"Petits prix", why2_p:"Des prix justes toute l'année, et des lots pour les articles du quotidien.",
    why3_h:"Retrait ou livraison", why3_p:"Retrait gratuit au marché ou livraison à domicile sur Amiens.",
    why4_h:"14 jours pour changer d'avis", why4_p:"Article neuf dans son emballage ? On l'échange ou on vous rembourse.",
    mk_eyebrow:"On se voit au marché", mk_day:"Dimanche", mk_h:"Marché d'Amiens Nord", mk_p:"Retrouvez tout le stand Dar Lin chaque dimanche matin. Commandez en ligne, on vous met votre colis de côté : vous passez, vous payez, vous repartez.",
    mk_list1:"Commandez avant samedi 20 h", mk_list2:"Votre commande vous attend au stand", mk_list3:"Paiement sur place",
    mk_map:"Ouvrir dans Google Maps",
    join_h:"Les nouveautés d'abord sur WhatsApp", join_p:"Arrivages, lots, pièces uniques : écrivez-nous « Nouveautés » et recevez les photos avant tout le monde.",
    join_btn:"Écrire « Nouveautés »",
    f_shop:"Boutique", f_help:"Aide", f_legal:"Informations légales", f_contact:"Contact",
    f_about:"Dar Lin, la maison du linge. Une boutique familiale d'Amiens, sur les marchés et en ligne.",
    f_rights:"Tous droits réservés", f_vat:"Prix en euros, toutes taxes comprises.",
    faq:"Questions fréquentes", livraison:"Livraison & retrait", retours:"Retours & échanges", about:"Qui sommes-nous", contact_us:"Nous contacter",
    mentions:"Mentions légales", cgv:"Conditions générales de vente", privacy:"Confidentialité",
    add:"Ajouter au panier", added:"Ajouté au panier", wa_order:"Commander sur WhatsApp", colour:"Coloris", qty:"Quantité",
    perk1:"Retrait gratuit au marché d'Amiens Nord", perk2:"Livraison à domicile sur Amiens : {fee}, offerte dès {free}", perk3:"Retour ou échange sous 14 jours", perk4:"Article neuf, emballage d'origine",
    details:"Détails", also:"Vous aimerez aussi", brand:"Marque",
    pack:"Lot de {n} : {p}",
    all:"Tout", sort:"Trier", sort_pop:"Les plus demandés", sort_up:"Prix croissant", sort_down:"Prix décroissant",
    all_products:"Toute la boutique", affaires_p:"Le linge du quotidien à moins de 5 €, et des lots encore plus malins.",
    results:"Résultats pour « {q} »", no_results:"Aucun produit trouvé. Essayez « drap », « nappe » ou « serviette ».",
    cart_empty:"Votre panier est vide.", continue:"Continuer mes achats", subtotal:"Sous-total", pack_saving:"Remise lots", checkout:"Valider ma commande", remove:"Retirer",
    co_h:"Ma commande", co_mode:"Mode de réception", co_market:"Retrait au marché d'Amiens Nord", co_market_s:"Gratuit · dimanche matin, au stand Dar Lin",
    co_home:"Livraison à domicile (Amiens)", co_home_s:"{fee} · offerte dès {free} · sous 48 h ouvrées",
    co_you:"Vos coordonnées", co_name:"Prénom et nom", co_phone:"Téléphone (WhatsApp de préférence)", co_addr:"Adresse de livraison", co_note:"Un message pour nous ? (facultatif)",
    co_pay:"Paiement", co_pay_txt:"Vous payez à la remise de la commande : espèces ou carte bancaire.", co_card_soon:"Paiement en ligne par carte : bientôt disponible.", co_card:"Payer par carte en ligne",
    co_delivery:"Livraison", co_free:"Offerte", co_total:"Total", co_send:"Envoyer ma commande sur WhatsApp",
    co_after:"WhatsApp s'ouvre avec votre commande déjà écrite : il ne reste qu'à appuyer sur Envoyer. Nous confirmons la disponibilité dans la journée.",
    co_agree:"J'ai lu et j'accepte les conditions générales de vente.", co_fill:"Complétez les champs en orange pour continuer.",
    co_wa_hidden:"Si WhatsApp ne s'ouvre pas, écrivez-nous au {tel} en copiant ce message :", copy:"Copier", copied:"Copié",
    order_hello:"Bonjour Dar Lin, je souhaite commander :",
    low:"Plus que {n} en stock", co_pickup:"Retrait au marché", soldout:"Épuisé", code:"Code promo", apply:"Appliquer", code_ok:"Code appliqué ✓", code_bad:"Ce code n'existe pas ou n'est plus valable.", code_min:"Ce code est valable dès {m} d'achat.",
    pay_card:"Payer maintenant par carte", pay_card_s:"Carte bancaire, Apple Pay ou Google Pay · paiement sécurisé SumUp", pay_cash:"Payer à la remise", pay_now:"Payer par carte",
    pay_after:"Paiement sécurisé par SumUp : Dar Lin ne voit jamais vos données bancaires.", pay_loading:"Préparation du paiement…", pay_error:"Le paiement n'a pas pu démarrer. Réessayez ou commandez sur WhatsApp.",
    thanks_h:"Merci pour votre commande !", thanks_p:"Votre paiement est bien reçu (réf. {ref}). Envoyez-nous la commande sur WhatsApp pour convenir du retrait ou de la livraison.", thanks_wa:"Envoyer ma commande sur WhatsApp",
    legal_ar:""
  },
  en: {
    top1:"Free pickup at the Amiens market", top2:"Home delivery in Amiens", top3:"Easy ordering on WhatsApp",
    nav_chambre:"Bedroom", nav_bain:"Bathroom", nav_table:"Table & kitchen", nav_rideaux:"Curtains", nav_affaires:"Small prices", nav_marche:"Find us",
    search:"Search a product (sheet, tablecloth, towel…)", cart:"Cart", menu:"Menu", lang:"English",
    hero_eyebrow:"Home linen · Amiens",
    hero_h:"Sleep well,<br><em>live softly.</em>",
    hero_p:"Bed linen, sheets, towels, tablecloths and curtains from trusted brands, at small prices.",
    hero_cta:"Shop now", hero_cta2:"Order on WhatsApp", hero_cap:"",
    cats_eyebrow:"Our collections", cats_h:"The whole home, room by room", items:"items",
    best_eyebrow:"Favourites", best_h:"Most requested at the market", see_all:"See all",
    small_eyebrow:"Small prices", small_h:"Under €5",
    why_eyebrow:"Why Dar Lin",
    why1_h:"Trusted brands", why1_p:"Gérard Pasquier, Amphora, Hygie: quality home linen, brand new and in its packaging.",
    why2_h:"Small prices", why2_p:"Fair prices all year round, and bundle deals on everyday items.",
    why3_h:"Pickup or delivery", why3_p:"Free pickup at the market or home delivery in Amiens.",
    why4_h:"14 days to change your mind", why4_p:"Item new and still packed? We exchange it or refund you.",
    mk_eyebrow:"See you at the market", mk_day:"Sunday", mk_h:"Amiens Nord market", mk_p:"Find the whole Dar Lin stall every Sunday morning. Order online and we set your parcel aside: you drop by, pay and go.",
    mk_list1:"Order before Saturday 8 pm", mk_list2:"Your order waits for you at the stall", mk_list3:"Pay on the spot",
    mk_map:"Open in Google Maps",
    join_h:"New arrivals first on WhatsApp", join_p:"New stock, bundles, one-off pieces: send us “New” and get the photos before everyone else.",
    join_btn:"Send “New”",
    f_shop:"Shop", f_help:"Help", f_legal:"Legal information", f_contact:"Contact",
    f_about:"Dar Lin, the home of linen. A family shop from Amiens, at the markets and online.",
    f_rights:"All rights reserved", f_vat:"Prices in euros, all taxes included.",
    faq:"FAQ", livraison:"Delivery & pickup", retours:"Returns & exchanges", about:"About us", contact_us:"Contact us",
    mentions:"Legal notice", cgv:"Terms of sale", privacy:"Privacy",
    add:"Add to cart", added:"Added to cart", wa_order:"Order on WhatsApp", colour:"Colour", qty:"Quantity",
    perk1:"Free pickup at the Amiens Nord market", perk2:"Home delivery in Amiens: {fee}, free from {free}", perk3:"Return or exchange within 14 days", perk4:"Brand new, original packaging",
    details:"Details", also:"You may also like", brand:"Brand",
    pack:"Bundle of {n}: {p}",
    all:"All", sort:"Sort", sort_pop:"Most popular", sort_up:"Price: low to high", sort_down:"Price: high to low",
    all_products:"All products", affaires_p:"Everyday linen under €5, and even smarter bundles.",
    results:"Results for “{q}”", no_results:"No product found. Try “sheet”, “tablecloth” or “towel”.",
    cart_empty:"Your cart is empty.", continue:"Continue shopping", subtotal:"Subtotal", pack_saving:"Bundle discount", checkout:"Checkout", remove:"Remove",
    co_h:"My order", co_mode:"How would you like to receive it?", co_market:"Pickup at the Amiens Nord market", co_market_s:"Free · Sunday morning, at the Dar Lin stall",
    co_home:"Home delivery (Amiens)", co_home_s:"{fee} · free from {free} · within 48 working hours",
    co_you:"Your details", co_name:"First and last name", co_phone:"Phone (WhatsApp preferred)", co_addr:"Delivery address", co_note:"A message for us? (optional)",
    co_pay:"Payment", co_pay_txt:"You pay when you receive your order: cash or card.", co_card_soon:"Online card payment: coming soon.", co_card:"Pay by card online",
    co_delivery:"Delivery", co_free:"Free", co_total:"Total", co_send:"Send my order on WhatsApp",
    co_after:"WhatsApp opens with your order already written: just press Send. We confirm availability the same day.",
    co_agree:"I have read and accept the terms of sale.", co_fill:"Fill in the fields in orange to continue.",
    co_wa_hidden:"If WhatsApp doesn't open, message us at {tel} and copy this text:", copy:"Copy", copied:"Copied",
    order_hello:"Bonjour Dar Lin, je souhaite commander :",
    low:"Only {n} left", co_pickup:"Market pickup", soldout:"Sold out", code:"Promo code", apply:"Apply", code_ok:"Code applied ✓", code_bad:"This code doesn't exist or has expired.", code_min:"This code is valid from {m}.",
    pay_card:"Pay now by card", pay_card_s:"Bank card, Apple Pay or Google Pay · secure payment by SumUp", pay_cash:"Pay on delivery", pay_now:"Pay by card",
    pay_after:"Secure payment by SumUp: Dar Lin never sees your card details.", pay_loading:"Preparing payment…", pay_error:"Payment could not start. Try again or order on WhatsApp.",
    thanks_h:"Thank you for your order!", thanks_p:"We've received your payment (ref. {ref}). Send us the order on WhatsApp to arrange pickup or delivery.", thanks_wa:"Send my order on WhatsApp",
    legal_ar:"These legal texts are in French, the official language of contracts in France."
  },
  ar: {
    top1:"استلام مجاني من سوق أميان", top2:"توصيل للبيت داخل أميان", top3:"اطلب بسهولة عن طريق واتساب",
    nav_chambre:"غرفة النوم", nav_bain:"الحمّام", nav_table:"السفرة والمطبخ", nav_rideaux:"الستائر", nav_affaires:"أسعار صغيرة", nav_marche:"وين تلاقينا",
    search:"دوّر على منتج (شرشف، مفرش، منشفة…)", cart:"السلة", menu:"القائمة", lang:"Français",
    hero_eyebrow:"مفروشات البيت · أميان",
    hero_h:"نوم هني،<br><em>وحياة ناعمة.</em>",
    hero_p:"أطقم شراشف، مناشف، مفارش وستائر من ماركات معروفة وبأسعار صغيرة. استلمها من السوق أو منوصلها لبيتك بأميان.",
    hero_cta:"اكتشف المتجر", hero_cta2:"اطلب على واتساب", hero_cap:"طقم ٣ قطع · ٢٥ €",
    cats_eyebrow:"أقسامنا", cats_h:"كل البيت، غرفة غرفة", items:"منتج",
    best_eyebrow:"الأكثر طلباً", best_h:"اللي الناس بتطلبه بالسوق", see_all:"شوف الكل",
    small_eyebrow:"أسعار صغيرة", small_h:"أقل من ٥ €",
    why_eyebrow:"ليش دار لين",
    why1_h:"ماركات معروفة", why1_p:"Gérard Pasquier وAmphora وHygie: مفروشات بجودة عالية، جديدة وبكرتونتها.",
    why2_h:"أسعار صغيرة", why2_p:"أسعار منيحة طول السنة، وعروض بالجملة لأغراض كل يوم.",
    why3_h:"استلام أو توصيل", why3_p:"استلام مجاني من السوق أو توصيل للبيت بأميان.",
    why4_h:"١٤ يوم لتغيّر رأيك", why4_p:"المنتج جديد وبكرتونته؟ منبدّله أو منرجّعلك مصاريك.",
    mk_eyebrow:"منشوفك بالسوق", mk_day:"الأحد", mk_h:"سوق أميان الشمالية", mk_p:"لاقي كل بسطة دار لين كل أحد الصبح. اطلب أونلاين ومنخبّيلك طلبك: بتمرق، بتدفع، وبتاخده.",
    mk_list1:"اطلب قبل السبت الساعة ٨ المسا", mk_list2:"طلبك بيستناك عالبسطة", mk_list3:"الدفع بالسوق",
    mk_map:"افتح بخرائط غوغل",
    join_h:"الجديد بيوصلك أول على واتساب", join_p:"بضاعة جديدة، عروض، قطع محدودة: ابعتلنا «جديد» وبتوصلك الصور قبل الكل.",
    join_btn:"ابعت «جديد»",
    f_shop:"المتجر", f_help:"مساعدة", f_legal:"معلومات قانونية", f_contact:"تواصل معنا",
    f_about:"دار لين، بيت المفروشات. متجر عائلي من أميان، بالأسواق وأونلاين.",
    f_rights:"جميع الحقوق محفوظة", f_vat:"الأسعار باليورو وشاملة الضرائب.",
    faq:"أسئلة متكررة", livraison:"التوصيل والاستلام", retours:"الإرجاع والتبديل", about:"مين نحنا", contact_us:"تواصل معنا",
    mentions:"البيانات القانونية", cgv:"شروط البيع", privacy:"الخصوصية",
    add:"زيد عالسلة", added:"انضاف عالسلة", wa_order:"اطلب على واتساب", colour:"اللون", qty:"الكمية",
    perk1:"استلام مجاني من سوق أميان الشمالية", perk2:"توصيل للبيت بأميان: {fee}، ومجاني من {free}", perk3:"إرجاع أو تبديل خلال ١٤ يوم", perk4:"منتج جديد بكرتونته الأصلية",
    details:"التفاصيل", also:"ممكن يعجبك كمان", brand:"الماركة",
    pack:"عرض {n} قطع: {p}",
    all:"الكل", sort:"رتّب", sort_pop:"الأكثر طلباً", sort_up:"السعر من الأقل", sort_down:"السعر من الأعلى",
    all_products:"كل المتجر", affaires_p:"أغراض البيت اليومية بأقل من ٥ €، وعروض أحسن كمان.",
    results:"نتائج «{q}»", no_results:"ما لقينا شي. جرّب «شرشف» أو «مفرش» أو «منشفة».",
    cart_empty:"سلتك فاضية.", continue:"كمّل تسوّق", subtotal:"المجموع", pack_saving:"خصم العروض", checkout:"أكّد الطلب", remove:"شيل",
    co_h:"طلبي", co_mode:"طريقة الاستلام", co_market:"استلام من سوق أميان الشمالية", co_market_s:"مجاني · الأحد الصبح عند بسطة دار لين",
    co_home:"توصيل للبيت (أميان)", co_home_s:"{fee} · مجاني من {free} · خلال ٤٨ ساعة عمل",
    co_you:"معلوماتك", co_name:"الاسم والكنية", co_phone:"رقم التلفون (يفضّل واتساب)", co_addr:"عنوان التوصيل", co_note:"بدك تقلنا شي؟ (اختياري)",
    co_pay:"الدفع", co_pay_txt:"بتدفع وقت تستلم: كاش أو بطاقة بنكية.", co_card_soon:"الدفع بالبطاقة أونلاين: قريباً.", co_card:"ادفع بالبطاقة أونلاين",
    co_delivery:"التوصيل", co_free:"مجاني", co_total:"المجموع الكلي", co_send:"ابعت طلبي على واتساب",
    co_after:"رح ينفتح واتساب وطلبك مكتوب جاهز: بس اضغط إرسال. منأكدلك التوفر بنفس اليوم.",
    co_agree:"قريت ووافقت على شروط البيع.", co_fill:"عبّي الخانات الملوّنة لتكمّل.",
    co_wa_hidden:"إذا ما انفتح واتساب، ابعتلنا على {tel} وانسخ هالرسالة:", copy:"انسخ", copied:"انتسخ",
    order_hello:"مرحبا دار لين، بدي اطلب:",
    low:"باقي {n} بس", co_pickup:"استلام من السوق", soldout:"خلصت", code:"كود الخصم", apply:"طبّق", code_ok:"انطبق الكود ✓", code_bad:"هالكود مش موجود أو انتهى.", code_min:"هالكود بيمشي من {m} وطالع.",
    pay_card:"ادفع هلق بالبطاقة", pay_card_s:"بطاقة بنكية، Apple Pay أو Google Pay · دفع آمن عبر SumUp", pay_cash:"ادفع وقت الاستلام", pay_now:"ادفع بالبطاقة",
    pay_after:"الدفع آمن عبر SumUp: دار لين ما بتشوف معلومات بطاقتك أبداً.", pay_loading:"عم نجهّز الدفع…", pay_error:"ما زبط الدفع. جرّب مرة تانية أو اطلب على واتساب.",
    thanks_h:"شكراً على طلبك!", thanks_p:"وصلنا الدفع (رقم {ref}). ابعتلنا الطلب على واتساب لنتفق على الاستلام أو التوصيل.", thanks_wa:"ابعت طلبي على واتساب",
    legal_ar:"النص القانوني مكتوب بالفرنسية لأنه هي اللغة الرسمية للعقد بفرنسا."
  }
};
let lang = store.get("dl_lang", "fr"); if(!T[lang]) lang = "fr";
const t = (k, vars) => { let s = (T[lang][k] ?? T.fr[k] ?? k); if(vars) for(const v in vars) s = s.replace("{"+v+"}", vars[v]); return s; };
const L = o => o[lang] || o.fr;
const eur = c => (c/100).toLocaleString(lang==="ar" ? "fr-FR" : "fr-FR", {style:"currency", currency:"EUR", minimumFractionDigits: c%100 ? 2 : 0});
const img = n => /[\/.]/.test(String(n)) ? String(n) : "img/" + n + ".jpg";
const waURL = text => "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);

/* textes ajoutés : confiance, entretien, tailles, assistant */
const X = {
  fr: {
    tr1_h:"Livraison sur Amiens", tr1_p:"Sous 48 h, offerte dès {free}",
    tr2_h:"Paiement sécurisé", tr2_p:"Carte, Apple Pay, Google Pay",
    tr3_h:"Retrait gratuit", tr3_p:"Au marché d'Amiens Nord",
    tr4_h:"14 jours pour changer d'avis", tr4_p:"Échange ou remboursement",
    care_h:"Conseils d'entretien", size_h:"Guide des tailles", pay_h:"Paiement 100 % sécurisé",
    pay_list:"Carte bancaire · Apple Pay · Google Pay · espèces au retrait",
    photo_note:"Photo du produit réel dans son emballage d'origine.",
    chat_open:"Une question ?", chat_title:"Assistant Dar Lin", chat_hi:"Bonjour 👋 Je réponds tout de suite aux questions les plus fréquentes. Choisissez un sujet :",
    chat_more:"Autre question", chat_wa:"Parler à Ahmad sur WhatsApp", chat_back:"Autres questions",
    lang_name:"Français",
    rv_h:"Ce que disent nos clients", rv_none:"Soyez le premier à donner votre avis !", rv_count:"{n} avis", rv_verified:"Achat vérifié", rv_write:"Donner mon avis",
    rv_form_h:"Votre avis sur Dar Lin", rv_name:"Prénom (et initiale du nom)", rv_city:"Ville (facultatif)", rv_prod:"Produit acheté (facultatif)", rv_text:"Votre avis", rv_send:"Envoyer mon avis",
    rv_note:"Votre avis nous est envoyé sur WhatsApp. Nous publions tous les avis réels, positifs comme négatifs, sans les modifier.", rv_rate:"Votre note", rv_all:"Tous les avis", rv_google:"Avis Google",
    ship_left:"Plus que {m} pour la livraison offerte 🚚", ship_ok:"Bravo, la livraison à domicile est offerte ✓",
    upsell:"Petit plus pour votre panier", add_s:"Ajouter", recent:"Vus récemment",
    eta:"Commandez aujourd'hui : livré à Amiens d'ici le {d}, ou à retirer dimanche au marché.",
    story_eyebrow:"Notre histoire", story_h:"Du marché d'Amiens à votre maison",
    story_p:"Dar Lin, c'est une petite maison familiale née sur les marchés d'Amiens. Chaque semaine, nous sélectionnons du linge neuf de marques reconnues et nous le proposons à des prix justes. Pas d'intermédiaire, pas de surprise : vous voyez le vrai produit, dans son emballage d'origine, et vous pouvez nous écrire à tout moment.",
    story_cta:"Nous rencontrer au marché",
    rev_h:"Vous avez acheté chez nous ?", rev_p:"Votre avis aide d'autres familles d'Amiens à nous découvrir. Ça prend 30 secondes.", rev_btn:"Laisser un avis",
    pay_icons:"Paiements acceptés", zoom:"Agrandir la photo", close:"Fermer"
  },
  en: {
    tr1_h:"Delivery in Amiens", tr1_p:"Within 48 h, free from {free}",
    tr2_h:"Secure payment", tr2_p:"Card, Apple Pay, Google Pay",
    tr3_h:"Free pickup", tr3_p:"At the Amiens Nord market",
    tr4_h:"14 days to change your mind", tr4_p:"Exchange or refund",
    care_h:"Care guide", size_h:"Size guide", pay_h:"100% secure payment",
    pay_list:"Bank card · Apple Pay · Google Pay · cash on pickup",
    photo_note:"Photo of the real product in its original packaging.",
    chat_open:"A question?", chat_title:"Dar Lin assistant", chat_hi:"Hello 👋 I can answer the most common questions right away. Pick a topic:",
    chat_more:"Something else", chat_wa:"Talk to Ahmad on WhatsApp", chat_back:"Other questions",
    lang_name:"English",
    rv_h:"What our customers say", rv_none:"Be the first to leave a review!", rv_count:"{n} reviews", rv_verified:"Verified purchase", rv_write:"Write a review",
    rv_form_h:"Your review of Dar Lin", rv_name:"First name (and last initial)", rv_city:"Town (optional)", rv_prod:"Product bought (optional)", rv_text:"Your review", rv_send:"Send my review",
    rv_note:"Your review is sent to us on WhatsApp. We publish every genuine review, positive or negative, without editing it.", rv_rate:"Your rating", rv_all:"All reviews", rv_google:"Google reviews",
    ship_left:"Only {m} more for free delivery 🚚", ship_ok:"Great, home delivery is free ✓",
    upsell:"A little extra for your cart", add_s:"Add", recent:"Recently viewed",
    eta:"Order today: delivered in Amiens by {d}, or collect it on Sunday at the market.",
    story_eyebrow:"Our story", story_h:"From the Amiens market to your home",
    story_p:"Dar Lin is a small family business born at the markets of Amiens. Every week we select brand-new linen from trusted brands and offer it at fair prices. No middleman, no surprises: you see the real product in its original packaging, and you can message us anytime.",
    story_cta:"Meet us at the market",
    rev_h:"Bought from us?", rev_p:"Your review helps other families in Amiens discover us. It takes 30 seconds.", rev_btn:"Leave a review",
    pay_icons:"Accepted payments", zoom:"Enlarge photo", close:"Close"
  },
  ar: {
    tr1_h:"توصيل بأميان", tr1_p:"خلال ٤٨ ساعة، مجاني من {free}",
    tr2_h:"دفع آمن", tr2_p:"بطاقة، Apple Pay، Google Pay",
    tr3_h:"استلام مجاني", tr3_p:"من سوق أميان الشمالية",
    tr4_h:"١٤ يوم لتغيّر رأيك", tr4_p:"تبديل أو استرجاع المصاري",
    care_h:"نصائح الغسيل", size_h:"دليل المقاسات", pay_h:"دفع آمن ١٠٠٪",
    pay_list:"بطاقة بنكية · Apple Pay · Google Pay · كاش وقت الاستلام",
    photo_note:"صورة المنتج الحقيقي بكرتونته الأصلية.",
    chat_open:"عندك سؤال؟", chat_title:"مساعد دار لين", chat_hi:"أهلاً 👋 بجاوبك فوراً على الأسئلة المتكررة. اختار موضوع:",
    chat_more:"سؤال تاني", chat_wa:"احكي مع أحمد على واتساب", chat_back:"أسئلة تانية",
    lang_name:"العربية",
    rv_h:"شو بيقولوا زباينّا", rv_none:"كون أول واحد بيكتب رأيه!", rv_count:"{n} تقييم", rv_verified:"شراء مؤكد", rv_write:"اكتب رأيك",
    rv_form_h:"رأيك بدار لين", rv_name:"الاسم (وأول حرف من الكنية)", rv_city:"المدينة (اختياري)", rv_prod:"شو اشتريت؟ (اختياري)", rv_text:"رأيك", rv_send:"ابعت رأيي",
    rv_note:"رأيك بيوصلنا على واتساب. منحط كل التقييمات الحقيقية، الحلوة والسيئة، بدون ما نغيّر فيها.", rv_rate:"تقييمك", rv_all:"كل التقييمات", rv_google:"تقييمات غوغل",
    ship_left:"باقي {m} وبيصير التوصيل مجاني 🚚", ship_ok:"حلو، التوصيل للبيت صار مجاني ✓",
    upsell:"شي صغير بيكمّل سلتك", add_s:"زيد", recent:"شفتهن مؤخراً",
    eta:"اطلب اليوم: بيوصلك بأميان لحد {d}، أو استلمه الأحد من السوق.",
    story_eyebrow:"قصتنا", story_h:"من سوق أميان لبيتك",
    story_p:"دار لين مشروع عائلي صغير انولد بأسواق أميان. كل أسبوع منختار مفروشات جديدة من ماركات معروفة ومنبيعها بأسعار منيحة. بلا وسيط وبلا مفاجآت: بتشوف المنتج الحقيقي بكرتونته الأصلية، وفيك تحكينا بأي وقت.",
    story_cta:"تعال شوفنا بالسوق",
    rev_h:"اشتريت من عنا؟", rev_p:"رأيك بيساعد عائلات تانية بأميان تتعرف علينا. بياخد ٣٠ ثانية بس.", rev_btn:"اكتب رأيك",
    pay_icons:"طرق الدفع", zoom:"كبّر الصورة", close:"سكّر"
  }
};
for(const k in X) Object.assign(T[k], X[k]);
T.fr.lang = "Français"; T.ar.lang = "العربية"; T.en.lang = "English";
const LANGS = [["fr","FR"],["en","EN"],["ar","ع"]];
const LBL = (o, key) => (o && (o[key+"_"+lang] || o[key+"_fr"] || o[key+"_ar"])) || "";
const SPEC = {en:{"Dimensions":"Size","Contenu":"Contents","Matière":"Material","Dos":"Back","Format":"Size","Offre":"Offer","Pose":"Hanging"},
  ar:{"Dimensions":"المقاسات","Contenu":"المحتوى","Matière":"القماش","Dos":"الظهر","Format":"الحجم","Offre":"العرض","Pose":"التركيب"}};
const specLabel = l => (SPEC[lang] && SPEC[lang][l]) || l;
/* entretien par catégorie */
const CARE = {
  fr:{chambre:["Lavez avant la première utilisation.","Coton : 40 °C, couleurs séparées. Polyester : 30 °C.","Séchage à basse température, retirez vite pour éviter les plis.","Repassage doux, de préférence légèrement humide."],
      bain:["Lavez 2 ou 3 fois avant la 1re utilisation : l'éponge devient plus absorbante.","Lavage à 40 °C, sans adoucissant (il bouche les fibres).","Séchage en machine à basse température pour un toucher moelleux.","Ne pas repasser."],
      table:["Nappes anti-taches : essuyez avec une éponge humide.","Lavage à 30 °C, pas d'eau de Javel.","Nappe cirée : nettoyage à l'éponge uniquement, ne pas laver en machine.","Torchons et lavettes : 60 °C pour une hygiène parfaite."],
      rideaux:["Lavage délicat à 30 °C, essorage léger.","Suspendez encore humide : les plis tombent tout seuls.","Repassage doux si besoin, sur l'envers.","Retirez les œillets du tambour avec un filet de lavage."]},
  en:{chambre:["Wash before first use.","Cotton: 40 °C, colours separately. Polyester: 30 °C.","Tumble dry low and remove quickly to avoid creases.","Iron gently, ideally while slightly damp."],
      bain:["Wash 2 or 3 times before first use: terry becomes more absorbent.","Wash at 40 °C without fabric softener (it clogs the fibres).","Tumble dry low for a fluffy feel.","Do not iron."],
      table:["Stain-resistant tablecloths: wipe with a damp sponge.","Wash at 30 °C, no bleach.","Oilcloth: sponge clean only, do not machine wash.","Tea towels and cloths: 60 °C for perfect hygiene."],
      rideaux:["Gentle wash at 30 °C, light spin.","Hang while still damp: creases fall out on their own.","Iron gently on the reverse if needed.","Use a laundry bag to protect the eyelets."]},
  ar:{chambre:["اغسله قبل أول استعمال.","القطن: ٤٠ درجة، والألوان لحال. البوليستر: ٣٠ درجة.","نشّف على حرارة خفيفة وطلّعه بسرعة لما يتكرمش.","كوي خفيف، ويفضّل وهو رطب شوي."],
      bain:["اغسل المنشفة ٢ أو ٣ مرات قبل أول استعمال: بتصير تنشّف أحسن.","غسيل على ٤٠ درجة بدون منعّم (بيسكّر الخيوط).","نشّف بالنشافة على حرارة خفيفة لتضل ناعمة.","لا تكويها."],
      table:["المفارش ضد البقع: امسحها بإسفنجة رطبة.","غسيل على ٣٠ درجة، بدون كلور.","المفرش المشمّع: بالإسفنجة بس، لا تحطه بالغسالة.","الفوط والممسحات: ٦٠ درجة لنظافة كاملة."],
      rideaux:["غسيل خفيف على ٣٠ درجة وعصر خفيف.","علّقها وهي رطبة: الكرمشة بتروح لحالها.","كوي خفيف عالقفا إذا لزم.","حطها بكيس غسيل لتحمي الحلقات."]}
};
const SIZES = {
  fr:"<tr><th>Lit 1 place (90×190)</th><td>Drap housse 90×190 · drap plat 180×290</td></tr><tr><th>Lit 2 places (140×190)</th><td>Drap housse 140×190 · drap plat 240×300</td></tr><tr><th>King (160×200)</th><td>Drap housse 160×200 · drap plat 240×300</td></tr><tr><th>XL King (180×200)</th><td>Drap housse 180×200 · drap plat 270×300</td></tr><tr><th>Matelas épais</th><td>Bonnet 25 cm : tient jusqu'à 25 cm d'épaisseur</td></tr>",
  en:"<tr><th>Single (90×190)</th><td>Fitted sheet 90×190 · flat sheet 180×290</td></tr><tr><th>Double (140×190)</th><td>Fitted sheet 140×190 · flat sheet 240×300</td></tr><tr><th>King (160×200)</th><td>Fitted sheet 160×200 · flat sheet 240×300</td></tr><tr><th>XL King (180×200)</th><td>Fitted sheet 180×200 · flat sheet 270×300</td></tr><tr><th>Thick mattress</th><td>25 cm pocket: fits mattresses up to 25 cm</td></tr>",
  ar:"<tr><th>تخت مفرد (90×190)</th><td>شرشف مطاط 90×190 · شرشف عادي 180×290</td></tr><tr><th>تخت مزدوج (140×190)</th><td>شرشف مطاط 140×190 · شرشف عادي 240×300</td></tr><tr><th>كينغ (160×200)</th><td>شرشف مطاط 160×200 · شرشف عادي 240×300</td></tr><tr><th>XL كينغ (180×200)</th><td>شرشف مطاط 180×200 · شرشف عادي 270×300</td></tr><tr><th>فرشة سميكة</th><td>جيب ٢٥ سم: بيركب على فرشة لحد ٢٥ سم</td></tr>"
};
/* questions fréquentes : page FAQ + assistant */
const FAQ = {
  fr:[["Comment se passe la livraison ?","Nous livrons nous-mêmes à Amiens et dans les communes voisines, sous 48 h ouvrées. Frais : {fee}, offerts dès {free}. Vous pouvez aussi retirer gratuitement votre commande au marché d'Amiens Nord le dimanche matin."],
      ["Comment payer ?","En ligne par carte bancaire, Apple Pay ou Google Pay (paiement sécurisé SumUp), ou à la remise de la commande en espèces ou par carte."],
      ["Les produits sont-ils neufs ?","Oui. Tous nos articles sont neufs, dans leur emballage d'origine de marque (Gérard Pasquier, Amphora, Hygie…)."],
      ["Quelle taille de drap housse choisir ?","Mesurez votre matelas : 140×190 pour un lit 2 places classique, 160×200 pour un King, 180×200 pour un XL King. Nos draps housse ont un bonnet de 25 cm, idéal pour les matelas épais."],
      ["Puis-je retourner un article ?","Oui, vous avez 14 jours pour l'échanger ou être remboursé, s'il est neuf et dans son emballage."],
      ["Où vous trouver ?","Chaque dimanche matin au marché d'Amiens Nord (Le Colvert). Commandez avant samedi 20 h et votre commande vous attend au stand."],
      ["Avez-vous un code promo ?","Oui : MERCI10 donne -10 % dès 20 € d'achat. Des lots (2 serviettes pour 5 €, 3 torchons pour 5 €…) s'appliquent automatiquement au panier."],
      ["Parlez-vous arabe ?","Oui ! نعم، منحكي عربي. Écrivez-nous dans la langue que vous préférez."]],
  en:[["How does delivery work?","We deliver ourselves in Amiens and nearby towns within 48 working hours. Fee: {fee}, free from {free}. You can also collect your order for free at the Amiens Nord market on Sunday morning."],
      ["How can I pay?","Online by bank card, Apple Pay or Google Pay (secure SumUp payment), or on delivery in cash or by card."],
      ["Are the products new?","Yes. All our items are brand new, in their original branded packaging (Gérard Pasquier, Amphora, Hygie…)."],
      ["Which fitted sheet size should I choose?","Measure your mattress: 140×190 for a standard double, 160×200 for a King, 180×200 for an XL King. Our fitted sheets have a 25 cm pocket, ideal for thick mattresses."],
      ["Can I return an item?","Yes, you have 14 days to exchange it or get a refund, if it is new and in its packaging."],
      ["Where can I find you?","Every Sunday morning at the Amiens Nord market (Le Colvert). Order before Saturday 8 pm and your order will be waiting at the stall."],
      ["Do you have a promo code?","Yes: MERCI10 gives 10% off from €20. Bundles (2 towels for €5, 3 tea towels for €5…) apply automatically in the cart."],
      ["Do you speak other languages?","Yes! French, English and Arabic. Write to us in the language you prefer."]],
  ar:[["كيف بيصير التوصيل؟","منوصّل بنفسنا بأميان والضيع اللي حولها خلال ٤٨ ساعة عمل. التوصيل {fee}، ومجاني من {free}. فيك كمان تستلم طلبك ببلاش من سوق أميان الشمالية يوم الأحد الصبح."],
      ["كيف بدفع؟","أونلاين بالبطاقة البنكية أو Apple Pay أو Google Pay (دفع آمن عبر SumUp)، أو وقت الاستلام كاش أو بطاقة."],
      ["البضاعة جديدة؟","أكيد. كل منتجاتنا جديدة وبكرتونتها الأصلية من الماركة (Gérard Pasquier، Amphora، Hygie…)."],
      ["أي مقاس شرشف مطاط آخد؟","قيس فرشتك: 140×190 للتخت المزدوج العادي، 160×200 للكينغ، 180×200 للـ XL كينغ. الشراشف عنا جيبها ٢٥ سم، منيحة للفرشات السميكة."],
      ["فيني رجّع شي؟","أكيد، عندك ١٤ يوم لتبدّله أو تسترجع مصاريك، إذا كان جديد وبكرتونته."],
      ["وين بلاقيكم؟","كل أحد الصبح بسوق أميان الشمالية (Le Colvert). اطلب قبل السبت الساعة ٨ المسا وطلبك بيستناك عالبسطة."],
      ["في كود خصم؟","إيه: MERCI10 بيعطيك خصم ١٠٪ من ٢٠ € وطالع. والعروض (منشفتين بـ ٥ €، ٣ فوط بـ ٥ €…) بتنحسب لحالها بالسلة."],
      ["بتحكوا عربي؟","أكيد! منحكي عربي وفرنساوي وإنكليزي. ابعتلنا باللغة اللي بتريحك."]]
};
const PAYICONS = `<span class="payicons" aria-label="Visa, Mastercard, Apple Pay, Google Pay">
  <svg viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#fff"/><path d="M19.5 20.5h-2.8l1.8-11h2.8zm10.2-10.7a6.9 6.9 0 0 0-2.5-.5c-2.8 0-4.7 1.5-4.7 3.6 0 1.6 1.4 2.4 2.5 3 1.1.5 1.5.9 1.5 1.4 0 .7-.9 1.1-1.7 1.1-1.1 0-1.8-.2-2.7-.6l-.4-.2-.4 2.4a9 9 0 0 0 3.2.6c3 0 4.9-1.5 4.9-3.7 0-1.2-.7-2.2-2.4-3-1-.5-1.6-.8-1.6-1.4 0-.5.5-1 1.6-1a5 5 0 0 1 2.1.4l.3.1zm7.2-.3h-2.2c-.7 0-1.2.2-1.5.9l-4.2 10.1h3l.6-1.6h3.6l.3 1.6h2.6zm-3.5 7.1 1.1-3.1.6 3.1zM15.2 9.5l-2.8 7.5-.3-1.5a8.4 8.4 0 0 0-3.9-4.6l2.5 9.6h3l4.5-11z" fill="#1A1F71"/><path d="M9.9 9.5H5.3l-.1.2c3.6.9 6 3.1 6.9 5.8l-1-5.1c-.1-.7-.6-.9-1.2-.9z" fill="#F9A533"/></svg>
  <svg viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#fff"/><circle cx="19.5" cy="15" r="7.5" fill="#EB001B"/><circle cx="28.5" cy="15" r="7.5" fill="#F79E1B"/><path d="M24 9a7.5 7.5 0 0 1 0 12 7.5 7.5 0 0 1 0-12z" fill="#FF5F00"/></svg>
  <svg viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#000"/><text x="24" y="19.5" text-anchor="middle" font-family="-apple-system,Helvetica,Arial" font-size="10" font-weight="600" fill="#fff"> Pay</text></svg>
  <svg viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#fff"/><text x="24" y="19.5" text-anchor="middle" font-family="Arial" font-size="10" font-weight="700" fill="#5F6368"><tspan fill="#4285F4">G</tspan> Pay</text></svg>
  <svg viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#fff"/><text x="24" y="19" text-anchor="middle" font-family="Arial" font-size="8.5" font-weight="700" fill="#2E2118">CB</text></svg>
</span>`;
function etaDate(){ const d = new Date(); let n = 0; while(n < 2){ d.setDate(d.getDate()+1); if(d.getDay()!==0 && d.getDay()!==6) n++; }
  return d.toLocaleDateString(lang==="ar"?"ar":lang==="en"?"en-GB":"fr-FR", {weekday:"long", day:"numeric", month:"numeric"}); }
let recent = store.get("dl_recent", []);
function pushRecent(id){ recent = [id, ...recent.filter(x=>x!==id)].slice(0,8); store.set("dl_recent", recent); }
function setMeta(desc, imgUrl){
  const m = (sel, attr, val) => { let el = document.head.querySelector(sel); if(!el){ el = document.createElement("meta"); const [k,v] = attr; el.setAttribute(k, v); document.head.appendChild(el); } el.setAttribute("content", val); };
  m('meta[name="description"]', ["name","description"], desc);
  m('meta[property="og:description"]', ["property","og:description"], desc);
  if(imgUrl) m('meta[property="og:image"]', ["property","og:image"], imgUrl);
}
function productLD(p){
  let el = document.getElementById("ld-product"); if(!el){ el = document.createElement("script"); el.type = "application/ld+json"; el.id = "ld-product"; document.head.appendChild(el); }
  el.textContent = p ? JSON.stringify({"@context":"https://schema.org","@type":"Product","name":p.fr.name,"description":p.fr.desc,"brand":p.brand?{"@type":"Brand","name":p.brand}:undefined,
    "image":[...new Set(p.variants.map(v=>"https://darlinmaison.fr/"+img(v.img).replace(/^img\//,"")))],"sku":p.id,"aggregateRating":revFor(p.id).length?{"@type":"AggregateRating","ratingValue":avg(revFor(p.id)).toFixed(1),"reviewCount":revFor(p.id).length}:undefined,"review":revFor(p.id).slice(0,5).map(r=>({"@type":"Review","author":{"@type":"Person","name":r.name},"reviewRating":{"@type":"Rating","ratingValue":r.rating,"bestRating":5},"reviewBody":r.text,"datePublished":r.date})),
    "offers":{"@type":"Offer","price":Number(p.price).toFixed(2),"priceCurrency":"EUR","availability":p.stock===0?"https://schema.org/OutOfStock":"https://schema.org/InStock","url":"https://darlinmaison.fr/#p-"+p.id,"seller":{"@type":"Organization","name":"Dar Lin"}}}) : "";
}
const starsHTML = (n, cls) => `<span class="rstars ${cls||""}" aria-label="${n}/5">${[1,2,3,4,5].map(i=>`<i class="${i<=Math.round(n)?"on":""}">★</i>`).join("")}</span>`;
const revFor = id => REV.filter(r => !id || r.product===id);
const avg = list => list.length ? list.reduce((a,r)=>a+(+r.rating||0),0)/list.length : 0;
function revCard(r){ const p = r.product && byId(r.product);
  return `<figure class="rcard">${starsHTML(+r.rating)}<blockquote>${esc(r.text||"")}</blockquote>
    <figcaption><b>${esc(r.name||"")}</b>${r.city?` · ${esc(r.city)}`:""}${r.verified?` · <span class="ver">✓ ${t("rv_verified")}</span>`:""}${p?`<br><a href="#p-${p.id}">${esc(L(p).name)}</a>`:""}${r.date?` <small>${esc(new Date(r.date).toLocaleDateString(lang==="en"?"en-GB":"fr-FR"))}</small>`:""}</figcaption></figure>`; }
function revSummary(list){ return list.length ? `<div class="rsum">${starsHTML(avg(list),"big")}<b>${avg(list).toFixed(1).replace(".",",")}/5</b><span>${t("rv_count",{n:list.length})}</span></div>` : ""; }
function openReviewForm(pid){
  const r = $("#drawerRoot"); let rating = 5;
  r.innerHTML = `<div class="drawer-bg" id="dbg"></div><aside class="drawer rvform" role="dialog" aria-modal="true" aria-label="${t("rv_form_h")}">
    <div class="drawer-h"><h2>${t("rv_form_h")}</h2><button class="icon-btn" id="dclose" type="button" aria-label="${t("close")}">${I.close}</button></div>
    <form class="drawer-b" id="rvF">
      <div class="opt-label" style="margin-top:0">${t("rv_rate")}</div>
      <div class="rpick" id="rpick">${[1,2,3,4,5].map(i=>`<button type="button" data-r="${i}" aria-label="${i}/5" class="on">★</button>`).join("")}</div>
      <div class="field"><label for="rv-n">${t("rv_name")}</label><input id="rv-n" required placeholder=" "></div>
      <div class="field"><label for="rv-c">${t("rv_city")}</label><input id="rv-c" placeholder=" "></div>
      <div class="field"><label for="rv-p">${t("rv_prod")}</label><select id="rv-p"><option value="">—</option>${P.map(p=>`<option value="${p.id}" ${p.id===pid?"selected":""}>${esc(L(p).name)}</option>`).join("")}</select></div>
      <div class="field"><label for="rv-t">${t("rv_text")}</label><textarea id="rv-t" rows="4" required></textarea></div>
      <p class="note">${t("rv_note")}</p>
      <button class="btn wa block" type="submit">${I.wa} ${t("rv_send")}</button>
    </form></aside>`;
  $("#dbg").onclick = closeDrawer; $("#dclose").onclick = closeDrawer;
  const paint = () => r.querySelectorAll("[data-r]").forEach(b => b.classList.toggle("on", +b.dataset.r <= rating));
  r.querySelectorAll("[data-r]").forEach(b => b.onclick = () => { rating = +b.dataset.r; paint(); });
  $("#rvF").onsubmit = e => { e.preventDefault();
    const n = $("#rv-n").value.trim(), tx = $("#rv-t").value.trim(); if(!n || !tx){ (!n?$("#rv-n"):$("#rv-t")).style.borderColor = "var(--warn)"; return; }
    const pr = byId($("#rv-p").value);
    const msg = `⭐ AVIS CLIENT DAR LIN\nNote : ${"★".repeat(rating)}${"☆".repeat(5-rating)} (${rating}/5)\nNom : ${n}${$("#rv-c").value.trim()?"\nVille : "+$("#rv-c").value.trim():""}${pr?"\nProduit : "+pr.fr.name+" ("+pr.id+")":""}\n\n${tx}`;
    const a = document.createElement("a"); a.href = waURL(msg); a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); closeDrawer(); };
}
const faqList = () => FAQ[lang].map(([q,a]) => [q, a.replace("{fee}", eur(C.deliveryFee)).replace("{free}", eur(C.freeDeliveryFrom))]);

/* ---------- icônes ---------- */
const I = {
  bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  wa:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>',
  tag:'<svg viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>',
  pin:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  card:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>'
};
const LOGO = '<svg viewBox="0 0 100 130" aria-hidden="true"><path d="M8 126 V52 A42 42 0 0 1 92 52 V126" fill="none" stroke="var(--accent)" stroke-width="5.5" stroke-linecap="round"/><rect x="24" y="78" width="52" height="9" rx="2.5" fill="var(--accent)"/><rect x="28" y="92" width="44" height="9" rx="2.5" fill="#C48A5A"/><rect x="32" y="106" width="36" height="9" rx="2.5" fill="#E3CBAA"/></svg>';

/* ---------- panier ---------- */
let cart = store.get("dl_cart", []);
const byId = id => P.find(p => p.id === id);
function saveCart(){ store.set("dl_cart", cart); renderBadge(); }
function addToCart(id, vi, q){
  const ex = cart.find(l => l.id===id && l.v===vi);
  if(ex) ex.q += q; else cart.push({id, v:vi, q});
  saveCart(); toast(t("added")); openDrawer();
}
function cartCount(){ return cart.reduce((a,l)=>a+l.q,0); }
function lineTotal(l){ const p = byId(l.id); return p ? pc(p)*l.q : 0; }
let promoCode = store.get("dl_code", "");
function calc(mode){ return E.compute(cart, {products:P, promos:PROMOS, settings:S}, {mode: mode || "market", code: promoCode}); }
const promoLabel = d => esc((PROMOS.find(x=>x.id===d.id) && LBL(PROMOS.find(x=>x.id===d.id),"label")) || LBL(d,"label"));
function sumRows(r, withDelivery){
  return `<div class="sum"><span>${t("subtotal")}</span><span>${eur(r.sub)}</span></div>
    ${r.discounts.map(d=>`<div class="sum ok"><span>${promoLabel(d)}</span><span>−${eur(d.amount)}</span></div>`).join("")}
    ${withDelivery?`<div class="sum"><span>${r.mode==="home"?t("co_delivery"):t("co_pickup")}</span><span>${r.delivery?eur(r.delivery):t("co_free")}</span></div>`:""}
    <div class="sum total"><span>${t("co_total")}</span><span>${eur(withDelivery?r.total:r.net)}</span></div>`;
}

/* ---------- shell ---------- */
const app = $("#app");
function applyTheme(){
  const th = S.theme || {}, q = f => "'" + String(f||"").replace(/'/g,"") + "'";
  let st = document.getElementById("dl-theme"); if(!st){ st = document.createElement("style"); st.id = "dl-theme"; document.head.appendChild(st); }
  st.textContent = `:root{--brun:${th.primary};--accent:${th.primary};--caramel:${th.secondary};--accent2:${th.secondary};--sable:${th.sand};--bg:${th.background};--surface:${th.surface};--lin:${th.surface};--ink:${th.text};--r:${+th.radius||14}px;--f-display:${q(th.fontTitles)}, "Amiri", Georgia, serif;--f-body:${q(th.fontText)}, "Amiri", system-ui, sans-serif;--f-ar:${q(th.fontArabic)}, "Amiri", serif}
section.sec{padding-block:${+th.spacing||64}px}
.topbar,footer,.market-card{background:${th.primary}}`;
  const fams = [th.fontTitles, th.fontText, th.fontArabic].filter(Boolean).map(f => "family=" + encodeURIComponent(f).replace(/%20/g,"+") + ":wght@400;500;600;700");
  if(!document.getElementById("dl-fonts") && fams.length){ const l = document.createElement("link"); l.id = "dl-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?" + fams.join("&") + "&display=swap"; document.head.appendChild(l); }
}
function shell(){
  applyTheme();
  document.documentElement.lang = lang; document.documentElement.dir = lang==="ar" ? "rtl" : "ltr";
  const nav = [["chambre","nav_chambre"],["bain","nav_bain"],["table","nav_table"],["rideaux","nav_rideaux"],["affaires","nav_affaires"],["marche","nav_marche"]];
  app.innerHTML = `
  <div class="topbar"><div class="wrap">${((S.topbar||{})[lang]||(S.topbar||{}).fr||[]).map((x,i)=>`<span class="tb${i===0?" on":""}">${esc(x)}</span>`).join("<span class=\"tbsep\">·</span>")}</div></div>
  <header class="hdr"><div class="wrap">
    <a class="logo" href="#accueil" aria-label="Dar Lin">${LOGO}<span><b>Dar Lin</b><small>LINGE DE MAISON</small></span></a>
    <nav class="nav" aria-label="Principal">${nav.map(([h,k])=>`<a href="#${h}" data-nav="${h}">${t(k)}</a>`).join("")}</nav>
    <div class="hdr-actions">
      <div class="langs" role="group" aria-label="Langue / Language / اللغة">${LANGS.map(([k,l])=>`<button type="button" data-lang="${k}" aria-pressed="${k===lang}" lang="${k}" title="${T[k].lang_name}">${l}</button>`).join("")}</div>
      <button class="icon-btn" id="searchBtn" type="button" aria-label="${t("search")}">${I.search}</button>
      <button class="icon-btn" id="cartBtn" type="button" aria-label="${t("cart")}">${I.bag}<span class="badge" id="badge" hidden>0</span></button>
      <button class="icon-btn burger" id="burger" type="button" aria-label="${t("menu")}" aria-expanded="false">${I.menu}</button>
    </div></div>
    <div class="search" id="searchBar" hidden><div class="wrap"><label class="sr" for="q">${t("search")}</label><input id="q" type="search" placeholder="${t("search")}" autocomplete="off"></div></div>
    <div class="mnav" id="mnav" hidden><div class="wrap">${nav.map(([h,k])=>`<a href="#${h}">${t(k)}</a>`).join("")}<a href="#tout">${t("all_products")}</a></div></div>
  </header>
  <main id="view"></main>
  ${footer()}
  <div class="chat" id="chat">
    <div class="chat-panel" id="chatPanel" hidden role="dialog" aria-label="${t("chat_title")}">
      <div class="chat-h"><span class="chat-av">${LOGO.replace(/var\(--accent\)/g,"#F4ECE1")}</span><div><b>${t("chat_title")}</b><small>WhatsApp · ${C.phoneDisplay}</small></div><button type="button" class="icon-btn" id="chatClose" aria-label="×">${I.close}</button></div>
      <div class="chat-b" id="chatBody"></div>
    </div>
    <button type="button" class="chat-btn" id="chatBtn" aria-expanded="false"><span class="chat-label">${t("chat_open")}</span><span class="chat-ic">${I.wa}</span></button>
  </div>
  <div id="drawerRoot"></div><div id="toastRoot" aria-live="polite"></div>`;
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set("dl_lang", lang); shell(); route(); });
  bindChat();
  clearInterval(window.__tb); window.__tb = setInterval(() => { const a = [...document.querySelectorAll(".topbar .tb")]; if(a.length<2) return; const i = a.findIndex(x=>x.classList.contains("on")); a[i].classList.remove("on"); a[(i+1)%a.length].classList.add("on"); }, 3500);
  $("#cartBtn").onclick = openDrawer;
  $("#burger").onclick = e => { const m = $("#mnav"); m.hidden = !m.hidden; e.currentTarget.setAttribute("aria-expanded", String(!m.hidden)); };
  $("#searchBtn").onclick = () => { const s = $("#searchBar"); s.hidden = !s.hidden; if(!s.hidden) $("#q").focus(); };
  $("#q").addEventListener("input", e => { const v = e.target.value.trim(); if(v.length >= 2) renderSearch(v); else if(!v) route(); });
  renderBadge();
}
function renderBadge(){ const b = $("#badge"); if(!b) return; const n = cartCount(); b.textContent = n; b.hidden = n===0; }
/* ---------- assistant (questions fréquentes, puis WhatsApp) ---------- */
function bindChat(){
  const panel = $("#chatPanel"), btn = $("#chatBtn"), body = $("#chatBody"); if(!panel) return;
  const waLink = q => `<a class="btn wa block" href="${waURL((lang==="ar"?"مرحبا دار لين، عندي سؤال: ":lang==="en"?"Hello Dar Lin, I have a question: ":"Bonjour Dar Lin, j'ai une question : ") + (q||""))}" target="_blank" rel="noopener">${I.wa} ${t("chat_wa")}</a>`;
  const menu = () => {
    body.innerHTML = `<div class="msg bot">${t("chat_hi")}</div><div class="qs">${faqList().map(([q],i)=>`<button type="button" data-q="${i}">${esc(q)}</button>`).join("")}</div>${waLink("")}`;
    body.querySelectorAll("[data-q]").forEach(b => b.onclick = () => answer(+b.dataset.q));
  };
  const answer = i => {
    const [q,a] = faqList()[i];
    body.innerHTML = `<div class="msg me">${esc(q)}</div><div class="msg bot">${esc(a)}</div><button type="button" class="chat-more" id="chatMore">← ${t("chat_back")}</button>${waLink(q)}`;
    $("#chatMore").onclick = menu; body.scrollTop = 0;
  };
  const open = v => { panel.hidden = !v; btn.setAttribute("aria-expanded", String(v)); btn.classList.toggle("on", v); if(v) menu(); };
  btn.onclick = () => open(panel.hidden);
  $("#chatClose").onclick = () => open(false);
}
function footer(){
  return `<footer><div class="wrap">
    <div class="fgrid">
      <div><a class="logo" href="#accueil" style="margin-bottom:14px">${LOGO.replace(/var\(--accent\)/g,"#F4ECE1")}<span><b style="color:#F4ECE1">Dar Lin</b><small>LINGE DE MAISON</small></span></a><p style="margin:14px 0 0; font-size:.92rem; max-width:34ch">${t("f_about")}</p></div>
      <div><h4>${t("f_shop")}</h4><ul>${CATS.map(c=>`<li><a href="#${c.id}">${L(c)}</a></li>`).join("")}<li><a href="#affaires">${t("nav_affaires")}</a></li></ul></div>
      <div><h4>${t("f_help")}</h4><ul><li><a href="#livraison">${t("livraison")}</a></li><li><a href="#retours">${t("retours")}</a></li><li><a href="#faq">${t("faq")}</a></li><li><a href="#accueil" onclick="setTimeout(()=>{const e=document.getElementById('avis'); if(e) e.scrollIntoView({behavior:'smooth'})},120)">${t("rv_h")}</a></li><li><a href="#a-propos">${t("about")}</a></li></ul></div>
      <div><h4>${t("f_contact")}</h4><ul>
        <li><a href="${waURL(t("order_hello").replace(":", "."))}" target="_blank" rel="noopener">WhatsApp · <span dir="ltr">${C.phoneDisplay}</span></a></li>
        <li><span style="user-select:all">${C.email}</span></li>
        <li><a href="${C.instagram}" target="_blank" rel="noopener">Instagram @darlinmaison</a></li>
        <li><a href="${C.facebook}" target="_blank" rel="noopener">Facebook Dar Lin</a></li>
        <li><a href="#marche">${t("nav_marche")}</a></li></ul></div>
    </div>
    <div class="fpay"><span>${t("pay_icons")}</span>${PAYICONS}</div>
    <div class="legal-line"><span>© ${new Date().getFullYear()} Dar Lin · ${t("f_rights")} · ${t("f_vat")}</span>
      <span><a href="#mentions-legales">${t("mentions")}</a> · <a href="#cgv">${t("cgv")}</a> · <a href="#confidentialite">${t("privacy")}</a></span></div>
  </div></footer>`;
}

/* ---------- composants ---------- */
function card(p){
  const v0 = p.variants[0];
  const pr = E.promosFor(p, PROMOS)[0];
  const tag = pr ? `<span class="tag promo">${esc(LBL(pr,"label"))}</span>` : (p.star ? `<span class="tag">${t("best_eyebrow")}</span>` : "");
  const low = p.stock!=null && p.stock>0 && p.stock<=3 ? `<span class="tag low">${t("low",{n:p.stock})}</span>` : (p.stock===0 ? `<span class="tag low">${t("soldout")}</span>` : "");
  return `<a class="pc" href="#p-${p.id}">
    <div class="pc-img"><img src="${img(v0.img)}" alt="${esc(L(p).name)}" loading="lazy">${tag}${low}</div>
    <h3>${esc(L(p).name)}</h3>
    <div class="sub">${esc(L(p).short)}</div>
    <div class="row"><span class="price">${eur(pc(p))}</span>${p.variants.length>1?`<span class="dots">${p.variants.slice(0,6).map(v=>`<span class="dot" style="background:${v.hex}" title="${esc(L(v))}"></span>`).join("")}${p.variants.length>6?`<small class="more">+${p.variants.length-6}</small>`:""}</span>`:""}</div>
  </a>`;
}
const grid = list => `<div class="grid">${list.map(card).join("")}</div>`;

/* ---------- vues ---------- */
function home(){
  const stars = P.filter(p=>p.star).slice(0,8);
  const small = P.filter(p=>p.price<=5).sort((a,b)=>a.price-b.price);
  return `
  <section class="hero2" style="--hero:url('${img(S.hero.image1)}')"><div class="wrap">
    <div class="hero2-txt reveal">
      <div class="eyebrow">${t("hero_eyebrow")}</div>
      <h1>${LBL(S.hero,"title")}</h1>
      <p>${esc(LBL(S.hero,"text"))}</p>
      <div class="hero-ctas"><a class="btn light" href="#tout">${t("hero_cta")}</a><a class="btn ghost-light" href="${waURL(t("order_hello").replace(":", "."))}" target="_blank" rel="noopener">${I.wa} ${t("hero_cta2")}</a></div>
      ${LBL(S.hero,"caption")?`<span class="hero2-cap">${esc(LBL(S.hero,"caption"))}</span>`:""}
    </div>
  </div></section>
  <section class="trust" aria-label="${t("why_eyebrow")}"><div class="wrap">
    <div>${I.truck}<span><b>${t("tr1_h")}</b><small>${t("tr1_p",{free:eur(C.freeDeliveryFrom)})}</small></span></div>
    <div>${I.card}<span><b>${t("tr2_h")}</b><small>${t("tr2_p")}</small></span></div>
    <div>${I.pin}<span><b>${t("tr3_h")}</b><small>${t("tr3_p")}</small></span></div>
    <div>${I.back}<span><b>${t("tr4_h")}</b><small>${t("tr4_p")}</small></span></div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">${t("cats_eyebrow")}</div><h2 class="h-sec">${t("cats_h")}</h2></div></div>
    <div class="cats">${CATS.map(c=>`<a class="cat" href="#${c.id}"><img src="${img(c.img)}" alt="" loading="lazy"><span>${L(c)}<small>${P.filter(p=>p.cat===c.id).length} ${t("items")}</small></span></a>`).join("")}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">${t("best_eyebrow")}</div><h2 class="h-sec">${t("best_h")}</h2></div><a href="#tout">${t("see_all")}</a></div>
    ${grid(stars)}
  </div></section>

  <section class="sec band"><div class="wrap">
    <div class="eyebrow" style="margin-bottom:24px">${t("why_eyebrow")}</div>
    <div class="why">
      <div>${I.star}<h3>${t("why1_h")}</h3><p>${t("why1_p")}</p></div>
      <div>${I.tag}<h3>${t("why2_h")}</h3><p>${t("why2_p")}</p></div>
      <div>${I.truck}<h3>${t("why3_h")}</h3><p>${t("why3_p")}</p></div>
      <div>${I.back}<h3>${t("why4_h")}</h3><p>${t("why4_p")}</p></div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">${t("small_eyebrow")}</div><h2 class="h-sec">${t("small_h")}</h2></div><a href="#affaires">${t("see_all")}</a></div>
    ${grid(small.slice(0,4))}
  </div></section>

  <section class="sec story"><div class="wrap">
    <div class="story-img"><img src="${img((S.categories.find(c=>c.id==="bain")||{}).img||S.hero.image1)}" alt="" loading="lazy"></div>
    <div class="story-txt"><div class="eyebrow">${t("story_eyebrow")}</div><h2 class="h-sec" style="margin:10px 0 16px">${t("story_h")}</h2><p class="lede">${t("story_p")}</p>
      <div class="hero-ctas" style="margin-top:22px"><a class="btn" href="#marche">${t("story_cta")}</a><a class="btn ghost" href="#a-propos">${t("about")}</a></div></div>
  </div></section>

  ${recent.filter(id=>byId(id)).length?`<section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Dar Lin</div><h2 class="h-sec">${t("recent")}</h2></div></div>${grid(recent.map(byId).filter(Boolean).slice(0,4))}</div></section>`:""}

  <section class="sec" style="padding-top:0"><div class="wrap">${marketBlock()}</div></section>

  <section class="sec" style="padding-top:0" id="avis"><div class="wrap">
    ${REV.length ? `<div class="sec-head"><div><div class="eyebrow">${t("rv_h")}</div><h2 class="h-sec">${revSummary(REV)}</h2></div><button type="button" class="btn ghost" data-rvform="">${t("rv_write")}</button></div>
      <div class="rgrid">${REV.slice(0,6).map(revCard).join("")}</div>` : `<div class="rev">
      <div class="stars" aria-hidden="true">${I.star.repeat(5)}</div>
      <h2 class="h-sec" style="font-size:clamp(1.7rem,3.2vw,2.4rem)">${t("rev_h")}</h2><p class="lede">${t("rev_p")}</p>
      <button type="button" class="btn" data-rvform="">${t("rev_btn")}</button>
    </div>`}
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="join">
      <div><h2 class="h-sec" style="font-size:clamp(1.8rem,3.4vw,2.6rem); color:var(--accent)">${t("join_h")}</h2><p class="lede">${t("join_p")}</p></div>
      <div><a class="btn wa block" href="${waURL(lang==="ar"?"جديد":lang==="en"?"New arrivals":"Nouveautés")}" target="_blank" rel="noopener">${I.wa} ${t("join_btn")}</a><p class="note" style="text-align:center; margin:10px 0 0">WhatsApp · <span dir="ltr" style="user-select:all">${C.phoneDisplay}</span></p></div>
    </div>
  </div></section>`;
}
function marketBlock(){
  return `<div class="market">
    <div><div class="eyebrow">${t("mk_eyebrow")}</div><h2 class="h-sec" style="margin:10px 0 14px">${t("mk_h")}</h2><p class="lede">${t("mk_p")}</p>
      <ul class="perks">${[t("mk_list1"),t("mk_list2"),t("mk_list3")].map(x=>`<li>${I.check}<span>${x}</span></li>`).join("")}</ul></div>
    <div class="market-card">
      <div class="day">${t("mk_day")}</div>
      <h3 style="margin-top:6px">${t("mk_h")}</h3>
      <p>Amiens Nord · Le Colvert<br>80080 Amiens</p>
      <a class="btn" style="background:#F4ECE1; color:#6B4226; border-color:#F4ECE1; margin-top:8px" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Marché Le Colvert, Amiens Nord")}" target="_blank" rel="noopener">${t("mk_map")}</a>
    </div></div>`;
}
function listing(id){
  let title, desc = "", list;
  if(id==="affaires"){ title = t("nav_affaires"); desc = t("affaires_p"); list = P.filter(p=>p.price<=5); }
  else if(id==="tout"){ title = t("all_products"); list = P.slice(); }
  else { const c = CATS.find(c=>c.id===id); title = L(c); list = P.filter(p=>p.cat===id); }
  const sort = store.get("dl_sort", "pop");
  if(sort==="up") list.sort((a,b)=>a.price-b.price);
  if(sort==="down") list.sort((a,b)=>b.price-a.price);
  if(sort==="pop") list.sort((a,b)=>(b.star?1:0)-(a.star?1:0));
  return `<div class="wrap">
    <div class="page-head"><div class="eyebrow">Dar Lin</div><h1>${esc(title)}</h1>${desc?`<p class="lede">${desc}</p>`:""}</div>
    <div class="toolbar">
      <div class="chips"><a class="chip" href="#tout" ${id==="tout"?'aria-current="page"':""}>${t("all")}</a>${CATS.map(c=>`<a class="chip" href="#${c.id}" ${id===c.id?'aria-current="page"':""}>${L(c)}</a>`).join("")}<a class="chip" href="#affaires" ${id==="affaires"?'aria-current="page"':""}>${t("nav_affaires")}</a></div>
      <label><span class="sr">${t("sort")}</span><select id="sortSel">
        <option value="pop" ${sort==="pop"?"selected":""}>${t("sort_pop")}</option>
        <option value="up" ${sort==="up"?"selected":""}>${t("sort_up")}</option>
        <option value="down" ${sort==="down"?"selected":""}>${t("sort_down")}</option></select></label>
    </div>
    ${grid(list)}
  </div>`;
}
function product(id){
  const p = byId(id); if(!p) return null;
  const vi = 0, v = p.variants[vi];
  const imgs = [...new Set([...p.variants.map(v=>v.img), ...(p.extraImgs||[])])];
  const cat = CATS.find(c=>c.id===p.cat);
  const similar = P.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,4);
  return `<div class="wrap">
    <div class="crumbs"><a href="#accueil">Dar Lin</a> / <a href="#${cat.id}">${L(cat)}</a> / ${esc(L(p).name)}</div>
    <div class="pp" data-id="${p.id}">
      <div>
        <div class="gallery-main"><button type="button" id="zoomBtn" class="zoom" aria-label="${t("zoom")}"><img id="mainImg" src="${img(v.img)}" alt="${esc(L(p).name)} – ${esc(L(v))}"></button></div>
        ${imgs.length>1?`<div class="thumbs">${imgs.map((n,i)=>`<button type="button" data-img="${n}" aria-pressed="${i===0}" aria-label="Photo ${i+1}"><img src="${img(n)}" alt="" loading="lazy"></button>`).join("")}</div>`:""}
      </div>
      <div>
        ${p.brand?`<div class="brand">${esc(p.brand)}</div>`:""}
        <h1 style="margin:6px 0 10px">${esc(L(p).name)}</h1>
        ${revFor(p.id).length?`<a class="rlink" href="#rv-${p.id}" onclick="event.preventDefault();document.getElementById('rvsec').scrollIntoView({behavior:'smooth'})">${starsHTML(avg(revFor(p.id)))} ${t("rv_count",{n:revFor(p.id).length})}</a>`:""}
        <div><span class="big-price">${eur(pc(p))}</span>${E.promosFor(p, PROMOS).map(pr=>`<span class="pack">${promoLabel(pr)}</span>`).join("")}</div>${p.stock!=null && p.stock<=3 ? `<p class="stock">${p.stock>0?t("low",{n:p.stock}):t("soldout")}</p>`:""}
        <p style="margin:16px 0 0">${esc(L(p).desc)}</p>
        <div class="opt-label">${t("colour")} : <b id="vName">${esc(L(v))}</b></div>
        <div class="swatches">${p.variants.map((v,i)=>`<button type="button" class="sw" data-v="${i}" aria-pressed="${i===0}" aria-label="${esc(L(v))}" title="${esc(L(v))}" style="background:${v.hex}"></button>`).join("")}</div>
        <div class="opt-label">${t("qty")}</div>
        <div class="qty"><button type="button" id="qm" aria-label="-">−</button><output id="qv">1</output><button type="button" id="qp" aria-label="+">+</button></div>
        <div class="buy">
          <button class="btn block" type="button" id="addBtn">${I.bag.replace('<svg','<svg style="fill:none;stroke:currentColor;stroke-width:1.6"')} ${t("add")}</button>
          <a class="btn wa block" id="waBtn" target="_blank" rel="noopener" href="#">${I.wa} ${t("wa_order")}</a>
        </div>
        <p class="eta">${I.truck}<span>${t("eta",{d:esc(etaDate())})}</span></p>
        <ul class="perks">
          <li>${I.pin}<span>${t("perk1")}</span></li>
          <li>${I.truck}<span>${t("perk2",{fee:eur(C.deliveryFee), free:eur(C.freeDeliveryFrom)})}</span></li>
          <li>${I.back}<span>${t("perk3")}</span></li>
          <li>${I.check}<span>${t("perk4")}</span></li>
        </ul>
        <table class="specs"><caption class="sr">${t("details")}</caption><tbody>
          ${p.brand?`<tr><th scope="row">${t("brand")}</th><td>${esc(p.brand)}</td></tr>`:""}
          ${(p.specs||[]).map(x=>`<tr><th scope="row">${esc(specLabel(x.label))}</th><td dir="ltr">${esc(x.value)}</td></tr>`).join("")}
        </tbody></table>
        <div class="acc">
          <details><summary>${t("care_h")}</summary><ul>${(CARE[lang][p.cat]||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>
          ${p.cat==="chambre"?`<details><summary>${t("size_h")}</summary><table class="specs">${SIZES[lang]}</table></details>`:""}
          <details><summary>${t("pay_h")}</summary><p>${t("pay_list")}</p><p class="note">${t("pay_after")}</p></details>
        </div>
        <p class="note" style="margin-top:14px">${t("photo_note")}</p>
      </div>
    </div>
    <section class="sec" id="rvsec" style="padding-top:32px"><div class="sec-head"><div><div class="eyebrow">${t("rv_h")}</div><h2 class="h-sec">${revFor(p.id).length?revSummary(revFor(p.id)):t("rv_none")}</h2></div><button type="button" class="btn ghost" data-rvform="${p.id}">${t("rv_write")}</button></div>
      ${revFor(p.id).length?`<div class="rgrid">${revFor(p.id).map(revCard).join("")}</div>`:""}</section>
    <div class="sticky-buy" id="stickyBuy" aria-hidden="true"><div><b>${esc(L(p).name)}</b><span>${eur(pc(p))}</span></div><button class="btn" type="button" id="stickyAdd">${t("add")}</button></div>
    ${similar.length?`<section class="sec" style="padding-top:24px"><div class="sec-head"><h2 class="h-sec">${t("also")}</h2></div>${grid(similar)}</section>`:""}
  </div>`;
}
const v0img = p => (p.variants[0]||{}).img;
function bindProduct(){
  const root = $(".pp"); if(!root) return;
  const p = byId(root.dataset.id); let vi = 0, q = 1;
  const upd = () => {
    const v = p.variants[vi];
    $("#vName").textContent = L(v);
    $("#qv").textContent = q;
    const msg = `${t("order_hello")}\n• ${p.fr.name} – ${v.fr} × ${q} (${eur(pc(p)*q)})\n\nhttps://darlinmaison.fr/#p-${p.id}`;
    $("#waBtn").href = waURL(msg);
  };
  const setImg = n => { $("#mainImg").src = img(n); root.querySelectorAll(".thumbs button").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.img===n))); };
  root.querySelectorAll(".sw").forEach(b => b.onclick = () => { vi = +b.dataset.v; root.querySelectorAll(".sw").forEach(x=>x.setAttribute("aria-pressed", String(x===b))); setImg(p.variants[vi].img); upd(); });
  root.querySelectorAll(".thumbs button").forEach(b => b.onclick = () => setImg(b.dataset.img));
  $("#qm").onclick = () => { if(q>1){ q--; upd(); } };
  $("#qp").onclick = () => { if(q<20){ q++; upd(); } };
  $("#addBtn").onclick = () => addToCart(p.id, vi, q);
  $("#stickyAdd").onclick = () => addToCart(p.id, vi, q);
  const sb = $("#stickyBuy"), ab = $("#addBtn");
  if("IntersectionObserver" in window){ const io = new IntersectionObserver(([e]) => sb.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0)); io.observe(ab); }
  $("#zoomBtn").onclick = () => {
    const r = $("#drawerRoot");
    r.innerHTML = `<div class="lightbox" id="lb" role="dialog" aria-modal="true"><button class="icon-btn" type="button" id="lbClose" aria-label="${t("close")}">${I.close}</button><img src="${$("#mainImg").src}" alt=""></div>`;
    const close = () => { r.innerHTML = ""; }; $("#lb").onclick = close; document.addEventListener("keydown", function k(e){ if(e.key==="Escape"){ close(); document.removeEventListener("keydown", k); } });
  };
  pushRecent(p.id); productLD(p);
  setMeta(`${p.fr.name} – ${p.fr.short}. ${p.fr.desc} ${eur(pc(p))} chez Dar Lin, Amiens.`, "https://darlinmaison.fr/" + img(v0img(p)).replace(/^img\//,""));
  upd();
}

/* ---------- tiroir panier ---------- */
function openDrawer(){
  const r = $("#drawerRoot");
  r.innerHTML = `<div class="drawer-bg" id="dbg"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${t("cart")}">
    <div class="drawer-h"><h2>${t("cart")}</h2><button class="icon-btn" id="dclose" type="button" aria-label="Fermer">${I.close}</button></div>
    <div class="drawer-b" id="dbody"></div><div class="drawer-f" id="dfoot"></div></aside>`;
  $("#dbg").onclick = closeDrawer; $("#dclose").onclick = closeDrawer;
  document.addEventListener("keydown", escClose);
  drawDrawer(); $("#dclose").focus();
}
function escClose(e){ if(e.key==="Escape") closeDrawer(); }
function closeDrawer(){ $("#drawerRoot").innerHTML = ""; document.removeEventListener("keydown", escClose); }
function cartLines(compact){
  return cart.map((l,i)=>{ const p = byId(l.id); if(!p) return ""; const v = p.variants[l.v] || p.variants[0];
    return `<div class="line"><img src="${img(v.img)}" alt=""><div><h4>${esc(L(p).name)}</h4><div class="v">${esc(L(v))}</div>
      <div class="qty"><button type="button" data-dec="${i}" aria-label="-">−</button><output>${l.q}</output><button type="button" data-inc="${i}" aria-label="+">+</button></div>
      <div><button class="rm" type="button" data-rm="${i}">${t("remove")}</button></div></div><div class="price">${eur(lineTotal(l))}</div></div>`; }).join("");
}
function bindLines(root, redraw){
  root.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{ cart[+b.dataset.inc].q++; saveCart(); redraw(); });
  root.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{ const l = cart[+b.dataset.dec]; l.q--; if(l.q<1) cart.splice(+b.dataset.dec,1); saveCart(); redraw(); });
  root.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{ cart.splice(+b.dataset.rm,1); saveCart(); redraw(); });
}
function drawDrawer(){
  const b = $("#dbody"), f = $("#dfoot"); if(!b) return;
  if(!cart.length){ b.innerHTML = `<div class="empty"><p>${t("cart_empty")}</p><a class="btn ghost" href="#tout" id="dgo">${t("continue")}</a></div>`; f.innerHTML = ""; $("#dgo").onclick = closeDrawer; return; }
  const r = calc();
  const left = C.freeDeliveryFrom - r.net, pct = Math.max(0, Math.min(100, Math.round(r.net / C.freeDeliveryFrom * 100)));
  const ship = `<div class="shipbar"><p>${left>0 ? t("ship_left",{m:eur(left)}) : t("ship_ok")}</p><div class="bar"><i style="width:${pct}%"></i></div></div>`;
  const inCart = new Set(cart.map(l=>l.id));
  const ups = P.filter(p=>p.price<=5 && !inCart.has(p.id) && p.stock!==0).slice(0,3);
  b.innerHTML = ship + cartLines() + (ups.length?`<div class="upsell"><h3>${t("upsell")}</h3>${ups.map(p=>`<div class="up"><img src="${img(v0img(p))}" alt=""><div><b>${esc(L(p).name)}</b><span>${eur(pc(p))}</span></div><button type="button" class="btn ghost" data-up="${p.id}">${t("add_s")}</button></div>`).join("")}</div>`:"");
  bindLines(b, drawDrawer);
  b.querySelectorAll("[data-up]").forEach(x => x.onclick = () => { const ex = cart.find(l=>l.id===x.dataset.up && l.v===0); if(ex) ex.q++; else cart.push({id:x.dataset.up, v:0, q:1}); saveCart(); drawDrawer(); });
  f.innerHTML = `${sumRows(r, false)}<div class="drawer-pay">${PAYICONS}</div>
    <a class="btn block" href="#commande" id="dco">${t("checkout")}</a>
    <button class="btn ghost block" type="button" id="dcont">${t("continue")}</button>`;
  $("#dco").onclick = closeDrawer; $("#dcont").onclick = closeDrawer;
}

/* ---------- commande ---------- */
let co = store.get("dl_co", {mode:"market", pay:"card", name:"", phone:"", addr:"", note:""});
function checkout(){
  if(!cart.length) return `<div class="wrap"><div class="page-head"><h1>${t("co_h")}</h1></div><div class="empty"><p>${t("cart_empty")}</p><a class="btn" href="#tout">${t("continue")}</a></div></div>`;
  return `<div class="wrap"><div class="page-head"><h1>${t("co_h")}</h1></div>
  <form class="co" id="coForm" novalidate>
    <div>
      <div class="panel"><h2 style="font-size:1.6rem; margin-bottom:14px">${t("co_mode")}</h2>
        <label class="choice"><input type="radio" name="mode" value="market" ${co.mode==="market"?"checked":""}><div><b>${t("co_market")}</b><span>${t("co_market_s")}</span></div></label>
        <label class="choice"><input type="radio" name="mode" value="home" ${co.mode==="home"?"checked":""}><div><b>${t("co_home")}</b><span>${t("co_home_s",{fee:eur(C.deliveryFee), free:eur(C.freeDeliveryFrom)})}</span></div></label>
      </div>
      <div class="panel" style="margin-top:16px"><h2 style="font-size:1.6rem; margin-bottom:14px">${t("co_you")}</h2>
        <div class="field"><label for="f-name">${t("co_name")}</label><input id="f-name" name="name" required autocomplete="name" placeholder=" " value="${esc(co.name)}"></div>
        <div class="field"><label for="f-phone">${t("co_phone")}</label><input id="f-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel" pattern="[0-9 +().-]{9,}" placeholder=" " value="${esc(co.phone)}" dir="ltr"></div>
        <div class="field" id="addrField" ${co.mode==="home"?"":"hidden"}><label for="f-addr">${t("co_addr")}</label><textarea id="f-addr" name="addr" rows="2" autocomplete="street-address" placeholder=" ">${esc(co.addr)}</textarea></div>
        <div class="field"><label for="f-note">${t("co_note")}</label><textarea id="f-note" name="note" rows="2">${esc(co.note)}</textarea></div>
      </div>
      <div class="panel" style="margin-top:16px"><h2 style="font-size:1.6rem; margin-bottom:10px">${t("co_pay")}</h2>
        ${C.cardPayment ? `
        <label class="choice"><input type="radio" name="pay" value="card" ${co.pay!=="cash"?"checked":""}><div><b>${t("pay_card")}</b><span>${t("pay_card_s")}</span></div></label>
        <label class="choice"><input type="radio" name="pay" value="cash" ${co.pay==="cash"?"checked":""}><div><b>${t("pay_cash")}</b><span>${t("co_pay_txt")}</span></div></label>` :
        `<p style="margin:0 0 12px">${t("co_pay_txt")}</p><div class="pay-soon">${I.card.replace('<svg','<svg style="width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6"')}<span>${t("co_card_soon")}</span></div>`}
      </div>
    </div>
    <div><div class="panel" style="position:sticky; top:calc(env(safe-area-inset-top,0px) + 90px)">
      <div id="coLines"></div>
      <div class="code-row"><label class="sr" for="f-code">${t("code")}</label><input id="f-code" name="code" placeholder="${t("code")}" value="${esc(promoCode)}" autocomplete="off" autocapitalize="characters"><button class="btn ghost" type="button" id="codeBtn">${t("apply")}</button></div>
      <p class="note" id="codeMsg" hidden></p>
      <div id="coSum" style="display:flex; flex-direction:column; gap:8px; margin-top:14px"></div>
      <label style="display:flex; gap:10px; align-items:start; margin:16px 0; font-size:.88rem"><input type="checkbox" id="f-cgv" style="margin-top:5px; accent-color:var(--accent)"><span>${t("co_agree")} <a href="#cgv">${t("cgv")}</a></span></label>
      <p class="note" id="coErr" hidden style="color:var(--warn)">${t("co_fill")}</p>
      <button class="btn block" type="submit" id="payBtn" ${C.cardPayment && co.pay!=="cash" ? "" : "hidden"}>${I.card.replace('<svg','<svg style="fill:none;stroke:currentColor;stroke-width:1.6"')} ${t("pay_now")}</button>
      <button class="btn wa block" type="submit" id="waSend" ${C.cardPayment && co.pay!=="cash" ? "hidden" : ""}>${I.wa} ${t("co_send")}</button>
      <div class="drawer-pay" style="margin-top:12px">${PAYICONS}</div>
      <p class="note" style="margin:10px 0 0" id="coAfter">${C.cardPayment && co.pay!=="cash" ? t("pay_after") : t("co_after")}</p>
      <div id="sumupBox" hidden style="margin-top:14px"><div id="sumup-card"></div></div>
      <div id="coFallback" hidden style="margin-top:12px"><p class="note">${t("co_wa_hidden",{tel:C.phoneDisplay})}</p><textarea id="coMsg" rows="7" readonly style="width:100%; font:inherit; font-size:.85rem; padding:10px; border-radius:10px; border:1px solid var(--line); background:var(--bg); color:var(--ink)"></textarea><button class="btn ghost block" type="button" id="copyBtn" style="margin-top:8px">${t("copy")}</button></div>
    </div></div>
  </form></div>`;
}
function orderMessage(){
  const r = calc(co.mode);
  const lines = r.lines.map(l=>`• ${l.product.fr.name} – ${l.variant.fr||""} × ${l.q} = ${eur(l.total)}`).join("\n");
  return [T.fr.order_hello, "", lines, "",
    ...r.discounts.map(d=>`${d.label_fr} : −${eur(d.amount)}`),
    `Réception : ${co.mode==="home" ? "Livraison à domicile – " + (r.delivery ? eur(r.delivery) : "offerte") : "Retrait au marché (dimanche)"}`,
    `TOTAL : ${eur(r.total)}`, paidRef ? `PAYÉ PAR CARTE ✅ (réf. ${paidRef})` : "Paiement à la remise", "",
    `Nom : ${co.name}`, `Tél : ${co.phone}`, co.mode==="home" ? `Adresse : ${co.addr}` : null, co.note ? `Message : ${co.note}` : null,
    "", "J'accepte les CGV de Dar Lin."].filter(x=>x!==null).join("\n");
}
let paidRef = "";
function sendWhatsApp(){
  const msg = orderMessage();
  $("#coMsg").value = msg; $("#coFallback").hidden = false;
  const a = document.createElement("a"); a.href = waURL(msg); a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
}
/* Paiement par carte SumUp : le serveur recalcule le total (on ne lui fait pas confiance côté navigateur) */
async function startCardPayment(){
  const btn = $("#payBtn"); btn.disabled = true; btn.textContent = t("pay_loading");
  try{
    const res = await fetch("/api/checkout", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({cart, mode: co.mode, code: promoCode, customer: {name: co.name, phone: co.phone, addr: co.addr, note: co.note}})});
    const data = await res.json();
    if(!res.ok || !data.checkoutId) throw new Error(data.error || "checkout");
    await loadSumUp();
    $("#sumupBox").hidden = false; btn.hidden = true;
    window.SumUpCard.mount({ id: "sumup-card", checkoutId: data.checkoutId, locale: lang==="fr" ? "fr-FR" : "en-GB", currency: "EUR", amount: (data.total/100).toFixed(2),
      onResponse: async (type) => {
        if(type !== "success") return;
        const st = await fetch("/api/status?id=" + encodeURIComponent(data.checkoutId)).then(r => r.json()).catch(() => ({}));
        if(st.status === "PAID"){ paidRef = data.reference; orderDone(); }
      }});
  }catch(err){
    btn.disabled = false; btn.textContent = t("pay_now"); toast(t("pay_error"));
  }
}
function loadSumUp(){
  return new Promise((ok, ko) => { if(window.SumUpCard) return ok();
    const sc = document.createElement("script"); sc.src = "https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"; sc.onload = ok; sc.onerror = ko; document.head.appendChild(sc); });
}
function orderDone(){
  const msg = orderMessage();
  cart = []; saveCart(); promoCode = ""; store.set("dl_code", "");
  $("#view").innerHTML = `<div class="wrap"><div class="page-head"><div class="eyebrow">Dar Lin</div><h1>${t("thanks_h")}</h1><p class="lede">${t("thanks_p",{ref:esc(paidRef)})}</p></div>
    <a class="btn wa" href="${waURL(msg)}" target="_blank" rel="noopener">${I.wa} ${t("thanks_wa")}</a></div>`;
  paidRef = "";
}
function bindCheckout(){
  const f = $("#coForm"); if(!f) return;
  const redraw = () => {
    const r = calc(co.mode);
    $("#coLines").innerHTML = cartLines(); bindLines($("#coLines"), () => { if(!cart.length) route(); else redraw(); });
    $("#coSum").innerHTML = sumRows(r, true);
    const m = $("#codeMsg");
    if(r.code){ m.hidden = false; m.style.color = r.code.ok ? "var(--ok)" : "var(--warn)"; m.textContent = r.code.ok ? t("code_ok") : (r.code.reason==="min" ? t("code_min",{m:eur(r.code.min)}) : t("code_bad")); } else m.hidden = true;
  };
  f.addEventListener("input", e => {
    const el = e.target;
    if(el.name==="mode"){ co.mode = el.value; $("#addrField").hidden = co.mode!=="home"; redraw(); }
    else if(el.name==="pay"){ co.pay = el.value; const card = co.pay!=="cash"; $("#payBtn").hidden = !card; $("#waSend").hidden = card; $("#coAfter").textContent = card ? t("pay_after") : t("co_after"); }
    else if(el.name==="code"){ return; }
    else if(el.name in co){ co[el.name] = el.value; }
    store.set("dl_co", co);
  });
  f.addEventListener("submit", e => {
    e.preventDefault();
    const need = [$("#f-name"), $("#f-phone")]; if(co.mode==="home") need.push($("#f-addr"));
    let ok = true;
    need.forEach(el => { const bad = !el.value.trim() || (el.validity && !el.validity.valid); el.style.borderColor = bad ? "var(--warn)" : ""; if(bad) ok = false; });
    const cg = $("#f-cgv"); if(!cg.checked){ ok = false; cg.parentElement.style.color = "var(--warn)"; } else cg.parentElement.style.color = "";
    $("#coErr").hidden = ok; if(!ok) return;
    if(C.cardPayment && co.pay!=="cash") return startCardPayment();
    sendWhatsApp();
  });
  $("#codeBtn").onclick = () => { promoCode = $("#f-code").value.trim().toUpperCase(); store.set("dl_code", promoCode); redraw(); };
  $("#f-code").addEventListener("keydown", e => { if(e.key==="Enter"){ e.preventDefault(); $("#codeBtn").click(); } });
  $("#copyBtn").onclick = () => { const ta = $("#coMsg"); const done = () => toast(t("copied"));
    if(navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); }); else ta.select(); };
  redraw();
}

/* ---------- pages texte ---------- */
const ADDR = "21 rue d'Allonville, 80080 Amiens";
const TODO = s => `<span class="todo">${s}</span>`;
const PAGES = {
  "marche": () => `<div class="wrap"><div class="page-head"><div class="eyebrow">${t("nav_marche")}</div><h1>${t("mk_h")}</h1></div>${marketBlock()}
    <section class="sec"><h2 class="h-sec" style="font-size:2rem; margin-bottom:16px">${t("contact_us")}</h2>
    <ul class="perks"><li>${I.wa}<span>WhatsApp : <b dir="ltr" style="user-select:all">${C.phoneDisplay}</b></span></li><li>${I.check}<span>E-mail : <b style="user-select:all">${C.email}</b></span></li></ul></section></div>`,
  "a-propos": () => textPage(t("about"), `
    <p>Dar Lin, « la maison du linge », est une petite boutique d'Amiens tenue par Ahmad. On sélectionne du linge de maison de marques reconnues (Gérard Pasquier, Amphora, Hygie…) et on le vend à prix doux, sur le marché d'Amiens Nord et ici, en ligne.</p>
    <p>Notre idée est simple : tout le monde mérite des draps qui sentent bon le propre, des serviettes épaisses et une jolie nappe pour recevoir, sans y laisser son budget.</p>
    <p>Une question, une taille introuvable ? Écrivez-nous sur WhatsApp au <b dir="ltr">${C.phoneDisplay}</b> : on répond vite, en français ou en arabe.</p>`),
  "livraison": () => textPage(t("livraison"), `
    <h2>Retrait au marché, gratuit</h2><p>Commandez sur le site ou sur WhatsApp. Nous confirmons la disponibilité, puis votre commande vous attend au stand Dar Lin du marché d'Amiens Nord le dimanche matin. Vous réglez sur place, en espèces ou par carte.</p>
    <h2>Livraison à domicile sur Amiens</h2><p>Nous livrons nous-mêmes à Amiens et dans les communes voisines, sous 48 heures ouvrées après confirmation. Frais : ${eur(C.deliveryFee)}, offerts dès ${eur(C.freeDeliveryFrom)} d'achat. Nous convenons ensemble du créneau par WhatsApp.</p>
    <h2>Ailleurs en France</h2><p>Envoi par Colissimo ou Mondial Relay possible sur demande : écrivez-nous et nous vous indiquons le tarif selon le poids du colis avant toute commande.</p>`),
  "retours": () => textPage(t("retours"), `
    <p>Vous avez <b>14 jours</b> à compter de la réception pour changer d'avis, sans avoir à vous justifier (droit de rétractation, article L221-18 du Code de la consommation).</p>
    <h2>Comment faire</h2><ol><li>Écrivez-nous sur WhatsApp ou par e-mail en indiquant votre commande.</li><li>Rapportez l'article au stand du marché, ou renvoyez-le par la poste (frais de retour à votre charge).</li><li>Nous vous remboursons sous 14 jours, avec le même moyen de paiement, ou nous échangeons l'article si vous préférez.</li></ol>
    <h2>Conditions</h2><p>Pour des raisons d'hygiène, le linge doit être retourné neuf, non lavé, dans son emballage d'origine. Les articles abîmés ou utilisés ne peuvent pas être repris, sauf défaut de fabrication.</p>
    <h2>Article défectueux</h2><p>Un défaut ? Envoyez-nous une photo : nous remplaçons ou remboursons l'article au titre de la garantie légale de conformité.</p>`),
  "faq": () => `<div class="wrap prose"><div class="page-head" style="padding-inline:0"><h1>${t("faq")}</h1></div>
    ${faqList().map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`,
  "mentions-legales": () => textPage(t("mentions"), `
    <h2>Éditeur du site</h2><p>Dar Lin – Ahmad TAMIM, entrepreneur individuel (EI)<br>Siège : ${ADDR}<br>SIRET : 938 397 502 00023 – RCS Amiens 938 397 502<br>TVA : ${TODO("TVA non applicable, art. 293 B du CGI (à confirmer selon votre régime)")}<br>Téléphone : ${C.phoneDisplay} – E-mail : ${C.email}<br>Directeur de la publication : Ahmad TAMIM</p>
    <h2>Hébergement</h2><p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis – cloudflare.com</p>
    <h2>Propriété intellectuelle</h2><p>Les textes, photos, logo et la marque Dar Lin sont la propriété de l'éditeur. Toute reproduction sans autorisation est interdite. Les marques citées (Gérard Pasquier, Amphora, Hygie) appartiennent à leurs titulaires respectifs.</p>
    <h2>Données personnelles</h2><p>Voir la page <a href="#confidentialite">Confidentialité</a>.</p>`),
  "cgv": () => textPage(t("cgv"), `
    <p><i>Version du 20/11/2026.</i></p>
    <h2>1. Vendeur</h2><p>Dar Lin – Ahmad TAMIM, EI, ${ADDR}, SIRET 938 397 502 00023, RCS Amiens. Contact : ${C.phoneDisplay} (WhatsApp), ${C.email}.</p>
    <h2>2. Champ d'application</h2><p>Les présentes conditions s'appliquent à toute commande passée par un consommateur sur le site darlinmaison.fr ou par WhatsApp.</p>
    <h2>3. Produits</h2><p>Linge de maison neuf, présenté avec photos et caractéristiques principales. Les couleurs peuvent légèrement varier selon l'écran. Offre valable dans la limite des stocks disponibles.</p>
    <h2>4. Prix</h2><p>Prix en euros, toutes taxes comprises, hors frais de livraison éventuels indiqués avant la validation. Les offres par lot (ex. 3 torchons pour 5 €) s'appliquent automatiquement au panier.</p>
    <h2>5. Commande</h2><p>Le client sélectionne ses articles, choisit le mode de réception, renseigne ses coordonnées et accepte les présentes CGV, puis envoie sa commande via WhatsApp. Le contrat est conclu à la confirmation écrite de Dar Lin (disponibilité et total), envoyée par WhatsApp.</p>
    <h2>6. Paiement</h2><p>Paiement en ligne par carte bancaire, Apple Pay ou Google Pay, traité de façon sécurisée par SumUp (Dar Lin n'a jamais accès à vos données bancaires), ou paiement à la remise de la commande (retrait au marché ou livraison) en espèces ou carte bancaire.</p>
    <h2>7. Réception</h2><p>Retrait gratuit au marché d'Amiens Nord le dimanche matin, ou livraison à domicile à Amiens et environs sous 48 h ouvrées (${eur(C.deliveryFee)}, offerte dès ${eur(C.freeDeliveryFrom)}). Le risque de perte est transféré au client à la remise du colis.</p>
    <h2>8. Droit de rétractation</h2><p>Le client dispose de 14 jours à compter de la réception pour se rétracter sans motif (art. L221-18 du Code de la consommation), en informant Dar Lin par WhatsApp ou e-mail. Les articles sont retournés neufs, non lavés et dans leur emballage d'origine. Le remboursement intervient sous 14 jours par le même moyen de paiement.</p>
    <h2>9. Garanties</h2><p>Les produits bénéficient de la garantie légale de conformité (art. L217-3 et suivants du Code de la consommation) pendant 2 ans à compter de la délivrance, et de la garantie des vices cachés (art. 1641 et suivants du Code civil).</p>
    <h2>10. Médiation</h2><p>En cas de litige non résolu, le client peut recourir gratuitement au médiateur de la consommation : ${TODO("nom et site du médiateur à compléter après adhésion")}. Plateforme européenne de règlement des litiges : ec.europa.eu/consumers/odr.</p>
    <h2>11. Données personnelles</h2><p>Voir la page <a href="#confidentialite">Confidentialité</a>.</p>
    <h2>12. Droit applicable</h2><p>Droit français. Tribunaux compétents selon les règles légales.</p>`),
  "confidentialite": () => textPage(t("privacy"), `
    <h2>Qui est responsable ?</h2><p>Ahmad TAMIM (Dar Lin), ${ADDR}, ${C.email}.</p>
    <h2>Quelles données ?</h2><p>Uniquement ce que vous nous transmettez pour une commande : nom, téléphone, adresse de livraison et message éventuel. Ces informations nous parviennent via WhatsApp, au moment où vous envoyez votre commande.</p>
    <h2>Pourquoi ?</h2><p>Préparer, livrer et suivre votre commande, et répondre à vos questions (exécution du contrat). Nous ne vendons ni ne louons vos données.</p>
    <h2>Combien de temps ?</h2><p>3 ans après notre dernier échange, puis suppression. Les pièces comptables sont conservées 10 ans comme l'exige la loi.</p>
    <h2>Cookies</h2><p>Ce site n'utilise ni cookie publicitaire ni outil de suivi. Votre panier, votre langue et les champs de commande sont gardés uniquement dans votre navigateur (stockage local) pour que vous ne les perdiez pas ; ils ne nous sont pas envoyés.</p>
    <h2>Vos droits</h2><p>Accès, rectification, effacement, opposition, limitation et portabilité : écrivez à ${C.email}. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>`)
};
function textPage(title, html){
  return `<div class="wrap prose"><div class="page-head" style="padding-inline:0"><h1>${title}</h1></div>${lang!=="fr"&&t("legal_ar")?`<p class="ar-note">${t("legal_ar")}</p>`:""}<div dir="ltr" lang="fr" style="text-align:start">${html}</div></div>`;
}

function renderSearch(q){
  const n = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  const qq = n(q);
  const res = P.filter(p => n([p.fr.name,p.fr.short,p.ar.name,p.ar.short,(p.en||{}).name||"",(p.en||{}).short||"",p.brand||"",...p.variants.map(v=>v.fr+" "+v.ar+" "+(v.en||""))].join(" ")).includes(qq));
  $("#view").innerHTML = `<div class="wrap"><div class="page-head"><h1 style="font-size:2.2rem">${esc(t("results",{q}))}</h1></div>${res.length?grid(res):`<p class="empty">${t("no_results")}</p>`}</div>`;
}

/* ---------- toast ---------- */
let tt;
function toast(msg){ const r = $("#toastRoot"); r.innerHTML = `<div class="toast">${esc(msg)}</div>`; clearTimeout(tt); tt = setTimeout(()=>{ r.innerHTML=""; }, 2200); }

/* ---------- routeur ---------- */
const TITLES = {accueil:"Dar Lin – Linge de maison à Amiens"};
function route(){
  const h = (location.hash || "#accueil").slice(1) || "accueil";
  const v = $("#view"); let html = null;
  if(h==="accueil") html = home();
  else if(["chambre","bain","table","rideaux","affaires","tout"].includes(h)) html = listing(h);
  else if(h.startsWith("p-")) html = product(h.slice(2));
  else if(h==="commande") html = checkout();
  else if(PAGES[h]) html = PAGES[h]();
  if(html===null){ html = home(); }
  v.innerHTML = html; if($("#dbg")) closeDrawer();
  document.querySelectorAll("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav===h ? "page" : "false"));
  const m = $("#mnav"); if(m) m.hidden = true;
  const sb = $("#searchBar"); if(sb && !sb.hidden && !$("#q").value) sb.hidden = true;
  bindProduct(); bindCheckout();
  document.querySelectorAll("[data-rvform]").forEach(b => b.onclick = () => openReviewForm(b.dataset.rvform));
  const sel = $("#sortSel"); if(sel) sel.onchange = () => { store.set("dl_sort", sel.value); route(); };
  const p = h.startsWith("p-") && byId(h.slice(2));
  if(!p){ productLD(null); setMeta("Dar Lin, linge de maison à Amiens : parures de draps, draps housse, serviettes, nappes et rideaux de marque à petits prix. Livraison sur Amiens, retrait au marché, paiement sécurisé.", "https://darlinmaison.fr/amb-hero.jpg"); }
  document.title = p ? `${p.fr.name} – Dar Lin` : (TITLES[h] || "Dar Lin – Linge de maison à Amiens");
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", () => { const q = $("#q"); if(q) q.value = ""; route(); });
shell(); route();
};
