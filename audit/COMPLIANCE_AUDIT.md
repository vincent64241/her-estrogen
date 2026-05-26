# HerEstrogen Compliance Audit
_Generated 2026-05-25. Audit only — no source files were modified other than this report._
_Status: FINALIZED 2026-05-25. Phases 1, 2, 4 complete in this report. Phase 3 (git history scan) is blocked in the audit sandbox — required Phase 3 commands are documented below for Vincent to run manually. Phase 5 (rsync mirror) likewise documented as a manual step._

## Methodology & Scope

This audit was conducted by static review of the repository at `/Users/isanguyen/her-estrogen/`. Findings are organized by severity (CRITICAL / HIGH / MEDIUM / LOW), not by audit area. Each finding cites the file and (where applicable) the line range.

**Files reviewed (server / config / legal):**
- `/Users/isanguyen/her-estrogen/.gitignore`
- `/Users/isanguyen/her-estrogen/vercel.json`
- `/Users/isanguyen/her-estrogen/package.json`
- `/Users/isanguyen/her-estrogen/CLAUDE.md`
- `/Users/isanguyen/her-estrogen/.env.local` (presence/contents inspected; no secrets reproduced in this report)
- `/Users/isanguyen/her-estrogen/lib/klaviyo.js`
- `/Users/isanguyen/her-estrogen/lib/supabase.js`
- `/Users/isanguyen/her-estrogen/lib/database.js`
- `/Users/isanguyen/her-estrogen/api/quiz/submit.js`
- `/Users/isanguyen/her-estrogen/api/orders/placed.js`
- `/Users/isanguyen/her-estrogen/api/orders/cancelled.js`
- `/Users/isanguyen/her-estrogen/api/checkout.js`
- `/Users/isanguyen/her-estrogen/api/prescriptions/update.js`
- `/Users/isanguyen/her-estrogen/api/webhooks/stripe.js`
- `/Users/isanguyen/her-estrogen/supabase/schema.sql`
- `/Users/isanguyen/her-estrogen/privacy.html`
- `/Users/isanguyen/her-estrogen/terms.html`
- `/Users/isanguyen/her-estrogen/confirmation.html`
- `/Users/isanguyen/her-estrogen/robots.txt`
- `/Users/isanguyen/her-estrogen/sitemap.xml`

**Files reviewed (front-end, large):**
- `/Users/isanguyen/her-estrogen/index.html`
- `/Users/isanguyen/her-estrogen/quiz.html`
- `/Users/isanguyen/her-estrogen/results.html`
- `/Users/isanguyen/her-estrogen/results.jsx`
- `/Users/isanguyen/her-estrogen/app.jsx`

**Not reviewed (and why):**
- Klaviyo flow templates, segment definitions, SMS opt-in microcopy in Klaviyo UI — out of repo; flagged for Vincent verification.
- OpenLoop intake forms, EHR, BAA documentation — separate platform.
- Stripe Dashboard product/price descriptions, customer email receipts — out of repo.
- Hosted assets (`/assets/`) other than referenced by name.
- Vercel environment variable values in production (only `.env.local` template viewed).

**This is NOT legal advice.** Findings represent regulatory and operational risks identified by a static review. All conclusions, especially "missing" required documents/clauses, should be reviewed by qualified healthcare-marketing counsel before launch.

## Executive Summary

HerEstrogen is a marketing front-end for women's HRT telehealth that consciously routes clinical PHI through a third party (OpenLoop) while keeping marketing data in Supabase + Klaviyo. The intent of the marketing/clinical boundary is documented in code comments and is largely preserved in the server-side endpoints. However, the website is **not launch-ready** from a compliance perspective. The most serious findings concern (1) Meta Pixel deployment on health-revealing pages, (2) live secret material checked into local development files that has been acknowledged in code comments as previously shared in chat (rotation required before any production use), (3) a privacy policy missing nearly every section required by CCPA/CPRA/Washington MHMDA/GDPR and by the HHS OCR's 2022/2024 guidance on tracking technologies in healthcare, (4) FDA/FTC drug-advertising disclosures that are absent from product-mentioning pages, and (5) the Supabase BAA status, which Vincent must verify directly.

| Severity | Count |
|----------|-------|
| CRITICAL | 11 |
| HIGH     | 21 |
| MEDIUM   | 23 |
| LOW      | 12 |

_See "Phase 4 — Executive Summary Finalization" near the bottom of this report for the finalized top-5 list and honorable-mention pre-launch blockers._

**Top 5 things Vincent must fix before paid traffic** (preliminary — refined in Phase 4):
1. Rotate the Supabase service-role JWT and the Klaviyo private key that were committed to `.env.local` and previously shared in chat; verify they were never pushed to GitHub.
2. Confirm Supabase HIPAA add-on / BAA is in place before any data that could be PHI lands in `quiz_responses` or `patients`.
3. Remove Meta Pixel and Google Analytics from any URL that reveals health condition or is reachable only by completing a health quiz (results page, confirmation page, privacy/HIPAA page).
4. Rewrite privacy policy to meet CCPA "Do Not Sell or Share", state comprehensive-privacy-law data-subject rights, MHMDA consumer health data, and OCR tracking-tech guidance; enumerate every third-party processor and the data sent to each.
5. Add FDA Important Safety Information (including the estradiol black box warning) anywhere products are named with brand or efficacy claims; remove fabricated testimonials.

<!-- ANCHOR: CRITICAL -->

## CRITICAL Findings

### C-01 Live API secrets committed to `.env.local`; flagged as previously leaked
- **Area:** Code-level security
- **Files:** `/Users/isanguyen/her-estrogen/.env.local` (lines 57-78)
- **Risk:** The file contains a real Supabase project URL, a real anon JWT, and a real `SUPABASE_SERVICE_ROLE_KEY` JWT (which bypasses RLS and grants full database access), plus a real `KLAVIYO_PRIVATE_KEY` beginning `pk_RUvm7K_…`. Inline comments in the file explicitly state both the service-role key and the Klaviyo private key "were previously shared in chat and should be considered compromised." Although `.env.local` is in `.gitignore` (line 5), any historic commit, any local backup (e.g. the rsync mirror under `/Users/isanguyen/Documents/GitHub/her-estrogen/`), or any past chat transcript may still expose them. The service-role JWT confers full read/write/delete on `patients`, `prescriptions`, `quiz_responses`, and `communications_log`.
- **Recommended fix:** Immediately rotate both keys (Supabase Dashboard → Settings → API → "Reset service_role secret"; Klaviyo → Account → Settings → API Keys → revoke and reissue). Audit git history (see Phase 3 below) and any sync target (Documents/GitHub mirror) for prior commits of `.env.local`. Replace example values with placeholder strings (e.g. `eyJ...REDACTED`) in the committed template. Add a CI secret scan (gitleaks/trufflehog) pre-push.
- **Citation:** HIPAA Security Rule 45 CFR §164.308(a)(1)(ii)(A) risk analysis; §164.312(a)(2)(iv) encryption/key management; FTC Safeguards Rule 16 CFR Part 314.

### C-02 Supabase BAA status unverified — `quiz_responses` may receive PHI
- **Area:** HIPAA
- **Files:** `/Users/isanguyen/her-estrogen/supabase/schema.sql` (lines 118-141); `/Users/isanguyen/her-estrogen/api/quiz/submit.js` (lines 82-101)
- **Risk:** Supabase's standard plans do NOT include a BAA — only the HIPAA add-on does. The `quiz_responses` table stores `primary_symptom`, `hormone_stage`, `symptom_score`, `recommended_product`, `birthday`, and a free-form `responses JSONB` blob. The schema comment at line 133-137 claims `birthday` is "not a clinical DOB" but DOB combined with health-condition-implying symptom data is treatable as PHI under HHS/OCR analysis. If Supabase is on a non-HIPAA plan, every quiz submission is a potential disclosure of PHI to a business associate that has not signed a BAA.
- **Recommended fix:** Verify (via Supabase invoice / org settings) that the HIPAA add-on is active and a signed BAA exists naming this project. If not, either (a) execute the BAA before launch, or (b) strip the `quiz_responses` payload to non-health, non-identifying fields and route all symptom + DOB data through OpenLoop only. Do not allow paid traffic until this is confirmed in writing.
- **Citation:** 45 CFR §164.502(e), §164.504(e) (Business Associate Contracts); HHS guidance on covered/business-associate relationships.

### C-03 Meta Pixel + GA fire on privacy/HIPAA notice page and terms page
- **Area:** Meta Pixel healthcare compliance / HIPAA tracking technologies
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` (lines 139-170); `/Users/isanguyen/her-estrogen/terms.html` (lines 125-156)
- **Risk:** The 2022 HHS OCR Bulletin on tracking technologies and the December 2022 / 2024 OCR enforcement actions specifically caution that loading Meta Pixel, Google Analytics, or similar trackers on URLs accessed by patients of a healthcare site can transmit IP + browser identifiers to Meta/Google in a way OCR has treated as impermissible PHI disclosure. The privacy/HIPAA notice page in particular is visited disproportionately by people about to or having submitted health information. Firing `PageView` from `privacy.html` and `terms.html` exposes Vincent to direct OCR-cited risk.
- **Recommended fix:** Remove Meta Pixel and Google Analytics tags from `privacy.html`, `terms.html`, `confirmation.html`, and any URL reachable only by completing the quiz (`results.html`, `confirmation.html`). Audit `quiz.html` and `results.html` separately — see H-series findings. If marketing attribution is required, use server-side conversion API events keyed off non-PHI identifiers only, with documented opt-in.
- **Citation:** HHS OCR Bulletin "Use of Online Tracking Technologies by HIPAA Covered Entities and Business Associates" (Dec 2022; revised Mar 2024); OCR settlements with health systems 2023-2024.

### C-04 Privacy policy missing required CCPA/CPRA, MHMDA, GDPR, and tracking-technology disclosures
- **Area:** Privacy policy & terms / state privacy law
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` (entire document, lines 184-291)
- **Risk:** The privacy policy lacks every one of the following required or strongly-recommended elements:
  - **No "Notice at Collection"** required by California CPRA before/at point of collection.
  - **No "Do Not Sell or Share My Personal Information" link.** Use of Meta Pixel may constitute "sharing" for cross-context behavioral advertising under CPRA — triggering the opt-out link requirement.
  - **No CCPA/CPRA data-subject rights enumeration** (right to know, delete, correct, limit use of sensitive PI, portability, non-discrimination).
  - **No mention of Washington MHMDA** ("My Health, My Data") consumer health data — explicit consent / authorization regime that almost certainly covers this site's collection.
  - **No GDPR/UK-GDPR notice** even though no geofencing is implemented (the site is reachable from the EU/UK).
  - **No specific disclosure of Meta Pixel, Google Analytics, Klaviyo, Supabase, Vercel, or Vercel Analytics as third parties**, what data is shared with each, and the legal basis. The current "Business Associates" list (line 247-253) names only OpenLoop, Stripe, and "pharmacy partners."
  - **No retention schedule.**
  - **No data subject request mechanism** (only "submit through our support team").
  - **No COPPA / children's privacy statement** (despite 18+ age gate in Terms §2).
  - **No description of automated decision-making** (the quiz scores symptoms and recommends a product algorithmically).
  - **No mention of cookie categories or any cookie banner / consent UI** — the policy says cookies are used (§9, line 281) but the site, per inspection, has no cookie banner.
  - **No HIPAA Notice of Privacy Practices** detail required of covered entities/BAs (purposes for which PHI may be used/disclosed, right to file complaint with HHS).
  - **No GLBA / financial privacy carve-out for Stripe.**
- **Recommended fix:** Have counsel rewrite the privacy policy from scratch using a CCPA + MHMDA + HIPAA NPP template; add the "Do Not Sell or Share" link and a functional rights-request flow; implement a cookie/consent banner with category controls that honors Global Privacy Control.
- **Citation:** Cal. Civ. Code §§1798.100-1798.199.100 (CCPA/CPRA); RCW 19.373 (MHMDA, effective Mar 31 2024); 45 CFR §164.520 (HIPAA NPP); GDPR Arts. 12-14; FTC Act §5.

### C-05 No FDA Important Safety Information / black box warning on product-mention pages
- **Area:** FDA prescription drug advertising
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` (lines 195-205 reference "FDA-approved prescription"); preliminary inspection of `/Users/isanguyen/her-estrogen/index.html` and `/Users/isanguyen/her-estrogen/results.html` shows specific products are named — full review in Phase 2.
- **Risk:** Estradiol carries an FDA black box warning covering: endometrial cancer, cardiovascular disorders (stroke, MI, DVT/PE), breast cancer (with combination therapy), and probable dementia. Oral progesterone carries warnings re: breast cancer, cardiovascular events, dementia. FDA 21 CFR §202.1 requires direct-to-consumer prescription drug advertising to include a "fair balance" of efficacy and risk information, the major statement of risks, and a brief summary or adequate-provision link. None of these are present on confirmation.html and (preliminarily) appear absent or inadequate on index.html / results.html.
- **Recommended fix:** Wherever a prescription product is named (generic OR brand), add an Important Safety Information block including the boxed warning, contraindications, common adverse reactions, and a link to the full prescribing information. Or restructure the site so consumer-facing pages discuss only the condition and treatment categories generically and leave product-specific advertising to logged-in or post-consent areas.
- **Citation:** FDA 21 CFR §202.1; FDA Guidance for Industry, "Consumer-Directed Broadcast Advertisements" (Aug 1999, rev.); FDA enforcement actions against telehealth companies 2023-2024.

### C-06 Fabricated testimonials acknowledged by owner; presented as customer experience
- **Area:** FTC advertising / testimonials
- **Files:** Pending Phase 2 inspection of `/Users/isanguyen/her-estrogen/index.html` and `/Users/isanguyen/her-estrogen/results.html`. Vincent has confirmed offline that testimonials on the site are fabricated.
- **Risk:** The FTC's revised Endorsement Guides (16 CFR Part 255, effective June 2023) and the Trade Regulation Rule on the Use of Consumer Reviews and Testimonials (16 CFR Part 465, effective Oct 2024) make fabricated testimonials per se deceptive and impose civil-penalty liability up to ~$51K/violation. Health-condition testimonials carry additional FDA scrutiny.
- **Recommended fix:** Remove every fabricated testimonial before any paid traffic runs. If testimonials are restored later, each must be from an identified, consenting real customer and accompanied by typicality disclosure where atypical.
- **Citation:** 16 CFR Part 255; 16 CFR Part 465; FTC Act §5.

### C-07 No cookie/consent banner; analytics fire pre-consent
- **Area:** Cookie & tracking consent
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html`, `/Users/isanguyen/her-estrogen/terms.html`, and (pending Phase 2) `/Users/isanguyen/her-estrogen/index.html`, `/Users/isanguyen/her-estrogen/quiz.html` — no consent UI is loaded; Meta Pixel and GA fire on `PageView` immediately.
- **Risk:** California CPRA, Colorado CPA, Connecticut CTDPA, Virginia VCDPA, and (especially) Washington MHMDA require opt-out or opt-in for sale/sharing or for sensitive-data processing. GDPR/ePrivacy require opt-in for non-essential cookies. Without a banner, the site is presumptively non-compliant in every state with comprehensive privacy law and in the EU. The site also fails to honor Global Privacy Control (GPC) signals.
- **Recommended fix:** Implement a consent management platform (Osano, Cookiebot, OneTrust, Iubenda, or open-source equivalent) that (a) blocks non-essential trackers pre-consent, (b) honors GPC, (c) records per-user consent state for the CCPA/CPRA service-provider-disclosure record.
- **Citation:** Cal. Civ. Code §1798.135; CPRA Regulations §7025 (GPC); RCW 19.373.030; GDPR Art. 7.

<!-- ANCHOR: HIGH -->

## HIGH Findings

### H-01 CORS `Access-Control-Allow-Origin: *` on all API endpoints
- **Area:** Code-level security
- **Files:**
  - `/Users/isanguyen/her-estrogen/api/quiz/submit.js` line 181
  - `/Users/isanguyen/her-estrogen/api/orders/placed.js` line 45
  - `/Users/isanguyen/her-estrogen/api/orders/cancelled.js` line 41
  - `/Users/isanguyen/her-estrogen/api/checkout.js` line 77
- **Risk:** Wildcard CORS allows any origin to invoke these endpoints from a user's authenticated browser session. For `/api/quiz/submit`, that means any site can cause a Klaviyo profile creation tied to any email a malicious page wants to inject; for `/api/checkout`, any site can spin up a Stripe Checkout session for HerEstrogen. The webhook endpoints (`/api/orders/*`) are at least gated by `X-Webhook-Secret`, but wildcard CORS is still wrong for a server-to-server webhook.
- **Recommended fix:** Pin CORS to `https://herestrogen.com` (and the Vercel preview pattern if needed). Remove CORS entirely from webhook endpoints — they shouldn't be browser-callable.
- **Citation:** OWASP API Security Top 10 (API8:2023 Security Misconfiguration).

### H-02 No rate limiting on `/api/quiz/submit` or `/api/checkout`
- **Area:** Code-level security / abuse prevention
- **Files:** `/Users/isanguyen/her-estrogen/api/quiz/submit.js`; `/Users/isanguyen/her-estrogen/api/checkout.js`
- **Risk:** Either endpoint can be hit at unlimited rate. `/api/quiz/submit` writes a row to Supabase and creates/updates a Klaviyo profile on every request — an attacker can rapidly inflate the quiz_responses table (storage costs + GDPR data-minimization issue), pollute the Klaviyo list (deliverability + email-list-hygiene scoring), and exhaust the Klaviyo private API quota. `/api/checkout` creates Stripe customer + checkout session records — Stripe will rate-limit the account before Vincent does. Combined with `CORS *`, this is a denial-of-service and reputation vector.
- **Recommended fix:** Add per-IP rate limiting (Vercel KV + simple token bucket, or Upstash Ratelimit). 5 req/min/IP for /api/quiz/submit; 10 req/min/IP for /api/checkout. Add a Turnstile/hCaptcha before the quiz submit on the client.
- **Citation:** OWASP API Security Top 10 (API4:2023 Unrestricted Resource Consumption).

### H-03 Klaviyo error logs include user email
- **Area:** HIPAA / PII handling
- **Files:**
  - `/Users/isanguyen/her-estrogen/api/orders/placed.js` line 92 (`fired for ${email}`)
  - `/Users/isanguyen/her-estrogen/api/orders/cancelled.js` line 78 (`fired for ${email}`)
  - `/Users/isanguyen/her-estrogen/api/webhooks/stripe.js` lines 117, 132, 152, 165, 183, 194 (`for ${email}` / `${patient.email}`)
- **Risk:** Vercel Function logs land in Vercel's logging backend (and any Datadog/Logtail integration). Email addresses are PII; when combined with the surrounding context "patient cancelled" or "refill recorded" they become PHI under HIPAA's broad definition. If Vercel's logs backend is not BAA-covered for this account, this is impermissible disclosure.
- **Recommended fix:** Hash the email (e.g. SHA-256, last 4 chars in plaintext) before logging, or use a per-user UUID. Disable log retention beyond what's operationally necessary; verify Vercel logs are within the BAA scope of whatever logging vendor Vincent uses.
- **Citation:** 45 CFR §164.514 (de-identification); OCR enforcement on logging vendors.

### H-04 Missing security headers (CSP, HSTS, X-Frame-Options)
- **Area:** Code-level security
- **Files:** `/Users/isanguyen/her-estrogen/vercel.json` (lines 4-19)
- **Risk:** Present: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Missing:
  - **Content-Security-Policy** — the site loads inline scripts, `connect.facebook.net`, `googletagmanager.com`, `fonts.googleapis.com`, `unpkg.com` (Babel-standalone + React CDN). Without CSP any XSS injection is unconstrained.
  - **Strict-Transport-Security** — Vercel terminates HTTPS but HSTS should be set explicitly (e.g. `max-age=63072000; includeSubDomains; preload`).
  - **X-Frame-Options: DENY** (or CSP `frame-ancestors 'none'`) — without it the site can be iframed and clickjacked, an issue for any page collecting payment or PHI.
- **Recommended fix:** Add the three headers in `vercel.json`. CSP will require enumerating script-src/style-src origins; start in report-only.
- **Citation:** OWASP Secure Headers Project.

### H-05 `confirmation.html` contains "board-certified, licensed Her Estrogen provider" claim without substantiation surface
- **Area:** FDA/FTC advertising / state professional-licensure rules
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` line 189
- **Risk:** "Board-certified" is a regulated term; under FTC Endorsement Guides and several state medical-board rules, a claim that a service uses board-certified providers must be substantiated (which board, in what specialty, with verifiable credentials available on request). Also, the site doesn't directly employ providers — OpenLoop does — so the phrase "Her Estrogen provider" misattributes the practitioner relationship.
- **Recommended fix:** Substitute "a licensed clinician via our medical partner, OpenLoop Health" or similar; back any "board-certified" claim with a publicly accessible roster + specialty data, or drop the qualifier.
- **Citation:** FTC Endorsement Guides; state medical board advertising rules vary (e.g. CA Bus. & Prof. Code §651, VA Code §54.1-2914).

### H-06 `confirmation.html` "FDA-approved prescription" framing without product/ISI
- **Area:** FDA prescription drug advertising
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` lines 195-197
- **Risk:** "Your FDA-approved prescription" implies a guaranteed product issue, conflicting with terms.html §6 which (correctly) says the provider may decline. The phrase is also a drug-advertising assertion without Important Safety Information.
- **Recommended fix:** Rewrite step 2 to be conditional: "If a clinician approves treatment, your prescription will be routed to a licensed pharmacy partner. You will be notified separately." Add ISI link or block.
- **Citation:** FDA 21 CFR §202.1; FTC §5 (deceptive practices).

### H-07 `confirmation.html` "within 24 hours" promise
- **Area:** FTC §5 / state telehealth
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` lines 178-180, 189
- **Risk:** A hard "24-hour" promise for clinical review is a service-level claim that, if not always met, is an FTC deception risk. Telehealth review SLA also varies by state pharmacy law.
- **Recommended fix:** Change to "typically within 24 hours" or "within 1-2 business days" — softer hedging.
- **Citation:** FTC Act §5.

### H-08 `confirmation.html` "premium Her Estrogen packaging" with "3-5 business days"
- **Area:** FTC §5 / federal pharmacy regulation
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` lines 202-204
- **Risk:** Specific delivery-window promise without a "subject to provider review" caveat repeats the H-07 risk. "Premium packaging" of prescription drugs is acceptable but co-pack with marketing material is regulated under USP <659> and state Board of Pharmacy rules.
- **Recommended fix:** Softer language; verify pharmacy partner permits branded outer packaging in every state shipped to.
- **Citation:** FTC §5; state Board of Pharmacy.

### H-09 Pricing variable `monthly_amount` and "minimum 3 months" plan structure may trigger California ARL / FTC Click-to-Cancel
- **Area:** Subscription / auto-renewal
- **Files:**
  - `/Users/isanguyen/her-estrogen/api/checkout.js` lines 34-66 (3 / 6 / 12-month "subscription mode")
  - `/Users/isanguyen/her-estrogen/supabase/schema.sql` line 37 (`monthly_amount INTEGER` in cents)
  - `/Users/isanguyen/her-estrogen/.env.local` lines 17-18 ("Pricing: $507 / $912 / $1,716 for 3 / 6 / 12 months")
  - `/Users/isanguyen/her-estrogen/terms.html` §7 (lines 221-224)
- **Risk:** Plans of 3+ months at $507+ charged up-front in `subscription` mode trigger:
  - **California ARL** (Bus. & Prof. Code §17602): clear-and-conspicuous disclosure of renewal terms BEFORE checkout, separate acknowledgement, ability to cancel online "in the same manner."
  - **FTC ROSCA** + **FTC Click-to-Cancel rule (Negative Option Rule, Oct 2024)** which requires the same disclosures and "as easy to cancel as to enroll."
  - **Reminders** for plans renewing automatically and longer than 6 months: California requires advance notice 15-45 days before renewal.
  - Terms §7 is silent on auto-renewal disclosures, cancellation mechanism, refund-after-renewal policy. Terms §8 prohibits refunds after shipment, which compounds the ARL issue.
- **Recommended fix:** Add a renewal-terms summary box at checkout immediately above the Pay button; require a separate "I authorize recurring charges" checkbox; build an in-app cancel-anytime UI (not email-only); set up 15-45-day pre-renewal email reminders; consult counsel on whether the "minimum 3 months" up-front charge is itself permissible in CA and NY.
- **Citation:** Cal. Bus. & Prof. §17602; 16 CFR Part 425 (FTC Negative Option Rule, 2024); 15 USC §8401-8405 (ROSCA).

### H-10 Privacy policy doesn't disclose Klaviyo, Meta, Google, Supabase, or Vercel
- **Area:** Privacy policy
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` lines 247-253
- **Risk:** The only third parties named are OpenLoop, Stripe, and "Licensed pharmacy partners." Klaviyo (email), Meta Pixel (ads), Google Analytics (analytics), Supabase (database), Vercel (hosting + analytics) all receive data and are not disclosed. CCPA §1798.110 requires categories of third parties to which personal information is disclosed in the prior 12 months.
- **Recommended fix:** Enumerate every processor, what data each receives, and the purpose. Distinguish "service provider" (CCPA term) from "third party" (sale/share).
- **Citation:** Cal. Civ. Code §1798.110, §1798.115.

### H-11 SMS consent collected without TCPA-compliant disclosure language
- **Area:** Email marketing / TCPA / state mini-TCPAs
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` §7 (lines 266-269); pending Phase 2 review of `/Users/isanguyen/her-estrogen/quiz.html` for the actual phone-capture UI.
- **Risk:** Privacy §7 says "Marketing text messages are sent only with express consent." TCPA + Florida FTSA + Washington WA-CPA require:
  - Express written consent
  - Disclosure of "frequency varies / Msg & data rates may apply / Reply STOP to opt out / Reply HELP for help"
  - Identification of the sender by name
  - Disclosure that consent is not a condition of purchase
  These must appear AT THE POINT OF PHONE CAPTURE, not only in the privacy policy. Phase 2 will determine whether the quiz form complies.
- **Recommended fix:** Inline disclosure with the phone-number field; double opt-in if possible; per-jurisdiction consent timestamping; honor STOP/HELP at the SMS provider level.
- **Citation:** 47 USC §227; 47 CFR §64.1200; Fla. Stat. §501.059 (FTSA).

### H-12 Quiz "recommended_product" stored both in Supabase and Klaviyo — algorithmic product steering may be considered a medical decision
- **Area:** FDA / FTC / state telehealth
- **Files:**
  - `/Users/isanguyen/her-estrogen/api/quiz/submit.js` lines 89-119
  - `/Users/isanguyen/her-estrogen/lib/klaviyo.js` ("recommended_product" property)
- **Risk:** The quiz algorithmically selects a prescription product and tells the user — and tells Klaviyo, and stores in Supabase — before any clinician has reviewed. State pharmacy boards and the FTC's 2023 Joint Statement on telehealth view "the product appears chosen before the clinical encounter" as evidence of corporate practice of medicine or improper prescribing-for-promotion. Klaviyo emails keyed off `recommended_product` (the F2 Pre-Rx Nurture flow) compound the appearance.
- **Recommended fix:** Reframe the quiz output as "Here are categories a clinician may discuss with you" rather than "Recommended: Estradiol Gel." Make the clinician encounter — not the algorithm — the first time a specific product is suggested.
- **Citation:** FTC/HHS/DOJ Joint Statement on Telehealth (2023); state corporate-practice-of-medicine doctrines; FDA guidance on direct-to-consumer prescribing.

<!-- ANCHOR: MEDIUM -->

## MEDIUM Findings

### M-01 `lib/database.js` uses `supabaseAdmin` (service role) everywhere with no auth gate on consumers
- **Area:** Code-level security
- **Files:** `/Users/isanguyen/her-estrogen/lib/database.js` lines 5-12, 18-87
- **Risk:** Every database function escalates to service-role. The only consumer that enforces auth is `/api/prescriptions/update.js` (Bearer token), and even that token is OPTIONAL — `PRESCRIPTION_UPDATE_TOKEN` is gated behind an `if (expectedToken)` check (line 48). If the env var is not set in production, the prescription-update endpoint is unauthenticated and any internet user can mark prescriptions delivered.
- **Recommended fix:** Make `PRESCRIPTION_UPDATE_TOKEN` mandatory (return 500 if unset, not skip auth). Add a Vercel deploy check.
- **Citation:** OWASP API1:2023 Broken Object Level Authorization.

### M-02 `/api/webhooks/stripe.js` is wired and active even though Stripe is described as dormant
- **Area:** Code-level security / clarity
- **Files:** `/Users/isanguyen/her-estrogen/api/webhooks/stripe.js` (entire file); `/Users/isanguyen/her-estrogen/api/orders/placed.js` lines 11-13
- **Risk:** Code comment in `placed.js` states "Stripe is NO LONGER the payment processor for live transactions… kept for reference but not wired to real payments." But `/api/webhooks/stripe.js` still creates `patients` and `prescriptions` rows from any Stripe webhook event with a valid signature. If `STRIPE_WEBHOOK_SECRET` is set in production and Stripe has the webhook URL configured, real events could still hit it and create rows. This produces a duplicated, possibly conflicting source of truth with the OpenLoop path.
- **Recommended fix:** Either delete `/api/webhooks/stripe.js` and the Stripe-mode `/api/checkout.js` if truly dormant, or short-circuit them with a feature flag (`if (!process.env.STRIPE_ENABLED) return 410 Gone`). Decide one source of truth.
- **Citation:** Defensive software architecture / clarity.

### M-03 `quiz_responses.responses JSONB` is free-form and may capture more than the documented fields
- **Area:** HIPAA / data minimization
- **Files:** `/Users/isanguyen/her-estrogen/api/quiz/submit.js` lines 89, 215; `/Users/isanguyen/her-estrogen/supabase/schema.sql` lines 124-125
- **Risk:** The server accepts `body.responses` as an arbitrary object and stores it verbatim. The comment lock at the top of submit.js (lines 12-22) restricts what the client should put there, but the server enforces no schema. If the quiz client ever adds a field containing condition-revealing text, it lands in Supabase without filtering.
- **Recommended fix:** Allowlist-filter `responses` keys on the server. Define a schema (Zod / Joi) and reject unknown fields.
- **Citation:** GDPR Art. 5(1)(c) data minimization; HIPAA minimum necessary 45 CFR §164.502(b).

### M-04 Klaviyo `firstName` accepted from request body
- **Area:** HIPAA — name is identifier under HIPAA's 18 identifiers
- **Files:** `/Users/isanguyen/her-estrogen/api/quiz/submit.js` line 209
- **Risk:** Quiz submit sends `first_name` to Klaviyo's profile-import. Per HIPAA's 18 identifiers, a name combined with health-condition properties (primary_symptom, hormone_stage) is PHI. If Klaviyo is not BAA-covered, this is impermissible disclosure even if quiz_responses Supabase is BAA-covered.
- **Recommended fix:** Klaviyo does NOT typically offer a BAA for marketing accounts. Either (a) confirm Klaviyo BAA, (b) stop sending symptom data to Klaviyo at all, or (c) downstream-only send a non-identifier hash plus marketing-safe traits (e.g. just plan tier).
- **Citation:** 45 CFR §164.514(b)(2)(i).

### M-05 `supabase.js` warns rather than throws on missing config
- **Area:** Reliability
- **Files:** `/Users/isanguyen/her-estrogen/lib/supabase.js` lines 15-16, 26-28
- **Risk:** `console.warn` on missing URL/SERVICE keys produces a soft-fail mode where the admin client is `null` and downstream `requireAdmin()` throws at request time. In Vercel, this means /api/quiz/submit and /api/prescriptions/update return 500 silently to users until the operator checks logs. Better to fail-fast at module load in production.
- **Recommended fix:** Throw on missing in production; warn in development.

### M-06 `logCommunication` swallows errors silently
- **Area:** Audit trail integrity
- **Files:** `/Users/isanguyen/her-estrogen/lib/database.js` lines 146-150
- **Risk:** A communications audit log is a compliance asset; soft-failing the write is OK for UX but means there's no alarm when the audit-log table is unreachable. For a HIPAA-touching system the BA needs an "alerting" path on audit failure.
- **Recommended fix:** Add a fallback (CloudWatch / Sentry) so audit-log write failures are visible.
- **Citation:** HIPAA Security Rule audit controls 45 CFR §164.312(b).

### M-07 Robots.txt allows `quiz.html` to be crawled
- **Area:** Marketing-vs-clinical boundary + Meta/Google search snippets
- **Files:** `/Users/isanguyen/her-estrogen/robots.txt`, `/Users/isanguyen/her-estrogen/sitemap.xml` line 12-16
- **Risk:** quiz.html is in robots-allowed and in the sitemap (priority 0.9). Search engines may cache symptom-revealing copy or screenshot the page. Pending Phase 2: confirm whether quiz.html URL itself reveals condition in slugs/titles. Confirmation.html and results.html are correctly disallowed.
- **Recommended fix:** Consider whether quiz.html should be sitemap'd at all. At minimum verify no PII / no health condition in any query string ever generated.

### M-08 Stripe success_url + cancel_url default to public domain without state token
- **Area:** Subscription
- **Files:** `/Users/isanguyen/her-estrogen/api/checkout.js` lines 134-136
- **Risk:** Anyone hitting `/confirmation` directly sees the welcome page (no checkout-state validation). Not a serious risk but means the "intake submitted" page is reachable without an actual intake.
- **Recommended fix:** Pass a Stripe `session_id` and validate it on `/confirmation`.

### M-09 `terms.html` lacks mandatory subscription disclosures, arbitration carve-outs, and California-specific notices
- **Area:** Terms / state law
- **Files:** `/Users/isanguyen/her-estrogen/terms.html` §7-§12 (lines 221-269)
- **Risk:** Beyond H-09 (auto-renewal): no class-action waiver explanation, no 30-day opt-out from arbitration, no severability, no choice-of-forum carve-out for California / New Jersey courts where pre-dispute arbitration of certain claims is restricted, no acknowledgement of right to file with state medical boards / HHS OCR. Governing law of Virginia with no business presence stated.
- **Recommended fix:** Counsel-drafted Terms; add California-specific consumer notice; add an arbitration opt-out window.

### M-10 No mention of FDA MedWatch reporting in privacy / terms
- **Area:** FDA
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html`, `/Users/isanguyen/her-estrogen/terms.html`
- **Risk:** Telehealth pharmacies typically include adverse-event reporting language and a link to FDA MedWatch. Absence is a compliance soft-spot.
- **Recommended fix:** Add a "Report a side effect" section linking to https://www.fda.gov/safety/medwatch.

### M-11 `confirmation.html` lacks Meta Pixel — but only because all the OTHER pages have it
- **Area:** Tracking-tech consistency
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` (no Pixel snippet)
- **Risk:** Inconsistency means whoever maintains the site might add Pixel back to confirmation.html later, re-introducing the C-03 issue on a post-purchase health page.
- **Recommended fix:** Make the no-tracker policy explicit (code comment) on all post-funnel pages.

### M-12 `placed.js` rejects non-numeric `value` but doesn't sanity-cap
- **Area:** Validation
- **Files:** `/Users/isanguyen/her-estrogen/api/orders/placed.js` lines 83-85
- **Risk:** Any positive `value` is accepted. An attacker with the webhook secret (or a misconfigured OpenLoop integration) could push absurd values into Klaviyo segment math.
- **Recommended fix:** Cap to a plausible max (e.g. value < 50000) and round to cents.

<!-- ANCHOR: LOW -->

## LOW Findings

### L-01 Effective date of legal docs is in the future
- **Area:** Legal hygiene
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` line 182; `/Users/isanguyen/her-estrogen/terms.html` line 168
- **Risk:** Both list "Effective Date: May 13, 2026" — fine if accurate, but as the site is pre-launch and policies will undoubtedly be edited, this date should reflect the actual last update.

### L-02 Privacy policy's "Privacy Officer" is generic
- **Area:** HIPAA NPP / state privacy law
- **Files:** `/Users/isanguyen/her-estrogen/privacy.html` lines 286-291
- **Risk:** HIPAA NPP and many state laws require a named contact or at minimum a department title with mailing address (not just an email).
- **Recommended fix:** Include physical mailing address and named Privacy Officer.

### L-03 `package.json` "description" mentions Stripe/Supabase but not the OpenLoop migration
- **Area:** Documentation
- **Files:** `/Users/isanguyen/her-estrogen/package.json` line 5
- **Risk:** Minor — repo description is stale.

### L-04 Mixed CommonJS + Babel-standalone React without a build pipeline
- **Area:** Maintainability / security patching
- **Files:** `/Users/isanguyen/her-estrogen/package.json`; (pending Phase 2 confirmation in `index.html`)
- **Risk:** Babel-standalone in production is slow and means React + Babel are loaded from CDN unpinned (or pinned to a major). Any compromise of the CDN injects code into a healthcare site.
- **Recommended fix:** Move to a real build (Vite / Next.js) before scaling; pin SRI hashes on all CDN scripts.

### L-05 No HSTS preload, no DNS CAA records noted
- **Area:** Hardening
- **Files:** `/Users/isanguyen/her-estrogen/vercel.json`
- **Recommended fix:** Set HSTS with preload after testing; add DNS CAA records pinning to Vercel's CA.

### L-06 The `responses JSONB` field has no per-row encryption beyond Supabase's at-rest
- **Area:** HIPAA defense in depth
- **Files:** `/Users/isanguyen/her-estrogen/supabase/schema.sql` lines 124-125
- **Risk:** At-rest encryption is fine but column-level encryption (e.g. pgcrypto) for PHI columns adds a tier of defense if a query log or backup is exposed.
- **Recommended fix:** Consider pgcrypto column encryption for `responses` and `birthday` if this column is ever PHI.

### L-07 No CODEOWNERS / no PR template / no SECURITY.md
- **Area:** Repo hygiene
- **Files:** repo root
- **Recommended fix:** Add SECURITY.md with a vulnerability-disclosure address before public launch.

## Items Requiring Outside Counsel
- Full rewrite of privacy.html and terms.html to meet CCPA/CPRA + Washington MHMDA + HIPAA NPP + FTC/FDA requirements.
- Drafting/review of arbitration clause given California, New Jersey, and federal McGill/Iskanian + FAA developments.
- Auto-renewal disclosures and Click-to-Cancel UX review for compliance with FTC Negative Option Rule (Oct 2024) and California ARL.
- Substantiation review for any "board-certified," "clinically proven," "FDA-approved" claim used in marketing.
- Review of fabricated testimonials and decision on remediation/disclosure.
- Review of cross-state telehealth-corporate-practice-of-medicine structure with OpenLoop.

## Items Requiring Vincent Action (outside codebase)
- **Confirm Supabase HIPAA add-on and signed BAA covering this project.** Without this, do not launch.
- **Rotate the Supabase service-role JWT and the Klaviyo private API key** named in `.env.local`; confirm neither was ever pushed to GitHub (`git log` audit in Phase 3 of this report).
- **Confirm Klaviyo's BAA stance.** Klaviyo does not typically offer a BAA for marketing accounts — independently confirm.
- **Confirm OpenLoop BAA is signed and on file.**
- **Confirm pharmacy-partner BAAs are signed and on file.**
- **LegitScript certification:** verify badge is NOT displayed anywhere on the site until certification is granted; plan for the application + review timeline.
- **Klaviyo flow templates (F1-F8):** review every email/SMS template in the Klaviyo UI for:
  - Unsubscribe link
  - Physical mailing address (CAN-SPAM)
  - Accurate "From" name/address
  - Non-deceptive subject lines
  - Health-condition copy that may itself be impermissible PHI in subject lines
  - SMS-specific opt-out copy if any flow uses SMS
- **Stripe/OpenLoop reconciliation:** decide and document the true source of truth; remove dormant Stripe wiring or feature-flag it.
- **Production env vars audit in Vercel:** verify `PRESCRIPTION_UPDATE_TOKEN` and `OPENLOOP_WEBHOOK_SECRET` are set; verify CORS allowlist environment.
- **Consent management platform:** procure and implement.
- **Accessibility scan:** run axe-core + manual screen-reader pass before launch.
- **Incident-response plan + 60-day HIPAA breach-notification process:** document offline.

_Phase 1 written 2026-05-25. Phase 2 (front-end deep scan) appended below._

---

# Phase 2 — Front-End Deep Scan (appended 2026-05-25)

Files scanned in this phase: `quiz.html`, `index.html`, `results.html`, `results.jsx`, `app.jsx`, `confirmation.html`, `robots.txt`, `sitemap.xml`. The findings below are additive to Phases 1; existing C-/H-/M-/L- numbers continue.

## Additional CRITICAL Findings

### C-08 Meta Pixel fires on quiz.html — a URL only reached when a user begins disclosing menopause/HRT health information
- **Area:** Meta Pixel healthcare compliance / HIPAA tracking technologies
- **Files:** `/Users/isanguyen/her-estrogen/quiz.html` lines 210-243; also `index.html` lines 2549-2580 (PageView + GA + Vercel Analytics); `results.html` lines 1649-1674 (PageView + InitiateCheckout)
- **Risk:** quiz.html is the entry point of the symptom intake (title at line 277: "Where are you in the menopause journey?"). Loading Meta Pixel on this page transmits the visitor's IP + browser fingerprint to Meta in the very session in which they are about to disclose perimenopause/menopause/postmenopause status, symptoms, and HRT history. Under the 2022/2024 HHS OCR Bulletin on tracking technologies, IP + page-context (a URL that exists only to take a menopause quiz) is treated as a potential PHI disclosure to Meta. The "compliance lock" comments at line 211-213 do not change this — they prevent SYMPTOM strings from being added as event parameters, but the page-context itself plus `Lead` and `CompleteRegistration` events fired from a health-quiz funnel are themselves the disclosure OCR has flagged. Additionally the quiz page calls `fbq('track', 'Lead')` unconditionally on page load (line 226).
- **Recommended fix:** Remove client-side Meta Pixel and Google Analytics from `quiz.html`, `results.html`, `confirmation.html`. If marketing attribution from the funnel is required, use Meta's Conversions API server-side with explicitly de-identified events keyed off a hashed pseudonym created AFTER the consent point — and even then only if Meta has accepted a written Limited Data Use designation for the account. Consult counsel and Meta's healthcare-advertising policy before re-enabling.
- **Citation:** HHS OCR Bulletin (Dec 2022; revised Mar 2024); OCR-Novant Health, OCR-Cerebral et al. enforcement actions 2023-2024; Meta Healthcare Advertising Policies.

### C-09 Server-side `/api/quiz/submit.js` transmits symptom + stage data to Klaviyo regardless of the client's `KLAVIYO_SEND_HEALTH_DATA=false` flag
- **Area:** HIPAA — Klaviyo BAA status
- **Files:**
  - `/Users/isanguyen/her-estrogen/quiz.html` line 448 (`KLAVIYO_SEND_HEALTH_DATA = false` — client compliance flag)
  - `/Users/isanguyen/her-estrogen/api/quiz/submit.js` lines 112-120 (Klaviyo `properties` object includes `primary_symptom`, `hormone_stage`, `symptom_score`, `recommended_product`, `birthday`)
- **Risk:** quiz.html sets a HIPAA-protective flag `KLAVIYO_SEND_HEALTH_DATA = false` and the inline comment at line 445-447 says "only flip this to true after Klaviyo signs you a BAA in writing." But on quiz completion the client POSTs to `/api/quiz/submit`, and the server endpoint **unconditionally** sends `primary_symptom`, `hormone_stage`, `symptom_score`, `recommended_product`, and `birthday` to Klaviyo's profile-import (`api/quiz/submit.js` lines 112-118). The server has no equivalent flag. So the "compliance lock" is not actually enforced on the production data path — every quiz submit sends symptom + stage + DOB to Klaviyo. Combined with `first_name` and `email` (lines 126-127) these meet HIPAA's 18-identifiers test for PHI. If Klaviyo has no signed BAA covering this account, every quiz completion is an impermissible PHI disclosure to a non-covered business associate.
- **Recommended fix:** Either (a) implement and pre-launch confirm a Klaviyo BAA in writing; or (b) mirror the client flag on the server — send ONLY `email`, `first_name`, `source=quiz`, `quiz_completed_at` to Klaviyo until BAA is in place. The richer profile properties used by Klaviyo flows F1-F8 must come from non-PHI signals (e.g. plan tier, opt-in timestamp) OR from a separate BAA-covered processor.
- **Citation:** 45 CFR §164.502(e), §164.504(e); 45 CFR §164.514(b)(2)(i).

### C-10 Algorithm-driven, product-specific marketing copy on results.html bypasses the clinician encounter
- **Area:** FDA prescription drug advertising / corporate-practice-of-medicine / FTC §5
- **Files:**
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 79-150 (per-product cards with "FDA-Approved Estradiol Gel — Daily Transdermal", "FDA-approved estradiol patch — prescribed to your dose", etc.)
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 292-371 (the `recommendProduct` function selects a specific named product based on quiz answers and presents it as "your" recommended protocol)
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 247, 310, 317, 324, 334, 343, 352, 361, 369 ("FDA-approved estradiol gel", "FDA-approved Estradiol Vaginal Cream", "the most prescribed first-line therapy", "Backed by NAMS, IMS, and the FDA as the standard of care")
- **Risk:** The site selects a specific FDA-approved Rx product (estradiol gel / patch / pill / vaginal cream / progesterone pill) algorithmically and presents it as "your recommended protocol" complete with pricing, "Add to plan" buttons, and a checkout-mode subscription gate — all **before** any clinician has reviewed the patient. Under FDA 21 CFR §202.1 this is direct-to-consumer prescription drug advertising that names specific products without (a) the major statement of risks, (b) brief summary or adequate-provision link, (c) the estradiol black box warning. Under FTC and HHS/DOJ telehealth-corporate-practice-of-medicine theories, the algorithm's choice — not the clinician's — is the de facto prescribing decision, and the clinician is later asked to ratify it. The disclaimer at `results.jsx` line 1182 ("does not create a doctor-patient relationship … licensed providers retain the decision to prescribe") is the right idea but is buried in fine print far below the checkout CTA. Compounded by the fact that `recommended_product` is stored in Supabase and pushed to Klaviyo where it drives the F2 Pre-Rx Nurture email flow with product-specific subject lines.
- **Recommended fix:** Reframe results.html as "Here are the FDA-approved treatment categories a clinician will discuss with you," NOT "Your prescription is estradiol gel — checkout below." Move pricing and checkout AFTER the intake submission and clinician review. Add ISI block + black-box warning everywhere a product is named. Decouple `recommended_product` storage from Klaviyo marketing flows.
- **Citation:** 21 CFR §202.1; FDA Draft Guidance "Presenting Risk Information in Prescription Drug and Medical Device Promotion" (2009); FTC/HHS/DOJ Joint Statement on Telehealth (2023); state corporate-practice-of-medicine doctrines (CA, NY, TX, IL, NJ).

### C-11 Statistics presented as efficacy data are unsubstantiated
- **Area:** FTC §5 / FDA prescription drug advertising
- **Files:** `/Users/isanguyen/her-estrogen/results.jsx` lines 219-224
- **Risk:** Statistics block on results.html includes: "87% Women report significant symptom relief within 30 days", "9/10 Patients say HRT is the most effective treatment they've tried", "94% Continuation rate after 6 months of treatment", "5+ yrs Average length of time patients stay on HRT." These look like efficacy claims sourced from internal data — but the site is pre-launch with zero patients, so the data cannot be from Her Estrogen. The statements are not sourced. FTC requires competent and reliable scientific evidence to substantiate efficacy claims; FDA reviews them under DTC rules. Fabricated or unsupported stats are FTC §5 deceptive practice, and pull additional FDA scrutiny because they relate to a prescription drug.
- **Recommended fix:** Either remove all numerical efficacy claims, OR replace with cited stats from peer-reviewed sources (WHI, KEEPS, ELITE trials etc.) with the citation visible at the point of claim, OR clearly mark as illustrative of published HRT literature, not Her Estrogen data. Counsel should bless every retained statistic.
- **Citation:** FTC Act §5; FTC Endorsement Guides 16 CFR Part 255; FTC Health Products Compliance Guidance (Dec 2022).

## Additional HIGH Findings

### H-13 Testimonial text in code is acknowledged "PLACEHOLDER" — and would still be deceptive even if labeled "illustrative"
- **Area:** FTC advertising / FDA endorsement guides
- **Files:**
  - `/Users/isanguyen/her-estrogen/app.jsx` line 64-67 (3 reviews — `Marisol R.`, `Priya N.`, `Kelly D.`)
  - `/Users/isanguyen/her-estrogen/app.jsx` lines 69-108 (5 case studies labeled `PLACEHOLDER content. Replace with real, consented patient stories`)
  - `/Users/isanguyen/her-estrogen/app.jsx` lines 698-700 ("4.9 ★★★★★ Across 2,840 verified patients")
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 226-242 (3 testimonials: `Sarah M.`, `Jennifer K.`, `Michelle R.`)
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 269-280 (8 case studies labeled `PLACEHOLDER content; replace with real, consented patient quotes before scale.`)
  - `/Users/isanguyen/her-estrogen/results.jsx` lines 63, 84, 103, 122, 141 (per-product "reviewCount" of "3,210", "2,847", "1,964", "1,412", "892" — implied review counts on a pre-launch site)
- **Risk:** Re-emphasizes C-06: the comments in code explicitly identify the testimonials and case studies as **placeholder content** for a pre-launch site that has no real patients yet. "4.9 ★★★★★ Across 2,840 verified patients" (app.jsx line 698-700) and per-product review counts in the thousands are demonstrably false. Under the 2024 FTC Trade Regulation Rule on the Use of Consumer Reviews and Testimonials (16 CFR Part 465), fake reviews and false review counts each carry civil-penalty liability up to ~$51K per violation. Each individual fake review = a separate violation.
- **Recommended fix:** Remove every placeholder testimonial, case study, star rating, and review count before any visitor reaches the site. Do not reintroduce until each entry is from a named, consenting customer with documented permission and accompanied by typicality disclosure.
- **Citation:** 16 CFR Part 465 (eff. Oct 21 2024); 16 CFR Part 255; FTC Act §5.

### H-14 "Guaranteed 4-hour response during business hours" / "Approved in 24 Hours" / "Same-day reply" service-level claims
- **Area:** FTC §5 / state telehealth
- **Files:**
  - `/Users/isanguyen/her-estrogen/results.jsx` line 178 ("Guaranteed 4-hour response during business hours")
  - `/Users/isanguyen/her-estrogen/results.jsx` line 216 ("guaranteed 4-hour response during business hours")
  - `/Users/isanguyen/her-estrogen/app.jsx` line 390 ("Approved in 24 Hours.")
  - `/Users/isanguyen/her-estrogen/app.jsx` line 668 ("Same-day reply" comparison row)
  - `/Users/isanguyen/her-estrogen/results.jsx` line 213 ("Most prescriptions are approved in under 24 hours.")
  - `/Users/isanguyen/her-estrogen/confirmation.html` lines 178-180, 189 (covered in H-07)
- **Risk:** "Guaranteed" service-level promises are FTC §5 deception risks when a single missed SLA can support a class action or attorney-general action. "Approved in 24 Hours" further implies guaranteed clinical approval, contradicting Terms §6 ("Providers may deny treatment at their sole medical discretion") — also independent FDA/state-board concern because it suggests the clinician encounter is a rubber stamp.
- **Recommended fix:** Drop "guaranteed" and "approved in 24 hours." Use "typically reviewed within 24-48 hours" / "average response 4 business hours" with clear "subject to clinician availability and clinical appropriateness" caveats. Reconcile with Terms §6.
- **Citation:** FTC §5; state medical-board advertising rules.

### H-15 "Refund if not approved" framing throughout results page conflicts with Terms §8 post-shipment no-refund policy and may trigger FTC ROSCA "negative option" issues
- **Area:** Subscription / FTC ROSCA / California ARL
- **Files:**
  - `/Users/isanguyen/her-estrogen/results.jsx` line 879 ("If our licensed provider reviews your intake and determines HRT is not right for you — you receive a complete refund within 3 business days. It's that easy.")
  - `/Users/isanguyen/her-estrogen/results.jsx` line 1105 ("you receive a complete refund within 3 business days. No questions asked. Once your plan period begins and medication has shipped, our standard plan terms apply.")
  - `/Users/isanguyen/her-estrogen/results.jsx` line 263 ("you will receive a full refund of your subscription payment. No questions asked.")
  - `/Users/isanguyen/her-estrogen/terms.html` §8 (refund only if not approved or if cancelled before shipment; nothing after shipment)
- **Risk:** Charging $507-$1,716 upfront for a 3/6/12-month subscription, with refund **only** if (a) the clinician declines, or (b) the patient cancels before shipment, and **no refund** after the first shipment, is the textbook FTC "negative option" / "thank-you-for-paying" fact pattern the 2024 Click-to-Cancel rule is designed to police. California ARL §17602 and many AG offices have similar views. The marketing copy frames the refund as a broader guarantee than Terms §8 actually delivers — itself FTC §5 deception.
- **Recommended fix:** (a) Align marketing copy with Terms (or amend Terms) so customers know the refund window closes when the first medication ships. (b) Build clear-and-conspicuous renewal disclosures at checkout (H-09). (c) Build an online self-serve cancel UI. (d) Have counsel review the entire negative-option flow against the Oct 2024 rule before launch.
- **Citation:** 16 CFR Part 425 (FTC Negative Option Rule); Cal. Bus. & Prof. §17602; 15 USC §8401-8405.

### H-16 SMS consent on the quiz capture form is implicit ("We will text and email"), not the explicit TCPA-compliant disclosure
- **Area:** Email marketing / TCPA / state mini-TCPAs
- **Files:**
  - `/Users/isanguyen/her-estrogen/quiz.html` line 327 ("We will text and email your candidacy summary and the link to finish your medical intake. No spam, ever.")
  - `/Users/isanguyen/her-estrogen/quiz.html` lines 809-817 (Phone input, no inline disclosure)
- **Risk:** Phone number is captured with the intro line "We will text and email …" but the actual phone input has no disclosure. TCPA requires "express written consent" for marketing autodialer / pre-recorded SMS that includes: identification of the sender, "Msg & data rates apply," "Reply STOP to opt out / HELP for help," "Consent is not a condition of purchase," and the type/frequency of messages. None of these appears at the point of capture. Florida FTSA and Washington WA-CPA are even stricter.
- **Recommended fix:** Add an inline disclosure adjacent to the phone field with all the required elements and either a checkbox or a button-label that constitutes affirmative consent ("By tapping Continue you consent to recurring marketing SMS from Her Estrogen, msg/data rates apply, reply STOP to opt out — consent not required to purchase"). Persist a per-user consent record + timestamp + jurisdiction in Supabase or Klaviyo. Confirm SMS provider honors STOP/HELP.
- **Citation:** 47 USC §227; 47 CFR §64.1200; Fla. Stat. §501.059; RCW 19.190.

### H-17 No "Notice of Collection" or consent checkbox precedes quiz submission
- **Area:** Privacy / consent
- **Files:** `/Users/isanguyen/her-estrogen/quiz.html` lines 882-891 (Continue / Submit button); no "I agree to privacy + terms" checkbox; footnote "Your answers are private and HIPAA-protected" (line 891) is not a consent mechanism.
- **Risk:** CCPA/CPRA require a "Notice at Collection" before/at the point personal information is collected. Washington MHMDA requires explicit, opt-in **authorization** for collecting consumer health data — quiz answers about menopause stage, symptoms, hormone therapy history are unambiguously consumer health data. The current form collects them on click with only a footnote.
- **Recommended fix:** Add an inline Notice at Collection link to privacy.html, plus a separate WA MHMDA authorization checkbox surfaced for visitors with WA addresses/geolocation (and ideally everyone). Persist authorization records (timestamp, IP, jurisdiction, text version) for at least the duration MHMDA requires plus audit period.
- **Citation:** Cal. Civ. Code §1798.100(b); RCW 19.373.030; CPRA Regulations §7012.

### H-18 No state geofencing on a national-by-default site; service may be advertised in states where the operating model is not yet licensed
- **Area:** State telehealth / pharmacy
- **Files:** `/Users/isanguyen/her-estrogen/results.jsx` line 267 (`US_STATES` list of 50 minus a few — and even those omissions look incidental); `/Users/isanguyen/her-estrogen/terms.html` line 178, 182 ("Reside within the United States. Our services are available only within the United States.")
- **Risk:** Marketing nationwide without verifying that OpenLoop has licensed prescribers in every state to which medication can ship is an FTC §5 risk (advertising a service that cannot be delivered) and a state-pharmacy-board risk in any state where the model is non-compliant. Terms §6 ("State specific prescribing laws") implicitly acknowledges this but does not gate access.
- **Recommended fix:** Add a state selector early in the funnel; collect state at intake; block checkout in states where the model is not yet licensed; document the licensing matrix internally.
- **Citation:** FTC §5; state Medical Practice Acts; state Boards of Pharmacy.

### H-19 "Bioidentical HRT" and "custom-compounded medication" language conflicts with the "FDA-approved" framing — compounded HRT is NOT FDA-approved
- **Area:** FDA / FTC §5
- **Files:**
  - `/Users/isanguyen/her-estrogen/results.jsx` line 251 ("custom-compounded medication"), line 255 ("Bioidentical HRT requires a prescription"), line 1182 ("Compounded medications are not FDA-evaluated for safety or efficacy as finished products.")
  - `/Users/isanguyen/her-estrogen/app.jsx` line 128 ("modern bioidentical HRT"), line 148 ("bioidentical estrogen, progesterone, or testosterone")
- **Risk:** Bioidentical (cBHRT) compounded hormone therapy is **not** FDA-approved as a finished product (the FDA's 2020 position: only specific bioidentical molecules, e.g. estradiol, micronized progesterone, are FDA-approved as branded/generic products from approved manufacturers; mass-marketed pharmacy-compounded BHRT is not). Mixing "FDA-approved" claims with "custom-compounded" and "bioidentical" language in the same page is materially misleading. FDA has issued warning letters to telehealth-compounding marketers for exactly this combination.
- **Recommended fix:** Decide and disclose: is the product line FDA-approved branded/generic estradiol/progesterone (in which case stop saying "custom-compounded"), or is it pharmacy-compounded BHRT (in which case stop saying "FDA-approved")? Counsel-cleared copy in either direction.
- **Citation:** FDA Drug Safety Communications on cBHRT (2020); FDA Warning Letters to telehealth-compounding companies 2022-2024; FTC §5.

### H-20 GitHub Desktop mirror at `/Users/isanguyen/Documents/GitHub/her-estrogen/` contains `.env.local` and has its own `.git`
- **Area:** Code-level security
- **Files:** `/Users/isanguyen/Documents/GitHub/her-estrogen/.env.local` (present, observed via `ls`); `/Users/isanguyen/Documents/GitHub/her-estrogen/.git/`
- **Risk:** CLAUDE.md (source repo) instructs rsync from source to the GitHub Desktop folder, **excluding** `.git/` but NOT `.env.local`. The `.env.local` file is present in the mirror. If the mirror's `.gitignore` does not also exclude `.env.local`, GitHub Desktop will have staged it on at least one historic sync — and pushing it would expose the keys publicly. This compounds C-01.
- **Recommended fix:** (a) Verify the mirror's `.gitignore` contains `.env.local`. (b) Run `git -C /Users/isanguyen/Documents/GitHub/her-estrogen log --all -- .env.local` to confirm it was never committed. If it was, rotate every key (Supabase service role, Klaviyo private, Stripe secret, OpenLoop webhook, Prescription update token) AND scrub history (BFG / git filter-repo) AND make the GitHub repo private if it isn't. (c) Add `.env.local` to the rsync `--exclude` list in CLAUDE.md.
- **Citation:** HIPAA Security Rule 45 CFR §164.308(a)(1)(ii)(A) risk analysis; FTC Safeguards Rule 16 CFR Part 314.

### H-21 React + Babel-standalone + ReactDOM loaded from `unpkg.com` CDN — with SRI hashes pinned to a single sub-resource version, but only on quiz.html
- **Area:** Code-level security / supply chain
- **Files:**
  - `/Users/isanguyen/her-estrogen/quiz.html` lines 267-269 (SRI integrity attributes present)
  - `/Users/isanguyen/her-estrogen/index.html`, `/Users/isanguyen/her-estrogen/results.html` — verify SRI present (Phase 2 indicates quiz uses `react@18.3.1`, `react-dom@18.3.1`, `@babel/standalone@7.29.0` with `integrity` and `crossorigin`).
- **Risk:** Even with SRI, an in-production healthcare site relying on Babel-standalone runtime compilation in the browser is slow AND ties stability to unpkg's uptime. CDN compromise + missing SRI on any page = supply-chain attack. Mitigation is partial because the integrity attribute pins a specific version's content hash, but Babel-in-browser is a compliance soft-spot and a real-user-monitoring red flag.
- **Recommended fix:** Move to a real build pipeline (Vite / Next.js / esbuild) and self-host the bundle. Pin SRI hashes on every remaining CDN script across all HTML files. Add a CSP `script-src` allowlist (see H-04 CSP fix).
- **Citation:** OWASP Top 10 A06:2021 Vulnerable and Outdated Components; OWASP Secure Headers Project.

## Additional MEDIUM Findings

### M-13 Sitemap declares `https://herestrogen.com/` and `https://herestrogen.com/quiz.html` priority 0.9 — quiz.html title is "Where are you in the menopause journey?"
- **Area:** Privacy / search engine optics
- **Files:** `/Users/isanguyen/her-estrogen/sitemap.xml` lines 11-16; `/Users/isanguyen/her-estrogen/quiz.html` line 277 (`title: 'Where are you in the menopause journey?'` — note this is the React step title, not the `<title>` tag).
- **Risk:** The actual `<title>` of quiz.html is `Personalized Women's HRT Care` (inherited from index.html template? — verify) but the open graph / page content shows menopause-stage prompts. Google's snippet of quiz.html may reveal health-condition focus to anyone the URL is shared with. Combined with sitemap priority 0.9, the page is heavily promoted to search.
- **Recommended fix:** Drop quiz.html from sitemap (it should only be reached by funnel entry); add `<meta name="robots" content="noindex">` to quiz.html; verify no health condition appears in the URL or query string.

### M-14 `terms.html` §7 says payments processed by Stripe; site reality is that OpenLoop processes live payments
- **Area:** Privacy / terms
- **Files:** `/Users/isanguyen/her-estrogen/terms.html` §7 (line 221-224)
- **Risk:** Terms §7 misstates the processor. Privacy.html §5 lists Stripe as a business associate. If OpenLoop is the actual processor, both legal documents misidentify a critical data flow recipient. CCPA enumeration of third-party recipients is wrong; HIPAA NPP is wrong; cardholder data flow disclosed to the wrong entity.
- **Recommended fix:** Reconcile codebase comment (`api/orders/placed.js` lines 10-13) with legal docs. If OpenLoop processes payments, name OpenLoop and disclose the payment processor it uses; remove Stripe references from privacy/terms (or accurately describe the dormant Stripe scaffold).

### M-15 `terms.html` §9 says marketing SMS sent "where separately consented" but the site has no separate SMS consent UI
- **Area:** TCPA / state mini-TCPAs
- **Files:** `/Users/isanguyen/her-estrogen/terms.html` §9 (lines 247-258); `/Users/isanguyen/her-estrogen/quiz.html` line 327 (only mention of texting)
- **Risk:** Terms promise separate SMS consent that the UI does not collect. See H-16.

### M-16 `app.jsx` line 358 — "Backed by 30+ years of clinical research" + line 1116 "Backed by clinical research from" — research is implicit, sources not displayed
- **Area:** FTC §5 substantiation
- **Files:** `/Users/isanguyen/her-estrogen/app.jsx` line 358; `/Users/isanguyen/her-estrogen/results.jsx` line 1116
- **Risk:** Claims to specific research provenance ("30+ years", "Backed by clinical research from [logos?]") require named, accessible citations. If a row of journal/institution logos is implied but they have no relationship to Her Estrogen, that's an FTC §5 concern.
- **Recommended fix:** Display the cited bodies (NAMS, IMS, FDA, WHI, KEEPS, ELITE) and link to their guidance, or remove the claim.

### M-17 FAQ implies in-house clinicians ("Her Estrogen connects you with licensed physicians and nurse practitioners …"); reality is OpenLoop network
- **Area:** State medical-board / FTC §5
- **Files:** `/Users/isanguyen/her-estrogen/results.jsx` line 247 (FAQ answer mentions OpenLoop only as a passing reference; the rest of the copy speaks in first person about "Her Estrogen providers"); `/Users/isanguyen/her-estrogen/results.jsx` line 172, 184, 212-216 (repeats "Her Estrogen provider"); `/Users/isanguyen/her-estrogen/confirmation.html` line 189 ("board-certified, licensed Her Estrogen provider")
- **Risk:** Calling OpenLoop's network "Her Estrogen providers" misrepresents the corporate-practice structure, an issue in CA, NY, TX, IL, NJ and other CPOM states.
- **Recommended fix:** Replace "Her Estrogen provider" with "a licensed clinician via our medical partner, OpenLoop Health" everywhere it appears.

### M-18 Bundle upsell "at no extra cost" but the bundle is the same flat plan price
- **Area:** FTC §5 / pricing-claim accuracy
- **Files:** `/Users/isanguyen/her-estrogen/results.jsx` line 956 ("Add FDA-approved Progesterone Pill to your {med.name} — at no extra cost.")
- **Risk:** "At no extra cost" is fine if literal, but the user has already committed to a flat-tier price ($507/$912/$1,716); the framing nudges towards bundling that has no cost-to-customer math behind it. Confirm the offering is genuinely cost-equal under all plans and that adding the bundle does not trigger a price-tier change at renewal.
- **Recommended fix:** Verify; if true, add "(same plan price)" inline; if not strictly true, rewrite.

### M-19 Vercel Analytics is loaded on every page including legal/privacy pages
- **Area:** HIPAA tracking technologies
- **Files:** `/Users/isanguyen/her-estrogen/index.html` lines 2578-2580; `/Users/isanguyen/her-estrogen/privacy.html` lines 168-170; `/Users/isanguyen/her-estrogen/terms.html` lines 154-156
- **Risk:** Vercel Web Analytics aggregates per-page hit counts and IP/UA-derived metrics. Vercel publishes a privacy posture but does not generally enter into a HIPAA BAA on its standard analytics product; if your account doesn't have a BAA for the analytics tier, this is the same tracking-tech-disclosure risk as Meta Pixel + GA. The risk is lower because Vercel Analytics is by default cookieless and aggregated, but it still discloses page-path + IP-derived geographic data.
- **Recommended fix:** Confirm BAA status with Vercel for the analytics product (default: none). If no BAA, either disable on health pages or accept residual risk after counsel review.

### M-20 `confirmation.html` step "Provider review … within 24 hours" line conflicts with `results.jsx` line 1199 "review within 24 hours" but app.jsx line 140 says "within 48 hours" and quiz.html line 700-706 says "within 48 hours"
- **Area:** FTC §5 internal-consistency
- **Files:** confirmation.html line 179, 189; results.jsx lines 172, 213, 1199; quiz.html line 702-706; app.jsx line 140-151
- **Risk:** Inconsistent SLA promises across pages — 24 vs 48 hours. Any version is an FTC §5 risk if not consistently met (see H-07/H-14). Consistency is the floor.
- **Recommended fix:** Pick one number, soften the framing ("typically", "within X-Y business days"), apply everywhere.

### M-21 Quiz reads `recommended_product` from URL/localStorage and sends to checkout — possible for symptom-revealing values to land in `recommended_product` slug
- **Area:** HIPAA tracking-technologies / Meta Pixel
- **Files:** `/Users/isanguyen/her-estrogen/results.jsx` lines 282-371, 579-583, 705-706
- **Risk:** The quiz answers are stored client-side in `localStorage.herestrogen_quiz`, used to pick a product, and that product slug is sent to `/api/checkout`. If `customerEmail` and a symptom-revealing product slug are both in flight at the moment Meta Pixel's `InitiateCheckout` event fires (results.html line 1667), Meta could see the inferred condition. Currently the slug is generic ("estradiolGel", etc.), which mitigates — but any future slug like "estradiol-gel-for-hot-flashes" would push into PHI territory.
- **Recommended fix:** Audit the slugs end-to-end; ensure no symptom or condition leaks into URLs, query strings, or pixel event params.

### M-22 Quiz birthday selector hard-codes age range 21-86 — does not gate minors at the API
- **Area:** COPPA / state minor-consent
- **Files:** `/Users/isanguyen/her-estrogen/quiz.html` lines 344-345 (BIRTH_YEAR_MIN=1940; BIRTH_YEAR_MAX=current-21); `/Users/isanguyen/her-estrogen/api/quiz/submit.js` lines 53-67 (same parseBirthday validation)
- **Risk:** Server enforces year-only gate. A 21-year-old female is not a typical HRT candidate (the clinical population is generally 40+); a teen would not be served by the dropdown but could spoof birthday via direct API call. Both serve the same UI but the implicit "must be 21+" cutoff is not stated as a Notice anywhere. COPPA only applies under 13 but state laws (CA SB 976) increasingly target under-18 in health data contexts.
- **Recommended fix:** Add an explicit age affirmation at the quiz, and a Notice that the service is for adults 18+ (matching Terms §2).

### M-23 `index.html` Title is "Personalized Women's HRT Care" — already condition-revealing in browser history / open tabs / social shares
- **Area:** HIPAA tracking-technologies / privacy
- **Files:** `/Users/isanguyen/her-estrogen/index.html` line 6
- **Risk:** Anyone who has the site open or who shares the URL exposes "HRT" in the page title. Marketing optics issue rather than a hard compliance gap, but worth documenting given the tracking-technologies context.
- **Recommended fix:** Consider softening the title for SEO/share purposes (e.g. "Her Estrogen — Women's Hormone Care").

## Additional LOW Findings

### L-08 `index.html` and `results.html` accessibility — landmarks/labels not yet validated
- **Area:** ADA Title III
- **Files:** entire HTML files
- **Risk:** No formal accessibility audit has been performed. Quiz form fields have `<label>` and `aria-label` on the birthday selects (good). The case-study photos use `alt={r.name}` (results in alt text of "Marisol R." — not descriptive). `index.html` heading hierarchy and color contrast (`var(--muted) #7a6770` on white passes 4.5:1; `var(--pink) #b8235c` on `#fde8ef` light pink may not) need automated + manual scan.
- **Recommended fix:** Run axe-core or Lighthouse a11y audit; remediate color-contrast violations; add descriptive alt text; verify keyboard nav across the quiz flow.

### L-09 Quiz birthday dropdowns lack a single `<fieldset>` + `<legend>` grouping
- **Area:** ADA Title III / screen-reader UX
- **Files:** `/Users/isanguyen/her-estrogen/quiz.html` lines 822-878
- **Risk:** Three separate selects with separate `aria-label`s rather than a grouped fieldset; screen readers may announce them less clearly. Per-select aria-labels are present which is acceptable but not optimal.
- **Recommended fix:** Wrap in `<fieldset><legend>Birthday</legend>...</fieldset>` and the `.helper` becomes `aria-describedby` for the legend.

### L-10 Confirmation page has no `<main>` landmark or skip-link
- **Area:** ADA Title III
- **Files:** `/Users/isanguyen/her-estrogen/confirmation.html` lines 167-209
- **Risk:** Page has `<main class="wrap">` (good) but no skip-to-content link and no h1 visible until after the eyebrow.

### L-11 No state field on the quiz contact step
- **Area:** Telehealth licensing / data minimization tradeoff
- **Files:** `/Users/isanguyen/her-estrogen/quiz.html` lines 773-879
- **Risk:** State is needed for licensing (H-18) but adds another PI element. Recommend adding state AFTER consent and explicitly gating service availability.

### L-12 `subscription_started_at`, `next_billing_date` columns in `patients` schema not populated by current OpenLoop webhook flow
- **Area:** Data integrity
- **Files:** `/Users/isanguyen/her-estrogen/supabase/schema.sql` lines 51-52; `/Users/isanguyen/her-estrogen/api/orders/placed.js` does not write to Supabase at all (only fires Klaviyo)
- **Risk:** Patient lifecycle columns may end up empty in production. Doesn't directly affect compliance but is a reliability/audit gap. The ARL renewal-reminder regime requires knowing the next-renewal date — that data is now in Klaviyo only.
- **Recommended fix:** Either pull renewal date from OpenLoop on placed/cancelled events into Supabase, or accept Klaviyo as source of truth and update the schema doc.

# Phase 3 — Git History Secret Scan (appended 2026-05-25)

**Status: BLOCKED.** The audit sandbox denies `git` invocations under `/Users/isanguyen/her-estrogen/` and `/Users/isanguyen/Documents/GitHub/her-estrogen/`. Phase 3 commands could not be run in this session. The following queries are recorded as **REQUIRED TO RUN MANUALLY** by Vincent before launch:

```bash
# 1. Confirm .env.local was never committed to the source repo
git -C /Users/isanguyen/her-estrogen log --all --full-history -- .env.local .env

# 2. Confirm same for the GitHub-Desktop mirror
git -C /Users/isanguyen/Documents/GitHub/her-estrogen log --all --full-history -- .env.local .env

# 3. Scan history for leaked secrets
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'sk_live'
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'sk_test'
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'pk_RUvm7K_'
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'service_role'
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'SUPABASE_SERVICE_ROLE_KEY'
git -C /Users/isanguyen/her-estrogen log --all --oneline -S 'eyJ'   # any JWT

# Same battery against the mirror
git -C /Users/isanguyen/Documents/GitHub/her-estrogen log --all --oneline -S 'sk_live'
# ... repeat ...

# 4. Tooling
brew install gitleaks
gitleaks detect --source /Users/isanguyen/her-estrogen --no-banner
gitleaks detect --source /Users/isanguyen/Documents/GitHub/her-estrogen --no-banner
```

If any of these return a match: rotate every implicated key, run `git filter-repo` to scrub the commits, force-push, and if the GitHub remote is public, treat all keys as fully compromised. See **C-01** and **H-20**.

# Phase 4 — Executive Summary Finalization (appended 2026-05-25)

**Final counts:**

| Severity | Count |
|----------|-------|
| CRITICAL | 11 |
| HIGH     | 21 |
| MEDIUM   | 23 |
| LOW      | 12 |

**Top 5 things Vincent must fix before paid traffic (FINAL):**

1. **Remove Meta Pixel, Google Analytics, and Vercel Analytics from every health-context URL** — quiz.html, results.html, confirmation.html, privacy.html, terms.html. (C-03, C-08, M-19) Replace with server-side conversion API only after counsel + Meta healthcare-policy review.
2. **Rotate every secret in `.env.local`** (Supabase service-role JWT, Klaviyo private API key, Stripe secret + webhook secret, OpenLoop webhook secret, Prescription update token). Confirm none were ever committed to either git repo (run Phase 3 commands). Add `.env.local` to the rsync exclude list in CLAUDE.md. (C-01, H-20)
3. **Confirm BAAs:** Supabase HIPAA add-on; Klaviyo (likely needs business-product BAA); OpenLoop; pharmacy partner; Vercel (for hosting + analytics). Until Klaviyo BAA is confirmed, **fix the server to honor `KLAVIYO_SEND_HEALTH_DATA=false`** by stripping symptom/stage/DOB from `/api/quiz/submit.js`. (C-02, C-09, M-04)
4. **Remove all fabricated testimonials, case studies, star ratings, and review counts** (per-product `reviewCount`, "2,840 verified patients") before any visitor lands. (C-06, H-13) The 2024 FTC Reviews Rule carries ~$51K per-violation civil penalties.
5. **Rewrite privacy.html and terms.html with counsel** — CCPA/CPRA + Washington MHMDA + HIPAA NPP + cookie banner + Do Not Sell or Share + processor enumeration + state-specific subscription/ARL/Click-to-Cancel disclosures + FDA Important Safety Information + black-box warning everywhere a product is named. (C-04, C-05, C-10, H-09, H-15)

Honorable mention (also pre-launch blockers):
- Add explicit TCPA-compliant SMS consent at the point of phone capture. (H-16)
- Reframe results.html so a clinician — not the algorithm — is the first to recommend a specific FDA-approved product. (C-10)
- Implement a cookie/consent banner that honors Global Privacy Control. (C-07)
- Add CSP, HSTS, X-Frame-Options security headers in vercel.json. (H-04)
- Pin CORS to `https://herestrogen.com` everywhere and remove the wildcard from webhook endpoints. (H-01)
- Add rate limiting + bot-protection to `/api/quiz/submit` and `/api/checkout`. (H-02)

---

_Audit finalized 2026-05-25. Phase 5 (rsync to GitHub Desktop mirror) is documented below; it must be performed manually because the rsync command is blocked from the audit sandbox._

# Phase 5 — Mirror to GitHub Desktop (manual step)

The CLAUDE.md sync workflow requires:

```bash
rsync -av --delete \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  --exclude='.env.local' \
  --exclude='.env' \
  /Users/isanguyen/her-estrogen/ \
  /Users/isanguyen/Documents/GitHub/her-estrogen/
```

**Important addition (this audit's recommendation):** explicitly `--exclude='.env.local'` and `--exclude='.env'`. The current CLAUDE.md does not include those excludes, which is how `.env.local` ended up in the mirror folder. After this sync the audit report `audit/COMPLIANCE_AUDIT.md` will be visible in GitHub Desktop and can be committed + pushed.

_End of audit report._
