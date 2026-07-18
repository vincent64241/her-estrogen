/* ══════════════════════════════════════════════════════════════════
   HerEstrogen — UNIFIED PRICING (single source of truth)
   THREE TIERS ONLY: Monthly (anchor) · Quarterly (25%*) · Annual (40%*)
   No 6-month tier. No bundles. Every product priced STANDALONE.

   Gating:
     • gate:'glp1'    → hidden unless GLP1_LAUNCH_ENABLED
     • gate:'peptide' → hidden unless PEPTIDE_LAUNCH_ENABLED
     • no gate        → always visible (HRT, skin)
   Both launch flags TRUE (permanent per operator 2026-07-13). Do NOT set false.

   COMPLIANCE:
     • Compounded (estradiol, compounded GLP-1, peptides, estriol,
       tretinoin): never "FDA-approved"/"safe"/"clinically proven";
       show compounded disclosure.
     • Brand GLP-1 (Ozempic®/Wegovy®/Zepbound®/Mounjaro®): FDA-approved
       allowed on THESE ONLY; show ® + trademark/non-affiliation +
       "subject to availability".
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GLP1_LAUNCH_ENABLED = true;      /* PERMANENT per operator 2026-07-13: GLP-1 stays visible. Do NOT set false. */
  var PEPTIDE_LAUNCH_ENABLED = true;   /* PERMANENT per operator 2026-07-13: peptides stay visible. Do NOT set false. */

  var QUIZ = 'https://quiz.herestrogen.com/herestrogen_hrt';

  /* plans: [monthlyAnchor, quarterlyPerMo, quarterlyTotal, annualPerMo, annualTotal, qPct, aPct] */
  function P(name, qparam, opts) { return Object.assign({ name: name, qparam: qparam }, opts); }
  var CATALOG = {
    /* ── HRT (compounded) — 25/40 ── */
    'estradiol-patch': P('Estradiol Patch', 'estradiol-patch', { compounded: true, m: 215, q: 161, qt: 483, a: 129, at: 1548, qp: 25, ap: 40 }),
    'estradiol-gel':   P('Estradiol Gel', 'estradiol-gel', { compounded: true, m: 229, q: 172, qt: 516, a: 137, at: 1644, qp: 25, ap: 40 }),
    'estradiol-pills': P('Estradiol Pills', 'estradiol-pills', { compounded: true, m: 128, q: 96, qt: 288, a: 77, at: 924, qp: 25, ap: 40 }),
    'estradiol-cream': P('Estradiol Vaginal Cream', 'estradiol-cream', { compounded: true, m: 172, q: 129, qt: 387, a: 103, at: 1236, qp: 25, ap: 40 }),
    'progesterone':    P('Progesterone', 'progesterone', { compounded: true, m: 114, q: 86, qt: 258, a: 68, at: 816, qp: 25, ap: 40 }),
    /* ── Compounded GLP-1 (gated) — 25/40 ── */
    'semaglutide': P('Semaglutide', 'sema', { compounded: true, gate: 'glp1', m: 539, q: 404, qt: 1212, a: 323, at: 3876, qp: 25, ap: 40 }),
    'tirzepatide': P('Tirzepatide', 'tirz', { compounded: true, gate: 'glp1', m: 755, q: 566, qt: 1698, a: 453, at: 5436, qp: 25, ap: 40 }),
    /* ── Peptides (gated) — 22/35 ── */
    'sermorelin': P('Sermorelin (Anti-Aging)', 'sermorelin', { compounded: true, gate: 'peptide', m: 239, q: 186, qt: 558, a: 155, at: 1860, qp: 22, ap: 35 }),
    'nad':        P('NAD+ (Longevity)', 'nad', { compounded: true, gate: 'peptide', m: 239, q: 186, qt: 558, a: 155, at: 1860, qp: 22, ap: 35 }),
    /* ── Skin (launch-ready) — 22/35 ── */
    'estriol':   P('Estriol (Glow)', 'estriol', { compounded: true, m: 143, q: 112, qt: 336, a: 93, at: 1116, qp: 22, ap: 35 }),
    'tretinoin': P('Tretinoin (Acne-Free)', 'tretinoin', { compounded: true, m: 155, q: 121, qt: 363, a: 101, at: 1212, qp: 22, ap: 35, sizeUpsell: 25 }),
    /* ── Brand-name GLP-1 (gated, FDA-approved, do NOT feature) — 8/15 ── */
    'ozempic':  P('Ozempic®', 'ozempic', { brand: true, mfr: 'Novo Nordisk', gate: 'glp1', m: 1499, q: 1379, qt: 4137, a: 1274, at: 15288, qp: 8, ap: 15 }),
    'wegovy':   P('Wegovy®', 'wegovy', { brand: true, mfr: 'Novo Nordisk', gate: 'glp1', m: 1899, q: 1747, qt: 5241, a: 1614, at: 19368, qp: 8, ap: 15 }),
    'zepbound': P('Zepbound®', 'zepbound', { brand: true, mfr: 'Eli Lilly', gate: 'glp1', m: 1599, q: 1471, qt: 4413, a: 1359, at: 16308, qp: 8, ap: 15 }),
    'mounjaro': P('Mounjaro®', 'mounjaro', { brand: true, mfr: 'Eli Lilly', gate: 'glp1', m: 1599, q: 1471, qt: 4413, a: 1359, at: 16308, qp: 8, ap: 15 })
  };

  window.HE_FLAGS = { glp1: GLP1_LAUNCH_ENABLED, peptide: PEPTIDE_LAUNCH_ENABLED };
  window.HE_CATALOG = CATALOG;

  function live(p) {
    if (!p) return false;
    if (p.gate === 'glp1' && !GLP1_LAUNCH_ENABLED) return false;
    if (p.gate === 'peptide' && !PEPTIDE_LAUNCH_ENABLED) return false;
    return true;
  }
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
  var perDay = function (mo) { return (mo / 30).toFixed(2); };  /* effective daily rate */
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var cta = function (p, plan) { return QUIZ + '?product=' + p.qparam + '&plan=' + plan; };

  var RENEWAL = 'Plans renew automatically at the end of each term. Your plan is prepaid and runs through the paid period. Cancel future renewals at least 72 hours before your renewal date. No contracts, no cancellation fees. Treatment is subject to clinician approval.';
  var DISCLOSURE = 'Compounded medications are prepared by a licensed U.S. 503A compounding pharmacy and are not approved by the FDA; they have not been reviewed for safety, effectiveness, or quality.';
  function tmLine(p) { return esc(p.name) + ' is a registered trademark of ' + esc(p.mfr) + '. HerEstrogen is not affiliated with, endorsed by, or sponsored by ' + esc(p.mfr) + '. Subject to manufacturer availability and clinician approval.'; }

  function tier(kind, p) {
    var monthly = kind === 'm';
    var plan = monthly ? 'monthly' : (kind === 'q' ? 'quarterly' : 'annual');
    var per = monthly ? p.m : (kind === 'q' ? p.q : p.a);
    var total = monthly ? p.m : (kind === 'q' ? p.qt : p.at);
    var hero = !monthly;
    var badge = kind === 'q' ? 'Most popular' : (kind === 'a' ? 'Best value · price-locked for life' : '');
    var name = monthly ? 'Monthly' : (kind === 'q' ? 'Quarterly' : 'Annual');
    var was = monthly ? '' : '<div class="pl-was">' + money(p.m) + '/mo</div>';
    var pct = kind === 'q' ? p.qp : p.ap;
    var day = '<div class="pl-save">' + (monthly ? 'Starting at $' + perDay(per) + '/day' : 'Save ' + pct + '% &middot; $' + perDay(per) + '/day') + '</div>';
    var billed = monthly ? (money(total) + ' billed monthly') : (money(total) + ' billed once');
    return '<div class="pl-tier' + (hero ? ' hero' : '') + '">'
      + (badge ? '<span class="pl-badge">' + badge + '</span>' : '')
      + '<div class="pl-plan">' + name + '</div>'
      + was
      + '<div class="pl-price"><b>' + money(per) + '</b><span>/mo</span></div>'
      + day
      + '<div class="pl-total">' + billed + '</div>'
      + '<a class="pl-cta" href="' + cta(p, plan) + '">Get started</a>'
      + '</div>';
  }

  function ladderHTML(key) {
    var p = CATALOG[key]; if (!p || !live(p)) return '';
    var start = '<div class="pl-start">'
      + '<p class="pl-start-mo"><span class="pdm-was">' + money(p.m) + '/mo</span> <b>' + money(p.a) + '/mo</b></p>'
      + '<p class="pl-start-lead"><span class="pd-was">$' + perDay(p.m) + '/day</span> starting at <b>$' + perDay(p.a) + '/day</b></p>'
      + '<a class="pl-start-cta" href="' + cta(p, 'annual') + '">Get started</a></div>';
    return '<section class="pl-wrap" aria-label="' + esc(p.name) + ' pricing">' + start + '</section>';
  }

  /* Compact homepage card: annual /mo + monthly strikethrough + save% */
  function cardHTML(key) {
    var p = CATALOG[key]; if (!p || !live(p)) return '';
    return '<span class="p-was">' + money(p.m) + '/mo</span>'
      + '<span class="p-now">' + money(p.a) + '/mo</span>'
      + '<span class="p-day"><span class="pd-was">$' + perDay(p.m) + '/day</span> starting at <b>$' + perDay(p.a) + '/day</b></span>';
  }

  /* ── Reusable MEMBERSHIP block: the six things every plan includes (no $ values) ── */
  function membershipHTML() {
    var items = [
      'Personalized treatment protocol',
      'Ongoing check-ins &amp; dose adjustments',
      'Unlimited &amp; real-person support',
      'Secure patient portal',
      'Access to the HerEstrogen Community',
      'Exclusive discounts &amp; deals'
    ];
    var lis = items.map(function (t) {
      return '<li><span class="mm-ck" aria-hidden="true">&#10003;</span><span>' + t + '</span></li>';
    }).join('');
    return '<div class="mm-in">'
      + '<p class="mm-eyebrow">Included with every plan</p>'
      + '<h2 class="mm-title">Your HerEstrogen Membership</h2>'
      + '<p class="mm-sub">Every plan includes the full HerEstrogen experience &mdash; no platform fee, no membership fee, no consultation fee.</p>'
      + '<ul class="mm-list">' + lis + '</ul></div>';
  }

  /* ── Reusable FREE GIFTS block: intro value-stack, slashed values (same on every plan) ── */
  function giftsHTML() {
    var gifts = [
      { ic: '&#129658;', was: '$200', lbl: 'Free First Online Clinician Consultation' },
      { ic: '&#128203;', was: '$99', lbl: 'Your Personalized Hormone Assessment' },
      { ic: '&#128666;', was: '$19.99', lbl: 'Free 2-Day Delivery' }
    ];
    var cards = gifts.map(function (g) {
      return '<div class="gg-card"><div class="gg-ic" aria-hidden="true">' + g.ic + '</div>'
        + '<p class="gg-val"><s>' + g.was + '</s> <b>FREE</b></p>'
        + '<p class="gg-lbl">' + g.lbl + '</p></div>';
    }).join('');
    var bonus = '<div class="gg-card gg-bonus"><div class="gg-ic" aria-hidden="true">&#128274;</div>'
      + '<p class="gg-val"><b>Locked for life</b></p>'
      + '<p class="gg-lbl">Lifetime Price Lock Guarantee</p></div>';
    return '<div class="gg-in">'
      + '<p class="gg-eyebrow">Your free gifts &mdash; included with your first order</p>'
      + '<h2 class="gg-title">Start today and get&hellip;</h2>'
      + '<div class="gg-grid">' + cards + bonus + '</div>'
      + '<p class="gg-total"><b>$318.99 in gifts</b> &mdash; included free when you start today.</p>'
      + '<p class="gg-assess">Your Personalized Hormone Assessment is a personalized summary based on your quiz responses &mdash; not a diagnosis or medical advice. A licensed clinician reviews your intake before any treatment.</p>'
      + '<p class="gg-fine"><b>Clinical Match Guarantee:</b> you are not charged until a licensed clinician confirms you are a fit. Cancel anytime &mdash; no contracts, no hidden fees. Plans renew automatically at the end of each term; cancel future renewals at least 72 hours before your renewal date.</p></div>';
  }

  function injectStyle() {
    if (document.getElementById('pl-style')) return;
    var css = ''
      + '.pl-wrap{margin:8px 0 0;}'
      + '.pl-fda{font-size:12.5px;font-weight:700;color:var(--brand,#c21e63);text-align:center;margin:0 0 12px;}'
      + '.pl-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:stretch;}'
      + '.pl-tier{position:relative;display:flex;flex-direction:column;background:#fff;border:1.5px solid var(--line,#e7e3dd);border-radius:16px;padding:22px 14px 18px;text-align:center;}'
      + '.pl-tier.hero{border-color:var(--brand,#c21e63);border-width:2px;box-shadow:0 22px 46px -26px rgba(194,30,99,.42);}'
      + '.pl-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--brand,#c21e63);color:#fff;font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;border-radius:999px;padding:4px 11px;white-space:nowrap;max-width:94%;overflow:hidden;text-overflow:ellipsis;}'
      + '.pl-plan{font-size:12.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-2,#55504a);margin-top:4px;}'
      + '.pl-was{font-size:14px;font-weight:600;color:var(--muted,#6d6760);text-decoration:line-through;text-decoration-thickness:2px;margin-top:8px;}'
      + '.pl-price{margin:4px 0 0;line-height:1;}.pl-price b{font-size:30px;font-weight:800;letter-spacing:-.02em;color:var(--ink,#1c1a17);}'
      + '.pl-tier.hero .pl-price b{color:var(--brand,#c21e63);}.pl-price span{font-size:14px;font-weight:600;color:var(--muted,#6d6760);}'
      + '.pl-save{font-size:12px;font-weight:800;color:var(--brand-ink,#a4184f);margin-top:4px;}'
      + '.pl-total{font-size:12px;color:var(--ink-2,#55504a);font-weight:600;margin-top:6px;}'
      + '.pl-cta{margin-top:14px;display:inline-flex;align-items:center;justify-content:center;background:#fff;color:var(--brand,#c21e63);border:1.5px solid var(--brand,#c21e63);border-radius:999px;font-weight:700;font-size:14px;padding:11px;text-decoration:none;}'
      + '.pl-tier.hero .pl-cta{background:var(--brand,#c21e63);color:#fff;}'
      + '.pl-start{text-align:center;padding:6px 0 2px;}'
      + '.pl-start-lead{font-size:15px;font-weight:700;letter-spacing:0;color:var(--ink-2,#55504a);line-height:1.3;}'
      + '.pl-start-lead b{color:var(--brand,#c21e63);}'
      + '.pl-start-sub{font-size:14px;color:var(--ink-2,#55504a);margin:10px auto 18px;max-width:46ch;}'
      + '.pl-start-cta{display:inline-flex;align-items:center;justify-content:center;width:100%;max-width:420px;margin:6px auto 0;padding:16px 24px;font-size:17px;font-weight:700;border-radius:999px;background:var(--brand,#c21e63);color:#fff;text-decoration:none;box-shadow:0 16px 34px -18px rgba(194,30,99,.5);}'
      + '.pl-start-cta:hover{background:var(--brand-ink,#a4184f);}'
      + '.pl-size{font-size:12.5px;color:var(--ink-2,#55504a);text-align:center;margin:14px auto 0;max-width:60ch;}'
      + '.pl-guar{display:flex;gap:8px;align-items:flex-start;justify-content:center;font-size:13px;font-weight:600;color:var(--ink-2,#55504a);margin:16px auto 0;max-width:60ch;text-align:left;}'
      + '.pl-ck{flex-shrink:0;width:18px;height:18px;border-radius:50%;background:var(--brand,#c21e63);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;margin-top:1px;}'
      + '.pl-fine{max-width:760px;margin:12px auto 0;text-align:center;font-size:11.5px;line-height:1.55;color:var(--muted,#6d6760);}'
      + '.pl-disc,.pl-tm{font-weight:700;color:var(--ink-2,#55504a);}'
      + '[data-flag-gated][hidden],[data-price-gated][hidden]{display:none !important;}'
      /* slashed per-day price */
      + '.pd-was{color:var(--muted,#6d6760);text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:var(--brand,#c21e63);font-weight:600;margin-right:6px;}'
      + '.pl-start-lead .pd-was{font-size:.72em;}'
      + '.pl-start-lead b{color:var(--brand,#c21e63);}'
      + '.pl-start-mo{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.02em;color:var(--ink,#1c1a17);line-height:1.05;margin:0 0 4px;}'
      + '.pl-start-mo .pdm-was{color:var(--muted,#6d6760);text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:var(--brand,#c21e63);font-weight:600;margin-right:6px;}'
      + '.pl-start-mo b{color:var(--brand,#c21e63);font-weight:800;}'
      /* MEMBERSHIP block */
      + '[data-membership]{display:block;background:linear-gradient(180deg,#fff,#fdeef4);}'
      + '.mm-in{max-width:720px;margin:0 auto;padding:clamp(40px,5vw,64px) 20px;}'
      + '.mm-eyebrow{text-align:center;text-transform:uppercase;letter-spacing:.14em;font-weight:800;font-size:12.5px;color:var(--brand-ink,#a4184f);margin:0 0 10px;}'
      + '.mm-title{text-align:center;font-family:\'DM Sans\',system-ui,sans-serif;font-weight:800;letter-spacing:-.02em;font-size:clamp(26px,4vw,40px);line-height:1.1;color:var(--ink,#1c1a17);margin:0 0 10px;}'
      + '.mm-sub{text-align:center;max-width:560px;margin:0 auto 26px;color:var(--ink-2,#55504a);font-size:15.5px;line-height:1.55;}'
      + '.mm-list{list-style:none;margin:0 auto;padding:0;max-width:560px;background:#fff;border:1px solid #f2d3e0;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px -30px rgba(164,24,79,.4);}'
      + '.mm-list li{display:flex;gap:14px;align-items:center;padding:16px 22px;border-bottom:1px solid #f6e5ee;font-size:16px;font-weight:600;color:var(--ink,#1c1a17);}'
      + '.mm-list li:last-child{border-bottom:0;}'
      + '.mm-ck{flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--brand,#c21e63);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;}'
      /* FREE GIFTS block */
      + '.gg-in{background:linear-gradient(180deg,#fff9f3,#ffe7ed);border:1px solid #f2d3e0;border-radius:20px;padding:clamp(20px,3vw,30px);margin:0 0 20px;}'
      + '.gg-eyebrow{text-transform:uppercase;letter-spacing:.1em;font-weight:800;font-size:11.5px;color:var(--brand-ink,#a4184f);margin:0 0 6px;text-align:center;}'
      + '.gg-title{font-family:\'DM Sans\',system-ui,sans-serif;font-weight:800;letter-spacing:-.02em;font-size:clamp(22px,3vw,30px);color:var(--ink,#1c1a17);text-align:center;margin:0 0 18px;}'
      + '.gg-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;}'
      + '.gg-card{background:#fff;border:1px solid #f2d3e0;border-radius:12px;padding:12px 6px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:5px;}'
      + '.gg-card.gg-bonus{background:#fff4f8;border-style:dashed;}'
      + '.gg-ic{font-size:22px;line-height:1;}'
      + '.gg-val{font-size:12px;font-weight:700;color:var(--ink,#1c1a17);line-height:1.25;}'
      + '.gg-val s{color:var(--muted,#6d6760);font-weight:600;margin-right:3px;text-decoration-thickness:2px;}'
      + '.gg-val b{color:var(--brand,#c21e63);font-weight:800;}'
      + '.gg-lbl{font-size:11px;font-weight:600;color:var(--ink-2,#55504a);line-height:1.3;overflow-wrap:break-word;}'
      + '.gg-total{text-align:center;font-size:15px;color:var(--ink,#1c1a17);margin:18px 0 0;}'
      + '.gg-total b{color:var(--brand,#c21e63);font-weight:800;}'
      + '.gg-assess{text-align:center;font-size:12px;color:var(--ink-2,#55504a);line-height:1.5;margin:12px auto 0;max-width:60ch;}'
      + '.gg-fine{text-align:center;font-size:11.5px;color:var(--muted,#6d6760);line-height:1.55;margin:10px auto 0;max-width:72ch;}'
      + '.gg-fine b{color:var(--ink-2,#55504a);}'
      + '@media(max-width:560px){.pl-grid{grid-template-columns:1fr;}}'
      + '@media(max-width:480px){.gg-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}';
    var el = document.createElement('style'); el.id = 'pl-style'; el.textContent = css;
    document.head.appendChild(el);
  }

  function render() {
    injectStyle();
    [].forEach.call(document.querySelectorAll('[data-price-ladder]'), function (m) {
      var h = ladderHTML(m.getAttribute('data-price-ladder'));
      if (h) { m.innerHTML = h; m.hidden = false; } else { m.hidden = true; }
    });
    [].forEach.call(document.querySelectorAll('[data-price-card]'), function (m) {
      var h = cardHTML(m.getAttribute('data-price-card'));
      if (h) { m.innerHTML = h; m.hidden = false; } else { m.hidden = true; }
    });
    /* Reusable MEMBERSHIP + FREE GIFTS blocks (static content, identical everywhere). */
    [].forEach.call(document.querySelectorAll('[data-membership]'), function (m) { m.innerHTML = membershipHTML(); });
    [].forEach.call(document.querySelectorAll('[data-gifts]'), function (m) { m.innerHTML = giftsHTML(); });
    /* Whole cards gated by product key → reveal only when that product is live. */
    [].forEach.call(document.querySelectorAll('[data-price-gated]'), function (el) {
      var p = CATALOG[el.getAttribute('data-price-gated')];
      el.hidden = !live(p);
    });
    /* Whole sections gated by flag name (glp1 | peptide) → hide when that flag is false. */
    [].forEach.call(document.querySelectorAll('[data-flag-gated]'), function (el) {
      var f = el.getAttribute('data-flag-gated');
      el.hidden = !((f === 'glp1' && GLP1_LAUNCH_ENABLED) || (f === 'peptide' && PEPTIDE_LAUNCH_ENABLED));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
