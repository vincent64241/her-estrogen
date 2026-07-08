/* ══════════════════════════════════════════════════════════════════
   HerEstrogen — GLP-1 pricing config + LAUNCH GATE
   TWO tiers, ONE gate:
     • COMPOUNDED (semaglutide, tirzepatide) — NOT FDA-approved.
     • BRAND-NAME (Ozempic®, Wegovy®, Zepbound®) — FDA-approved.

   GLP1_LAUNCH_ENABLED gates ALL GLP-1 pricing/pages from public view.
   ────────────────────────────────────────────────────────────────
   DEFAULT: false.  Do NOT flip to true until ALL of:
     (a) LegitScript certified,
     (b) legal sign-off on GLP-1 marketing (compounded + brand),
     (c) compounded-medication consent gate live in checkout.
   ────────────────────────────────────────────────────────────────
   COMPLIANCE:
   • COMPOUNDED sema/tirz: NEVER "FDA-approved", "generic", "same as
     Ozempic/Wegovy/Mounjaro/Zepbound", "same active ingredient",
     "safe", "clinically proven". Show the "not FDA-approved" disclosure.
   • BRAND-NAME: "FDA-approved" MAY be used — ONLY on these specific
     branded products, NEVER as a catalog umbrella and NEVER on
     compounded. Show ® + trademark/affiliation disclaimer +
     "subject to availability".
   • Both: no cure/treat claims, no before/after photos, no specific
     weight-loss promises, no "guaranteed results". Clinician-led.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── LAUNCH GATE ──
     Turned ON per operator direction. NOTE: on-page disclosures below are
     necessary but do NOT by themselves constitute LegitScript certification
     or legal sign-off — those remain separate prerequisites, along with the
     compounded-medication consent gate in checkout. ── */
  var GLP1_LAUNCH_ENABLED = true;

  /* ── Quiz route. TODO: confirm whether GLP-1 uses a separate quiz
       route; if so, swap QUIZ_BASE. Params carry product + plan intent. ── */
  var QUIZ_BASE = 'https://quiz.herestrogen.com/herestrogen_hrt';

  /* ── COMPOUNDED GLP-1 (NOT FDA-approved). Strikethrough = monthly
       anchor ONLY; every shown /mo is the real effective rate. ── */
  var GLP1 = {
    semaglutide: {
      name: 'Semaglutide', qparam: 'sema', protocolName: 'The Metabolic Reset',
      compounded: true, fdaApproved: false, anchor: 299,
      plans: [
        { id: 'sema_monthly', months: 1,  pricePerMo: 299, total: 299,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'sema_3mo',     months: 3,  pricePerMo: 249, total: 747,  savePct: 17, hero: false, label: 'Save 17%' },
        { id: 'sema_6mo',     months: 6,  pricePerMo: 219, total: 1314, savePct: 27, hero: false, label: 'Save 27%' },
        { id: 'sema_12mo',    months: 12, pricePerMo: 179, total: 2148, savePct: 40, hero: true,  label: 'Save 40% · price-locked' }
      ]
    },
    tirzepatide: {
      name: 'Tirzepatide', qparam: 'tirz', protocolName: 'The Metabolic Reset Pro',
      compounded: true, fdaApproved: false, anchor: 449,
      plans: [
        { id: 'tirz_monthly', months: 1,  pricePerMo: 449, total: 449,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'tirz_3mo',     months: 3,  pricePerMo: 379, total: 1137, savePct: 16, hero: false, label: 'Save 16%' },
        { id: 'tirz_6mo',     months: 6,  pricePerMo: 339, total: 2034, savePct: 24, hero: false, label: 'Save 24%' },
        { id: 'tirz_12mo',    months: 12, pricePerMo: 299, total: 3588, savePct: 33, hero: true,  label: 'Save 33% · price-locked' }
      ]
    }
  };

  /* ── BRAND-NAME GLP-1 (FDA-approved). Premium tier; thin margin;
       anchors high so compounded reads as the value choice. ── */
  var GLP1_BRAND = {
    ozempic: {
      name: 'Ozempic®', qparam: 'ozempic', fdaApproved: true, mfr: 'Novo Nordisk', anchor: 1499,
      plans: [
        { id: 'ozempic_monthly', months: 1,  pricePerMo: 1499, total: 1499,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'ozempic_3mo',     months: 3,  pricePerMo: 1424, total: 4272,  savePct: 5,  hero: false, label: 'Save 5%' },
        { id: 'ozempic_6mo',     months: 6,  pricePerMo: 1379, total: 8274,  savePct: 8,  hero: false, label: 'Save 8%' },
        { id: 'ozempic_12mo',    months: 12, pricePerMo: 1319, total: 15828, savePct: 12, hero: true,  label: 'Save 12% · price-locked' }
      ]
    },
    wegovy: {
      name: 'Wegovy®', qparam: 'wegovy', fdaApproved: true, mfr: 'Novo Nordisk', anchor: 1899,
      plans: [
        { id: 'wegovy_monthly', months: 1,  pricePerMo: 1899, total: 1899,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'wegovy_3mo',     months: 3,  pricePerMo: 1804, total: 5412,  savePct: 5,  hero: false, label: 'Save 5%' },
        { id: 'wegovy_6mo',     months: 6,  pricePerMo: 1747, total: 10482, savePct: 8,  hero: false, label: 'Save 8%' },
        { id: 'wegovy_12mo',    months: 12, pricePerMo: 1671, total: 20052, savePct: 12, hero: true,  label: 'Save 12% · price-locked' }
      ]
    },
    zepbound: {
      name: 'Zepbound®', qparam: 'zepbound', fdaApproved: true, mfr: 'Eli Lilly', anchor: 1599,
      plans: [
        { id: 'zepbound_monthly', months: 1,  pricePerMo: 1599, total: 1599,  savePct: 0,  hero: false, label: 'Most flexible' },
        { id: 'zepbound_3mo',     months: 3,  pricePerMo: 1519, total: 4557,  savePct: 5,  hero: false, label: 'Save 5%' },
        { id: 'zepbound_6mo',     months: 6,  pricePerMo: 1471, total: 8826,  savePct: 8,  hero: false, label: 'Save 8%' },
        { id: 'zepbound_12mo',    months: 12, pricePerMo: 1407, total: 16884, savePct: 12, hero: true,  label: 'Save 12% · price-locked' }
      ]
    }
  };

  /* Compounded-only disclosure (near compounded pricing). */
  var DISCLOSURE = 'Compounded medications are prepared by a licensed compounding pharmacy and are not FDA-approved.';
  /* Brand-name availability note. */
  var BRAND_AVAILABILITY = 'Brand-name GLP-1 medications may be subject to manufacturer availability; treatment is subject to clinician approval and supply.';

  /* Auto-renewal + cancel-anytime (identical structure to HRT). */
  var RENEWAL_COPY = 'Plans renew automatically at the end of each term. Cancel anytime — no contracts, no cancellation fees. Your plan is prepaid for the term you choose and runs through that paid period. To stop your next renewal, cancel at least 72 hours before your renewal date. Treatment subject to clinician approval.';

  /* "Everything included" — compounded vs brand. [title, detail, tag]. */
  var INCLUDED = {
    compounded: [
      ['Personalized GLP-1 protocol', 'Dosing matched and titrated by a licensed clinician as your body adjusts.', '$200+ value'],
      ['Free 2-day delivery', 'Shipped discreetly to your door.', '$40/yr value'],
      ['Your private care portal', 'Track your progress and message your care team in one place.', 'included'],
      ['Clinician-adjusted dosing', 'Your titration is reviewed and adjusted as needed.', '$150+ value'],
      ['Lifetime Price Lock', 'Your rate is locked for life — it never rises.', 'priceless']
    ],
    brand: [
      ['FDA-approved medication', 'The branded product, prescribed by a licensed clinician if appropriate.', "this tier's core"],
      ['Personalized dosing & titration', 'Managed by a licensed clinician.', '$200+ value'],
      ['Free 2-day delivery', 'Discreet, cold-chain handled.', '$40/yr value'],
      ['Your private care portal', 'Track your progress and message your care team.', 'included'],
      ['Lifetime Price Lock', 'Your rate is locked for life — it never rises.', 'priceless']
    ]
  };

  var GUARANTEES = [
    ['Clinical Match Guarantee', "If a licensed clinician determines treatment isn't right for you, you pay nothing."],
    ['2-Day Shipping', 'Free and discreet, on every order.'],
    ['Lifetime Price Lock', 'Your rate never rises.']
  ];

  /* Always expose data + flag for reference (no rendering unless gated open). */
  window.GLP1_LAUNCH_ENABLED = GLP1_LAUNCH_ENABLED;
  window.HE_PRODUCTS = window.HE_PRODUCTS || {};
  window.HE_PRODUCTS.glp1 = GLP1;
  window.HE_PRODUCTS.glp1_brand = GLP1_BRAND;
  window.HE_GLP1 = {
    compounded: GLP1, brand: GLP1_BRAND,
    disclosure: DISCLOSURE, brandAvailability: BRAND_AVAILABILITY,
    included: INCLUDED, guarantees: GUARANTEES, renewal: RENEWAL_COPY, quizBase: QUIZ_BASE
  };

  /* ══ HARD GATE ══ Nothing below renders or reveals until launch. ══ */
  if (!GLP1_LAUNCH_ENABLED) return;

  /* ────────────────────────────────────────────────────────────────
     Runs ONLY when the flag is flipped true.
     ──────────────────────────────────────────────────────────────── */
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var getProd = function (key) { return GLP1[key] || GLP1_BRAND[key] || null; };
  var isBrand = function (p) { return !!p.fdaApproved; };
  var heroPlan = function (p) { return p.plans.filter(function (x) { return x.hero; })[0] || p.plans[p.plans.length - 1]; };
  /* "Starting at" for the GLP-1 hero tile = cheapest COMPOUNDED hero (the value entry). */
  var lowestPerMo = function () {
    return Math.min.apply(null, Object.keys(GLP1).map(function (k) { return heroPlan(GLP1[k]).pricePerMo; }));
  };
  var perDay = function (mo) { return Math.round(mo / 30); };   /* "starting at $X/day" like HRT */
  var ctaHref = function (key, planId) {
    var p = getProd(key);
    return QUIZ_BASE + '?product=' + (p ? p.qparam : key) + (planId ? '&plan=' + encodeURIComponent(planId) : '');
  };
  /* FDA-approved language + trademark disclaimer appear ONLY for brand. */
  var tmDisclaimer = function (p) {
    return esc(p.name) + ' is a registered trademark of ' + esc(p.mfr) + '. HerEstrogen is not affiliated with, endorsed by, or sponsored by ' + esc(p.mfr) + '.';
  };

  function injectStyle() {
    if (document.getElementById('glp1-style')) return;
    var css = ''
      + '.g1-wrap{padding:clamp(28px,4vw,44px) 0;}'
      + '.g1-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:stretch;max-width:1120px;margin:0 auto;padding:0 24px;}'
      + '.g1-card{position:relative;display:flex;flex-direction:column;background:var(--card,#fff);border:1.5px solid var(--line,#efe4d8);border-radius:20px;padding:24px 20px 22px;}'
      + '.g1-card.hero{border-color:var(--brand,#c21e63);border-width:2px;box-shadow:0 26px 54px -24px rgba(194,30,99,.35);background:linear-gradient(180deg,var(--cream-2,#fff9f3),#fff 26%);}'
      + '.g1-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--brand,#c21e63);color:#fff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-radius:999px;padding:5px 14px;white-space:nowrap;}'
      + '.g1-fda{max-width:1120px;margin:0 auto 12px;padding:0 24px;font-size:12.5px;font-weight:700;color:var(--brand,#c21e63);text-align:center;}'
      + '.g1-name{font-size:17px;font-weight:800;color:var(--ink,#2a201c);}'
      + '.g1-tag{margin-top:4px;font-size:12.5px;font-weight:700;color:var(--brand,#c21e63);min-height:17px;}'
      + '.g1-price{display:flex;align-items:baseline;gap:7px;margin:16px 0 2px;flex-wrap:wrap;}'
      + '.g1-was{font-size:16px;font-weight:600;color:var(--muted,#736a62);text-decoration:line-through;text-decoration-thickness:2px;}'
      + '.g1-now{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1;color:var(--ink,#2a201c);}'
      + '.g1-card.hero .g1-now{color:var(--brand,#c21e63);}'
      + '.g1-per{font-size:14px;font-weight:600;color:var(--muted,#736a62);}'
      + '.g1-total{font-size:12.5px;color:var(--ink-2,#5c5049);font-weight:600;}'
      + '.g1-cta{width:100%;margin-top:16px;display:inline-flex;align-items:center;justify-content:center;background:#fff;color:var(--brand,#c21e63);border:1.5px solid var(--brand,#c21e63);border-radius:999px;font-weight:700;font-size:14.5px;padding:12px;cursor:pointer;text-decoration:none;}'
      + '.g1-card.hero .g1-cta{background:var(--brand,#c21e63);color:#fff;}'
      + '.g1-guar{margin:10px 2px 0;font-size:11.5px;line-height:1.4;color:var(--ink-2,#5c5049);}'
      + '.g1-fine,.g1-disclosure,.g1-tm{max-width:820px;margin:14px auto 0;padding:0 24px;text-align:center;font-size:11.5px;line-height:1.6;color:var(--muted,#736a62);}'
      + '.g1-disclosure,.g1-tm{font-weight:700;color:var(--ink-2,#5c5049);}'
      + '.g1-price-strip{display:flex;align-items:baseline;gap:10px;margin:0 0 6px;flex-wrap:wrap;}'
      + '.g1-strip-was{font-size:18px;font-weight:600;color:var(--muted,#736a62);text-decoration:line-through;text-decoration-thickness:2px;}'
      + '.g1-strip-now{font-size:30px;font-weight:800;color:var(--ink,#2a201c);letter-spacing:-.02em;line-height:1;}'
      + '.g1-strip-per{font-size:15px;font-weight:700;color:var(--brand,#c21e63);}'
      + '.g1-strip-disc{font-size:11px;line-height:1.45;color:var(--muted,#736a62);margin:0 0 14px;max-width:420px;}'
      + '@media(max-width:960px){.g1-grid{grid-template-columns:repeat(2,1fr);}}'
      + '@media(max-width:560px){.g1-grid{grid-template-columns:1fr;}}';
    var el = document.createElement('style');
    el.id = 'glp1-style';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function ladderHTML(key) {
    var p = getProd(key); if (!p) return '';
    var brand = isBrand(p);
    var cards = p.plans.map(function (pl) {
      var monthly = pl.months === 1;
      var priceInner = monthly
        ? '<span class="g1-now">' + money(pl.pricePerMo) + '</span><span class="g1-per">/mo</span>'
        : '<span class="g1-was">' + money(p.anchor) + '</span><span class="g1-now">' + money(pl.pricePerMo) + '</span><span class="g1-per">/mo</span>';
      var total = monthly ? money(pl.total) + ' billed monthly' : money(pl.total) + ' billed once';
      return ''
        + '<div class="g1-card' + (pl.hero ? ' hero' : '') + '">'
        + (pl.hero ? '<span class="g1-badge">Best value</span>' : '')
        + '<div class="g1-name">' + (monthly ? 'Monthly' : pl.months + '-month') + '</div>'
        + '<div class="g1-tag">' + esc(pl.label) + '</div>'
        + '<div class="g1-price">' + priceInner + '</div>'
        + '<div class="g1-total">' + total + '</div>'
        + '<a class="g1-cta" href="' + ctaHref(key, pl.id) + '">Get started</a>'
        + '<p class="g1-guar">✓ If it&rsquo;s not right for you, you pay nothing.</p>'
        + '</div>';
    }).join('');
    /* FDA-approved line ONLY for brand; compounded shows the not-FDA disclosure. */
    var fda = brand ? '<p class="g1-fda">FDA-approved medication — prescribed by a licensed clinician if appropriate.</p>' : '';
    var footer = '<p class="g1-fine">' + esc(RENEWAL_COPY) + '</p>'
      + (brand
          ? '<p class="g1-fine">' + esc(BRAND_AVAILABILITY) + '</p><p class="g1-tm">' + tmDisclaimer(p) + '</p>'
          : '<p class="g1-disclosure">' + esc(DISCLOSURE) + '</p>');
    return '<section class="g1-wrap" aria-label="' + esc(p.name) + ' pricing">' + fda + '<div class="g1-grid">' + cards + '</div>' + footer + '</section>';
  }

  function stripHTML(key) {
    var p = getProd(key); if (!p) return '';
    var h = heroPlan(p);
    var disc = isBrand(p)
      ? esc(BRAND_AVAILABILITY) + ' ' + tmDisclaimer(p)
      : esc(DISCLOSURE);
    return '<div class="g1-price-strip">'
      + '<span class="g1-strip-was">' + money(p.anchor) + '/mo</span>'
      + '<span class="g1-strip-now">' + money(h.pricePerMo) + '/mo</span>'
      + '<span class="g1-strip-per">Starting at $' + perDay(h.pricePerMo) + '/day</span>'
      + '</div><p class="g1-strip-disc">' + disc + '</p>';
  }

  function render() {
    injectStyle();
    [].forEach.call(document.querySelectorAll('[data-glp1-ladder]'), function (mount) {
      var key = mount.getAttribute('data-glp1-ladder');
      if (getProd(key)) { mount.innerHTML = ladderHTML(key); mount.hidden = false; }
    });
    [].forEach.call(document.querySelectorAll('[data-glp1-price]'), function (mount) {
      var key = mount.getAttribute('data-glp1-price');
      if (getProd(key)) { mount.innerHTML = stripHTML(key); mount.hidden = false; }
    });
    /* Compact card price (homepage lineup). Disclosure carried by the
       lineup's existing .lineup-fine (compounded + trademark copy already there). */
    [].forEach.call(document.querySelectorAll('[data-glp1-price-card]'), function (mount) {
      var key = mount.getAttribute('data-glp1-price-card'), p = getProd(key);
      if (p) {
        var h = heroPlan(p);
        mount.innerHTML = '<span class="p-was">' + money(p.anchor) + '/mo</span>'
          + '<span class="p-now">' + money(h.pricePerMo) + '/mo</span>'
          + '<span class="p-day">Starting at $' + perDay(h.pricePerMo) + '/day</span>';
        mount.hidden = false;
      }
    });
    [].forEach.call(document.querySelectorAll('[data-glp1-tile]'), function (el) {
      el.innerHTML = 'Starting at <b>$' + perDay(lowestPerMo()) + ' per day</b>';
      el.hidden = false;
    });
    [].forEach.call(document.querySelectorAll('[data-glp1-gated]'), function (el) { el.hidden = false; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
