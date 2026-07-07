/* ══════════════════════════════════════════════════════════════════
   HerEstrogen — GLP-1 pricing config + LAUNCH GATE
   Compounded Semaglutide & Tirzepatide. See "GLP-1 PRICING SPEC".

   GLP1_LAUNCH_ENABLED gates ALL GLP-1 pricing/pages from public view.
   ────────────────────────────────────────────────────────────────
   DEFAULT: false.  Do NOT flip to true until ALL of:
     (a) LegitScript certified,
     (b) legal sign-off on compounded GLP-1 marketing,
     (c) compounded-medication consent gate live in checkout.
   ────────────────────────────────────────────────────────────────
   Compliance (compounded — strict): NEVER "FDA-approved", "generic",
   "same as Ozempic/Wegovy/Mounjaro/Zepbound", "same active ingredient",
   "safe", or "clinically proven". No before/after photos, no specific
   pounds/percent weight-loss promises, no cure/treat claims. Use
   "may support weight management" / clinician-led framing only.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── LAUNCH GATE — leave false until cleared (see header) ── */
  var GLP1_LAUNCH_ENABLED = false;

  /* ── Quiz route. TODO: confirm whether GLP-1 uses a separate quiz
       route; if so, swap QUIZ_BASE. Params carry product + plan intent. ── */
  var QUIZ_BASE = 'https://quiz.herestrogen.com/herestrogen_hrt';

  /* ── LOCKED GLP-1 PRICING (compounded). Strikethrough = monthly
       anchor ONLY; every plan's shown /mo is the real effective rate. ── */
  var GLP1 = {
    semaglutide: {
      name: 'Semaglutide',
      protocolName: 'The Metabolic Reset',
      compounded: true,
      anchor: 299,                       // monthly anchor = the ONLY crossed-out number
      plans: [
        { id: 'sema_monthly', months: 1,  pricePerMo: 299, total: 299,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'sema_3mo',     months: 3,  pricePerMo: 249, total: 747,  savePct: 17, hero: false, label: 'Save 17%' },
        { id: 'sema_6mo',     months: 6,  pricePerMo: 219, total: 1314, savePct: 27, hero: false, label: 'Save 27%' },
        { id: 'sema_12mo',    months: 12, pricePerMo: 179, total: 2148, savePct: 40, hero: true,  label: 'Save 40% · price-locked' }
      ]
    },
    tirzepatide: {
      name: 'Tirzepatide',
      protocolName: 'The Metabolic Reset Pro',
      compounded: true,
      anchor: 449,                       // monthly anchor = the ONLY crossed-out number
      plans: [
        { id: 'tirz_monthly', months: 1,  pricePerMo: 449, total: 449,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'tirz_3mo',     months: 3,  pricePerMo: 379, total: 1137, savePct: 16, hero: false, label: 'Save 16%' },
        { id: 'tirz_6mo',     months: 6,  pricePerMo: 339, total: 2034, savePct: 24, hero: false, label: 'Save 24%' },
        { id: 'tirz_12mo',    months: 12, pricePerMo: 299, total: 3588, savePct: 33, hero: true,  label: 'Save 33% · price-locked' }
      ]
    }
  };

  /* Required visible disclosure near any GLP-1 pricing. */
  var DISCLOSURE = 'Compounded medications are prepared by a licensed compounding pharmacy and are not FDA-approved.';

  /* "Everything included" (GLP-1 version) — [title, detail, valueTag]. */
  var INCLUDED = [
    ['Personalized GLP-1 protocol', 'Dosing matched and titrated by a licensed clinician as your body adjusts.', '$200+ value'],
    ['Free 2-day delivery', 'Shipped discreetly to your door.', '$40/yr value'],
    ['Your private care portal', 'Track your progress and message your care team in one place.', 'included'],
    ['Clinician-adjusted dosing', 'Your titration is reviewed and adjusted as needed.', '$150+ value'],
    ['Lifetime Price Lock', 'Your rate is locked for life — it never rises.', 'priceless']
  ];

  /* Unpriced guarantees. */
  var GUARANTEES = [
    ['Clinical Match Guarantee', "If a licensed clinician determines treatment isn't right for you, you pay nothing."],
    ['2-Day Shipping', 'Free and discreet, on every order.'],
    ['Lifetime Price Lock', 'Your rate never rises.']
  ];

  /* Auto-renewal + cancel-anytime (identical structure to HRT). */
  var RENEWAL_COPY = 'Plans renew automatically at the end of each term. Cancel anytime — no contracts, no cancellation fees. Your plan is prepaid for the term you choose and runs through that paid period. To stop your next renewal, cancel at least 72 hours before your renewal date. Treatment subject to clinician approval.';

  /* Always expose the data + flag for reference (no rendering happens
     unless the gate is open). */
  window.GLP1_LAUNCH_ENABLED = GLP1_LAUNCH_ENABLED;
  window.HE_PRODUCTS = window.HE_PRODUCTS || {};
  window.HE_PRODUCTS.glp1 = GLP1;
  window.HE_GLP1 = { config: GLP1, disclosure: DISCLOSURE, included: INCLUDED, guarantees: GUARANTEES, renewal: RENEWAL_COPY, quizBase: QUIZ_BASE };

  /* ══ HARD GATE ══ Nothing below renders or reveals until launch. ══ */
  if (!GLP1_LAUNCH_ENABLED) return;

  /* ────────────────────────────────────────────────────────────────
     Everything past this point ONLY runs when the flag is flipped.
     ──────────────────────────────────────────────────────────────── */
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var heroPlan = function (p) { return p.plans.filter(function (x) { return x.hero; })[0] || p.plans[p.plans.length - 1]; };
  var lowestPerMo = function () {
    return Math.min.apply(null, Object.keys(GLP1).map(function (k) { return heroPlan(GLP1[k]).pricePerMo; }));
  };
  var ctaHref = function (prodKey, planId) {
    return QUIZ_BASE + '?product=' + (prodKey === 'tirzepatide' ? 'tirz' : 'sema') + (planId ? '&plan=' + encodeURIComponent(planId) : '');
  };

  function injectStyle() {
    if (document.getElementById('glp1-style')) return;
    var css = ''
      + '.g1-wrap{padding:clamp(28px,4vw,44px) 0;}'
      + '.g1-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:stretch;max-width:1120px;margin:0 auto;padding:0 24px;}'
      + '.g1-card{position:relative;display:flex;flex-direction:column;background:var(--card,#fff);border:1.5px solid var(--line,#efe4d8);border-radius:20px;padding:24px 20px 22px;}'
      + '.g1-card.hero{border-color:var(--brand,#c21e63);border-width:2px;box-shadow:0 26px 54px -24px rgba(194,30,99,.35);background:linear-gradient(180deg,var(--cream-2,#fff9f3),#fff 26%);}'
      + '.g1-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--brand,#c21e63);color:#fff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-radius:999px;padding:5px 14px;white-space:nowrap;}'
      + '.g1-name{font-size:17px;font-weight:800;color:var(--ink,#2a201c);}'
      + '.g1-tag{margin-top:4px;font-size:12.5px;font-weight:700;color:var(--brand,#c21e63);min-height:17px;}'
      + '.g1-price{display:flex;align-items:baseline;gap:7px;margin:16px 0 2px;flex-wrap:wrap;}'
      + '.g1-was{font-size:16px;font-weight:600;color:var(--muted,#736a62);text-decoration:line-through;text-decoration-thickness:2px;}'
      + '.g1-now{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1;color:var(--ink,#2a201c);}'
      + '.g1-card.hero .g1-now{color:var(--brand,#c21e63);}'
      + '.g1-per{font-size:14px;font-weight:600;color:var(--muted,#736a62);}'
      + '.g1-total{font-size:12.5px;color:var(--ink-2,#5c5049);font-weight:600;}'
      + '.g1-cta{width:100%;margin-top:16px;display:inline-flex;align-items:center;justify-content:center;background:#fff;color:var(--brand,#c21e63);border:1.5px solid var(--brand,#c21e63);border-radius:999px;font-weight:700;font-size:14.5px;padding:12px;cursor:pointer;text-decoration:none;}'
      + '.g1-card.hero .g1-cta{background:var(--brand,#c21e63);color:#fff;}'
      + '.g1-guar{margin:10px 2px 0;font-size:11.5px;line-height:1.4;color:var(--ink-2,#5c5049);}'
      + '.g1-fine,.g1-disclosure{max-width:820px;margin:18px auto 0;padding:0 24px;text-align:center;font-size:11.5px;line-height:1.6;color:var(--muted,#736a62);}'
      + '.g1-disclosure{font-weight:700;color:var(--ink-2,#5c5049);}'
      + '.g1-price-strip{display:flex;align-items:baseline;gap:10px;margin:0 0 6px;flex-wrap:wrap;}'
      + '.g1-strip-was{font-size:18px;font-weight:600;color:var(--muted,#736a62);text-decoration:line-through;text-decoration-thickness:2px;}'
      + '.g1-strip-now{font-size:30px;font-weight:800;color:var(--ink,#2a201c);letter-spacing:-.02em;line-height:1;}'
      + '.g1-strip-per{font-size:15px;font-weight:700;color:var(--brand,#c21e63);}'
      + '.g1-strip-disc{font-size:11px;line-height:1.45;color:var(--muted,#736a62);margin:0 0 14px;max-width:360px;}'
      + '@media(max-width:960px){.g1-grid{grid-template-columns:repeat(2,1fr);}}'
      + '@media(max-width:560px){.g1-grid{grid-template-columns:1fr;}}';
    var el = document.createElement('style');
    el.id = 'glp1-style';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function ladderHTML(prodKey) {
    var p = GLP1[prodKey];
    var cards = p.plans.map(function (pl) {
      var isMonthly = pl.months === 1;
      var priceInner = (isMonthly
        ? '<span class="g1-now">' + money(pl.pricePerMo) + '</span><span class="g1-per">/mo</span>'
        : '<span class="g1-was">' + money(p.anchor) + '</span><span class="g1-now">' + money(pl.pricePerMo) + '</span><span class="g1-per">/mo</span>');
      var total = isMonthly ? money(pl.total) + ' billed monthly' : money(pl.total) + ' billed once';
      return ''
        + '<div class="g1-card' + (pl.hero ? ' hero' : '') + '">'
        + (pl.hero ? '<span class="g1-badge">Best value</span>' : '')
        + '<div class="g1-name">' + (pl.months === 1 ? 'Monthly' : pl.months + '-month') + '</div>'
        + '<div class="g1-tag">' + esc(pl.label) + '</div>'
        + '<div class="g1-price">' + priceInner + '</div>'
        + '<div class="g1-total">' + total + '</div>'
        + '<a class="g1-cta" href="' + ctaHref(prodKey, pl.id) + '">Get started</a>'
        + '<p class="g1-guar">✓ If it&rsquo;s not right for you, you pay nothing.</p>'
        + '</div>';
    }).join('');
    return ''
      + '<section class="g1-wrap" aria-label="' + esc(p.name) + ' pricing">'
      + '<div class="g1-grid">' + cards + '</div>'
      + '<p class="g1-fine">' + esc(RENEWAL_COPY) + '</p>'
      + '<p class="g1-disclosure">' + esc(DISCLOSURE) + '</p>'
      + '</section>';
  }

  function stripHTML(prodKey) {
    var p = GLP1[prodKey], h = heroPlan(p);
    return ''
      + '<div class="g1-price-strip">'
      + '<span class="g1-strip-was">' + money(p.anchor) + '/mo</span>'
      + '<span class="g1-strip-now">' + money(h.pricePerMo) + '/mo</span>'
      + '<span class="g1-strip-per">on the ' + h.months + '-month plan</span>'
      + '</div>'
      + '<p class="g1-strip-disc">' + esc(DISCLOSURE) + '</p>';
  }

  function render() {
    injectStyle();
    /* Full ladder mounts: <div data-glp1-ladder="semaglutide"></div> */
    [].forEach.call(document.querySelectorAll('[data-glp1-ladder]'), function (mount) {
      var key = mount.getAttribute('data-glp1-ladder');
      if (GLP1[key]) { mount.innerHTML = ladderHTML(key); mount.hidden = false; }
    });
    /* Compact price strip above CTA: <div data-glp1-price="semaglutide"></div> */
    [].forEach.call(document.querySelectorAll('[data-glp1-price]'), function (mount) {
      var key = mount.getAttribute('data-glp1-price');
      if (GLP1[key]) { mount.innerHTML = stripHTML(key); mount.hidden = false; }
    });
    /* Hero tile "starting at": <span data-glp1-tile></span> */
    [].forEach.call(document.querySelectorAll('[data-glp1-tile]'), function (el) {
      el.innerHTML = 'Starting at <b>' + money(lowestPerMo()) + '/month</b>';
      el.hidden = false;
    });
    /* Generic reveal for any other gated GLP-1 element. */
    [].forEach.call(document.querySelectorAll('[data-glp1-gated]'), function (el) { el.hidden = false; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
