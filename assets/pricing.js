/* ══════════════════════════════════════════════════════════════════
   HerEstrogen — UNIFIED PRICING (single source of truth)
   THREE TIERS ONLY: Monthly (anchor) · Quarterly (25%*) · Annual (40%*)
   No 6-month tier. No bundles. Every product priced STANDALONE.

   Gating:
     • gate:'glp1'    → hidden unless GLP1_LAUNCH_ENABLED
     • gate:'peptide' → hidden unless PEPTIDE_LAUNCH_ENABLED
     • no gate        → always visible (HRT, skin)
   Both launch flags DEFAULT FALSE. Gated products do not render.

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

  var GLP1_LAUNCH_ENABLED = false;      /* keep FALSE in committed code */
  var PEPTIDE_LAUNCH_ENABLED = false;   /* keep FALSE in committed code */

  var QUIZ = 'https://quiz.herestrogen.com/herestrogen_hrt';

  /* plans: [monthlyAnchor, quarterlyPerMo, quarterlyTotal, annualPerMo, annualTotal, qPct, aPct] */
  function P(name, qparam, opts) { return Object.assign({ name: name, qparam: qparam }, opts); }
  var CATALOG = {
    /* ── HRT (compounded) — 25/40 ── */
    'estradiol-patch': P('Estradiol Patch', 'estradiol-patch', { compounded: true, m: 179, q: 134, qt: 402, a: 107, at: 1284, qp: 25, ap: 40 }),
    'estradiol-gel':   P('Estradiol Gel', 'estradiol-gel', { compounded: true, m: 191, q: 143, qt: 429, a: 115, at: 1380, qp: 25, ap: 40 }),
    'estradiol-pills': P('Estradiol Pills', 'estradiol-pills', { compounded: true, m: 107, q: 80, qt: 240, a: 64, at: 768, qp: 25, ap: 40 }),
    'estradiol-cream': P('Estradiol Vaginal Cream', 'estradiol-cream', { compounded: true, m: 143, q: 107, qt: 321, a: 86, at: 1032, qp: 25, ap: 40 }),
    'progesterone':    P('Progesterone', 'progesterone', { compounded: true, m: 95, q: 71, qt: 213, a: 57, at: 684, qp: 25, ap: 40 }),
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
    var day = '<div class="pl-save">Starting at $' + perDay(per) + '/day</div>';
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
    var fda = p.brand ? '<p class="pl-fda">FDA-approved medication, prescribed by a licensed clinician if appropriate.</p>' : '';
    var grid = '<div class="pl-grid">' + tier('m', p) + tier('q', p) + tier('a', p) + '</div>';
    var size = p.sizeUpsell ? '<p class="pl-size">Standard size shown. A larger value size is available on your plan for +' + money(p.sizeUpsell) + '/mo, selectable at checkout.</p>' : '';
    var guar = '<p class="pl-guar"><span class="pl-ck">✓</span> Clinical Match Guarantee. If a licensed clinician determines treatment is not right for you, you pay nothing.</p>';
    var foot = '<p class="pl-fine">' + esc(RENEWAL) + '</p>'
      + (p.brand ? '<p class="pl-fine pl-tm">' + tmLine(p) + '</p>' : '<p class="pl-fine pl-disc">' + esc(DISCLOSURE) + '</p>');
    return '<section class="pl-wrap" aria-label="' + esc(p.name) + ' pricing">' + fda + grid + size + guar + foot + '</section>';
  }

  /* Compact homepage card: annual /mo + monthly strikethrough + save% */
  function cardHTML(key) {
    var p = CATALOG[key]; if (!p || !live(p)) return '';
    return '<span class="p-was">' + money(p.m) + '/mo</span>'
      + '<span class="p-now">' + money(p.a) + '/mo</span>'
      + '<span class="p-day">Starting at $' + perDay(p.a) + '/day</span>';
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
      + '.pl-size{font-size:12.5px;color:var(--ink-2,#55504a);text-align:center;margin:14px auto 0;max-width:60ch;}'
      + '.pl-guar{display:flex;gap:8px;align-items:flex-start;justify-content:center;font-size:13px;font-weight:600;color:var(--ink-2,#55504a);margin:16px auto 0;max-width:60ch;text-align:left;}'
      + '.pl-ck{flex-shrink:0;width:18px;height:18px;border-radius:50%;background:var(--brand,#c21e63);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;margin-top:1px;}'
      + '.pl-fine{max-width:760px;margin:12px auto 0;text-align:center;font-size:11.5px;line-height:1.55;color:var(--muted,#6d6760);}'
      + '.pl-disc,.pl-tm{font-weight:700;color:var(--ink-2,#55504a);}'
      + '[data-flag-gated][hidden],[data-price-gated][hidden]{display:none !important;}'
      + '@media(max-width:560px){.pl-grid{grid-template-columns:1fr;}}';
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
