const { useState, useEffect } = React;

const SYMPTOMS = [
{ id: 'hot', name: 'Hot flashes', note: 'Sudden warmth, flushing', glyph: 'H' },
{ id: 'sleep', name: 'Sleep disruption', note: 'Night waking, insomnia', glyph: 'S' },
{ id: 'mood', name: 'Mood shifts', note: 'Anxiety, irritability', glyph: 'M' },
{ id: 'brain', name: 'Brain fog', note: 'Focus, recall', glyph: 'B' },
{ id: 'sex', name: 'Low libido', note: 'Drive, arousal', glyph: 'L' },
{ id: 'skin', name: 'Dry skin & hair', note: 'Texture, elasticity', glyph: 'D' },
{ id: 'weight', name: 'Weight & energy', note: 'Midsection, fatigue', glyph: 'W' },
{ id: 'cycle', name: 'Irregular cycles', note: 'Heavier, lighter, missed', glyph: 'C' }];


const TREATMENTS = [
{
  id: 'gel',
  eyebrow: 'FDA-Approved · Most Prescribed',
  name: 'Estradiol Gel',
  subtitle: 'Applied once daily to skin',
  features: [
  ['Application', 'Once daily — inner arm or thigh']],
  image: 'assets/estradiol-gel.png'
},
{
  id: 'patch',
  eyebrow: 'FDA-Approved · No Daily Routine',
  name: 'Estradiol Patch',
  subtitle: 'Applied twice weekly',
  features: [
  ['Application', 'Twice weekly — adhesive patch']],
  image: 'assets/estradiol-patch.png?v=2'
},
{
  id: 'pill',
  eyebrow: 'FDA-Approved · Oral Option',
  name: 'Estradiol Pill',
  subtitle: 'One tablet taken daily',
  features: [
  ['Application', 'Once daily — oral tablet']],
  image: 'assets/estradiol-pill.png'
},
{
  id: 'dhea',
  eyebrow: 'FDA-Approved · Vaginal Health',
  name: 'Estradiol Vaginal Cream',
  subtitle: 'Applied locally as directed',
  features: [
  ['Application', 'Vaginal cream — as directed'],
  ['Form', 'Estrace Vaginal Cream']],
  image: 'assets/estradiol-vaginal-cream.png'
},
{
  id: 'progesterone',
  eyebrow: 'FDA-Approved · Sleep + Protection',
  name: 'Progesterone Pill',
  subtitle: 'One capsule taken nightly',
  features: [
  ['Application', 'Nightly oral pill — at bedtime'],
  ['Dose', '100 mg or 200 mg as prescribed']],
  image: 'assets/progesterone-pill.png'
}];


// REVIEWS / CASE STUDIES — REMOVED (audit findings C-06, H-13).
// Pre-launch site has no real patients; fabricated reviews + per-product
// review counts + "X verified patients" claims trigger the FTC 2024 Reviews
// Rule (16 CFR Part 465) and FTC Endorsement Guides (16 CFR Part 255).
// Do NOT reintroduce until each entry is from a named, consenting customer
// with documented permission and typicality disclosure.
const REVIEWS = [];
const CASE_STUDIES_HOME = [];

// Educational section data — "Why HRT" comparison rows
const HRT_COMPARISON = [
  { icon: '🌡️', problem: 'Hot flashes waking you up at 3am',              fix: 'Estrogen regulates your body temperature — most women see relief within 7 days' },
  { icon: '🌙', problem: "Can't sleep through the night",                 fix: 'Progesterone promotes deep, natural sleep — taken nightly at bedtime' },
  { icon: '🧠', problem: 'Brain fog and memory lapses',                   fix: 'Estrogen fuels cognitive function — clarity returns as levels stabilize' },
  { icon: '💭', problem: 'Mood swings, anxiety, irritability',            fix: 'Estrogen regulates serotonin and dopamine — mood stabilizes within weeks' },
  { icon: '⚖️', problem: "Weight gain that won't move",                   fix: 'Hormonal balance restores healthy metabolism and muscle composition' },
  { icon: '🦴', problem: 'Joint pain and stiffness',                      fix: 'Estrogen has anti-inflammatory properties — joint comfort improves over months' },
  { icon: '✨', problem: 'Hair thinning and skin aging',                  fix: 'Estrogen maintains collagen — skin and hair improve with consistent HRT' },
  { icon: '❤️', problem: 'Low libido and loss of intimacy',               fix: 'Restored hormones revive desire, sensitivity, and connection' },
  { icon: '💧', problem: 'Vaginal dryness and painful sex',               fix: 'Estradiol vaginal cream restores tissue health and moisture locally' },
  { icon: '💗', problem: 'Heart palpitations and anxiety spikes',         fix: 'Estrogen protects cardiovascular function — palpitations resolve' },
  { icon: '🩻', problem: 'Bone loss and fracture risk',                   fix: 'Estrogen is your primary bone protector — HRT stops bone density decline' },
  { icon: '🪞', problem: 'Feeling like a stranger in your own body',      fix: 'Balanced hormones restore your sense of self — women describe it as "coming home"' }
];


const FAQ = [
{ q: 'Is hormone therapy right for me?', a: 'Hormone therapy is not appropriate for everyone. A licensed clinician via our medical partner, OpenLoop Health, reviews your personal and family history, current medications, and clinical history before deciding whether to prescribe. Estrogen-containing products carry FDA boxed warnings, including for endometrial cancer, cardiovascular events (stroke, heart attack, blood clots), probable dementia, and (in combination with progestins) breast cancer — discuss the risks and benefits with your clinician. See the Important Safety Information at the bottom of this page.' },
{ q: 'Do I need bloodwork to start?', a: 'Not always. Symptom-based prescribing is supported by current guidelines for many patients, and your clinician may order labs (such as FSH, estradiol, thyroid, lipids) when it changes the plan. Labs are available at-home or at any Quest location.' },
{ q: 'What if I have a history of breast cancer or clots?', a: 'These histories require a careful, individualized conversation. Some patients are still candidates for local-only therapy; others are not. The clinician will be direct about what can and cannot be prescribed.' },
{ q: 'How much does it cost?', a: 'All Her Estrogen plans share the same pricing: $507 for 3 months ($169/mo), $912 for 6 months ($152/mo, save $102), or $1,716 for 12 months ($143/mo, save $312/year). Every plan includes the clinician consultation, unlimited messaging during your plan, check-ins, and free shipping. Treatment is subject to clinician approval and is not guaranteed. We do not bill insurance, but plans can be paid with HSA/FSA. Subscriptions automatically renew at the same price unless cancelled before the renewal date; see Terms §7 for renewal and cancellation details.' },
{ q: 'Can I use my own pharmacy?', a: 'Yes. We can route your prescription to the partner pharmacy or to any local pharmacy you prefer.' },
{ q: 'How quickly will I feel different?', a: 'Individual results vary. Some patients report changes in sleep and vasomotor symptoms within several weeks; others take longer or do not respond. Dose adjustments are decided by the clinician based on how you are feeling.' }];


const TIMELINE_STEPS = [
{
  eyebrow: 'Step 01',
  title: 'Submit your intake',
  body: "Complete a brief medical and symptom intake written by women's-health clinicians. A licensed clinician via our medical partner, OpenLoop Health, reviews your information — typically within 1–2 business days.",
  image: 'woman smiling at her phone, completing the intake',
  src: 'assets/step-1-get-approved.jpg',
  meta: '~ 10 min to complete'
},
{
  eyebrow: 'Step 02',
  title: 'Clinician review',
  body: "If hormone therapy is clinically appropriate, your clinician designs a protocol based on your symptoms, history, and goals. Hormone therapy is not appropriate for everyone; the clinician retains discretion to decline.",
  image: 'clinician on a video call, writing your prescription',
  src: 'assets/step-2-get-prescribed.jpg',
  meta: 'Typically reviewed within 1–2 business days'
},
{
  eyebrow: 'Step 03',
  title: 'Receive your medication',
  body: "If a clinician prescribes, your medication is shipped from a licensed pharmacy partner in discreet packaging. Shipping windows vary by state.",
  image: 'patient receiving her package at the door',
  src: 'assets/step-3-receive-medication.jpg?v=2',
  meta: 'Free shipping'
}];


function Timeline() {
  const [fillPct, setFillPct] = React.useState(0);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [visible, setVisible] = React.useState([false, false, false]);
  const railRef = React.useRef(null);
  const nodeRefs = React.useRef([]);
  const cardRefs = React.useRef([]);

  React.useEffect(() => {
    let rafId = null;
    let pending = false;

    const compute = () => {
      pending = false;
      const rail = railRef.current;
      if (!rail) return;
      const r = rail.getBoundingClientRect();
      const vh = window.innerHeight;
      const anchor = vh * 0.55;
      // how far into the rail the anchor line has descended
      const raw = (anchor - r.top) / r.height;
      const pct = Math.max(0, Math.min(1, raw));
      setFillPct(pct * 100);

      // activate nodes whose center is above the anchor line
      let lastActive = -1;
      nodeRefs.current.forEach((n, i) => {
        if (!n) return;
        const nr = n.getBoundingClientRect();
        if (nr.top + nr.height / 2 < anchor) lastActive = i;
      });
      setActiveIdx(lastActive);

      // fade-in cards near viewport (staggered for smoother flow)
      const nextVis = visible.slice();
      let changed = false;
      cardRefs.current.forEach((c, i) => {
        if (!c || nextVis[i]) return;
        const cr = c.getBoundingClientRect();
        if (cr.top < vh * 0.88) {
          // stagger reveal by 120ms per card index for a smoother cascade
          setTimeout(() => {
            setVisible((prev) => {
              if (prev[i]) return prev;
              const out = prev.slice();
              out[i] = true;
              return out;
            });
          }, i * 120);
          nextVis[i] = true;
          changed = true;
        }
      });
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="how" id="how" data-screen-label="04 How it works">
      <div className="container">
        <div className="how-head">
          <div className="eyebrow">How it works</div>
          <h2>From <em>get approved</em> to medication at your door.</h2>
          <p className="how-intro">
            A streamlined process built around your time. We've taken the
            three things that usually take six months — and made them take a
            week. <strong>You're supported every step.</strong>
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-rail" ref={railRef}>
            <div className="rail-track"></div>
            <div className="rail-fill" style={{ height: fillPct + '%' }}></div>
            {TIMELINE_STEPS.map((_, i) => {
              const top = (i + 0.5) / TIMELINE_STEPS.length * 100;
              return (
                <div
                  key={i}
                  ref={(el) => nodeRefs.current[i] = el}
                  className={'rail-node' + (i <= activeIdx ? ' active' : '')}
                  style={{ top: top + '%' }}>
                </div>);

            })}
          </div>

          <div className="step-rows">
            {TIMELINE_STEPS.map((s, i) => {
              const side = i % 2 === 0 ? 'right' : 'left';
              return (
                <div className={'step-row ' + side} key={i}>
                  <div
                    ref={(el) => cardRefs.current[i] = el}
                    className={'step-card' + (visible[i] ? ' in' : '')}>
                    
                    <div className="step-num">{s.eyebrow}</div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <div className="step-image"><img src={s.src} alt={s.image} className="photo" /></div>
                    <div className="step-meta">{s.meta}</div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>
    </section>);

}

function App() {
  const [selected, setSelected] = useState(new Set(['hot', 'sleep', 'mood']));
  const [activeTreatment, setActiveTreatment] = useState('gel');
  const [openFaq, setOpenFaq] = useState(0);
  const [openStory, setOpenStory] = useState(null);
  const [tableExpanded, setTableExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);
  const collapsedCount = isMobile ? 3 : 7;

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);else next.add(id);
    setSelected(next);
  };

  const tx = TREATMENTS.find((t) => t.id === activeTreatment);
  const progress = selected.size / SYMPTOMS.length * 100;

  return (
    <>
      {/* HERO — bento layout (ported from design-reference v2, reskinned to brand).
          Layout/motion from reference; palette + fonts are 100% ours.
          Headline + sub kept from existing site per spec STEP-1 reuse rule;
          bento tile copy ported verbatim per Vincent's "B" choice. */}
      <section className="hero-bento" data-screen-label="01 Hero">
        <div className="hb-wrap">
          <h1 className="rv">
            Feel like yourself, <em>again.</em>
          </h1>
          <p className="hb-sub rv d1">
            FDA-approved hormone therapy, prescribed by a licensed clinician
            via OpenLoop Health when clinically appropriate. Treatment is
            subject to clinician approval; outcomes vary by individual.
          </p>
          <div className="bento">
            <a className="tile main rv d1" href="quiz.html">
              <div className="blob" aria-hidden="true"></div>
              <div>
                <h3>Start with the 2-minute assessment</h3>
                <div className="pillrow">
                  <span className="pill-chip">No insurance needed</span>
                  <span className="pill-chip">Reviewed in 24–48h</span>
                  <span className="pill-chip">All 50 states</span>
                </div>
              </div>
              <span className="btn btn-primary hb-cta">
                Find my treatment
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </a>
            <a className="tile sleep rv d2" href="quiz.html">
              <svg className="mini-art" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#8a1745" strokeWidth="1.8"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
              <span className="go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <h3>Sleep through the night</h3><p>Night sweats &amp; 3am wakeups</p>
            </a>
            <a className="tile heat rv d3" href="quiz.html">
              <svg className="mini-art" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#b8235c" strokeWidth="1.8"><path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 11-10 0C7 9.5 9 7 12 3z" /></svg>
              <span className="go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <h3>Cool the hot flashes</h3><p>Daytime heat, on your terms</p>
            </a>
            <a className="tile fog rv d3" href="quiz.html">
              <svg className="mini-art" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#5a6b4a" strokeWidth="1.8"><path d="M4 15h12M6 19h14M3 11h18" /></svg>
              <span className="go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <h3>Clear the fog</h3><p>Focus, memory, sharpness</p>
            </a>
            <a className="tile mood rv d4" href="quiz.html">
              <svg className="mini-art" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#b89455" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" /></svg>
              <span className="go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <h3>Steady the moods</h3><p>Feel like you, more often</p>
            </a>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE — ported from reference (text ticker), brand-skinned */}
      <div className="trust-marquee" aria-hidden="true">
        <div className="tm-track">
          <span><i className="tm-dot"></i>FDA-approved medications only</span><span><i className="tm-dot"></i>Licensed clinicians via OpenLoop Health</span><span><i className="tm-dot"></i>Free discreet shipping</span><span><i className="tm-dot"></i>All 50 states</span><span><i className="tm-dot"></i>No insurance needed</span><span><i className="tm-dot"></i>Cancel before any renewal</span>
          <span><i className="tm-dot"></i>FDA-approved medications only</span><span><i className="tm-dot"></i>Licensed clinicians via OpenLoop Health</span><span><i className="tm-dot"></i>Free discreet shipping</span><span><i className="tm-dot"></i>All 50 states</span><span><i className="tm-dot"></i>No insurance needed</span><span><i className="tm-dot"></i>Cancel before any renewal</span>
        </div>
      </div>

      {/* LIFESTYLE STRIP removed — its imagery now lives as the darkened
          background photos inside the hero bento tiles. */}

      {/* EDUCATIONAL CONVERSION SECTION — Why HRT */}
      <section className="edu-section" id="why" data-screen-label="01b Why HRT">
        <div className="container">

          {/* Audit findings M-16: "30+ years of clinical research" claim
              removed pending sourced citations. */}

          {/* 2 — Main headline block */}
          <div className="edu-head">
            <div className="eyebrow">Why Her Estrogen</div>
            <h2>Every woman deserves to feel like <em>herself</em> again.</h2>
            <p className="edu-sub">
              Perimenopause and menopause are common life stages with a wide
              range of symptoms. Her Estrogen provides access — through
              independent licensed clinicians at OpenLoop Health — to
              FDA-approved hormone therapy when clinically appropriate.
            </p>
          </div>

          {/* 3 — Three-column WHY block */}
          <div className="edu-why-grid">
            <div className="edu-why-card">
              <div className="edu-why-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>FDA-Approved Medications.</h3>
              <p>The products we route are FDA-approved branded or generic estradiol and progesterone. No mass-marketed compounded BHRT.</p>
            </div>
            <div className="edu-why-card">
              <div className="edu-why-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Clinician-led intake review.</h3>
              <p>Submit your intake online. A licensed clinician via OpenLoop Health reviews it — typically within 1&ndash;2 business days. Approval is not guaranteed.</p>
            </div>
            <div className="edu-why-card">
              <div className="edu-why-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Care focused on women's hormone health.</h3>
              <p>Clinicians experienced in women's hormone care. Messaging access during your plan; periodic check-ins.</p>
            </div>
          </div>

          {/* Education block — sourced stats only.
              The unsourced "92% relief in 90 days" claim was removed per
              audit finding C-11. Restore only with peer-reviewed citation
              visible at the point of claim. */}
          <div className="edu-education">
            <div className="edu-text">
              <h3>Why hormone therapy is worth a conversation.</h3>
              <p>Estrogen plays a role in sleep, mood, cognition, bone, and metabolic health. When levels change in perimenopause and menopause, symptoms can follow. Hormone therapy is one option among several — a clinician can help you decide whether it is right for you.</p>
            </div>
          </div>

          {/* 5 — Problem vs Solution table */}
          <div className="edu-table-wrap">
            <div className="edu-table-head">
              <h2>What HRT <em>Actually Fixes</em></h2>
              <p className="edu-table-sub">These are not "just part of aging." They are hormone deficiency symptoms — and they are treatable.</p>
            </div>
            <div className={'edu-table-scroll' + (tableExpanded ? ' expanded' : '')}>
              <table className="edu-table" aria-label="HRT benefits comparison">
                <thead>
                  <tr>
                    <th><span className="edu-icon edu-icon-problem" aria-hidden="true">●</span>What You're Feeling</th>
                    <th><span className="edu-dot edu-dot-fix" aria-hidden="true">✓</span>What HRT Does</th>
                  </tr>
                </thead>
                <tbody>
                  {(tableExpanded ? HRT_COMPARISON : HRT_COMPARISON.slice(0, collapsedCount)).map((row, i, arr) => (
                    <tr key={i} className={i === arr.length - 1 && tableExpanded ? 'edu-row-feature' : ''}>
                      <td data-label="What You're Feeling">
                        <span className="edu-icon edu-icon-problem" aria-hidden="true">{row.icon}</span>
                        {row.problem}
                      </td>
                      <td data-label="What HRT Does">
                        <span className="edu-dot edu-dot-fix" aria-hidden="true">✓</span>
                        {row.fix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!tableExpanded && <div className="edu-table-fade" aria-hidden="true"></div>}
            </div>
            <div className="edu-table-toggle-wrap">
              <button
                type="button"
                className="edu-table-toggle"
                onClick={() => setTableExpanded((v) => !v)}
                aria-expanded={tableExpanded}
              >
                {tableExpanded
                  ? 'Show less ↑'
                  : `See ${HRT_COMPARISON.length - collapsedCount} more symptoms ↓`}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* PRESS — hidden (moved inside hero) */}
      <section className="press" style={{ display: 'none' }}>
        <div className="container press-inner">
          <div className="press-label">As featured in</div>
          <div className="press-logos">
            <div className="press-logo">The Atlantic</div>
            <div className="press-logo bold">Forbes Health</div>
            <div className="press-logo">Vogue</div>
            <div className="press-logo upper">Bloomberg</div>
            <div className="press-logo">Goop</div>
            <div className="press-logo bold">Well + Good</div>
          </div>
        </div>
      </section>

      {/* SCIENCE / ESTRADIOL CURVE — moved ABOVE products (per request).
          Chart line-draw + stat count-up animate when scrolled into view
          (see the .science-v2 IntersectionObserver in the tail script).
          Numbers default to their final value, so they're never stuck at 0
          if the animation can't run. */}
      <section className="science-v2" id="science" data-screen-label="02b Science">
        <div className="container">
          <div className="curve-grid">
            <div>
              <span className="eyebrow-chip rv">The science, plainly</span>
              <h2 className="v2-title write-on" style={{ fontSize: 'clamp(32px,3.6vw,50px)' }}>
                <span className="word" style={{ animationDelay: '0ms'   }}>This</span>{' '}
                <span className="word" style={{ animationDelay: '90ms'  }}>is</span>{' '}
                <span className="word" style={{ animationDelay: '180ms' }}>the</span>{' '}
                <span className="word" style={{ animationDelay: '280ms' }}>curve</span>{' '}
                <em>
                  <span className="word" style={{ animationDelay: '400ms' }}>nobody</span>{' '}
                  <span className="word" style={{ animationDelay: '510ms' }}>showed</span>{' '}
                  <span className="word" style={{ animationDelay: '620ms' }}>you.</span>
                </em>
              </h2>
              <p className="v2-sub rv d2">From your mid-30s on, estradiol — your body's primary estrogen — declines. The symptoms you feel track that curve almost exactly. FDA-approved therapy is designed to restore what your body is losing, guided by a licensed clinician.</p>
              <div className="stat-band">
                <div className="stat rv"><b><span className="num" data-count="75">75</span>M</b><small>U.S. women in hormonal transition</small></div>
                <div className="stat rv d1"><b><span className="num" data-count="93">93</span>%</b><small>never receive treatment</small></div>
                <div className="stat rv d2"><b><span className="num" data-count="7">7</span>+yrs</b><small>average wait before help</small></div>
              </div>
            </div>
            <div className="curve-card rv d2">
              <svg viewBox="0 0 560 330" fill="none">
                <line x1="42" y1="284" x2="540" y2="284" stroke="#f0d9e2" strokeWidth="1.5" />
                <line x1="42" y1="44" x2="42" y2="284" stroke="#f0d9e2" strokeWidth="1.5" />
                <text x="48" y="62" fontFamily="DM Mono, monospace" fontSize="12" fill="#7a6770">Estradiol level</text>
                <text x="402" y="308" fontFamily="DM Mono, monospace" fontSize="12" fill="#7a6770">Age 35 → 60</text>
                <path id="declineLine" d="M42 92 C 142 88, 204 98, 264 132 C 324 166, 364 232, 540 254" stroke="#1a1216" strokeWidth="3" strokeLinecap="round" />
                <path id="liftLine" d="M302 152 C 382 130, 462 122, 540 118" stroke="#b8235c" strokeWidth="3.4" strokeLinecap="round" />
                <circle cx="302" cy="152" r="6.5" fill="#b8235c" />
                <text x="314" y="142" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="700" fill="#8a1745">Treatment begins</text>
              </svg>
              <div className="curve-note">Illustrative only — individual results and treatment plans vary, and are determined by your clinician.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TREATMENTS — restored original horizontal product scroll (per request) */}
      <section className="treatments" id="treatments" data-screen-label="02 Treatments">
        <div className="container">
          <div className="treatments-two-col">
            <div className="treatments-col-left">
              <div className="eyebrow">Treatments</div>
              <h2>Your solutions, <em>trusted by experts.</em></h2>
            </div>
            <div className="treatments-col-right">
              <p className="treatments-sub">
                Most patients start with one or two of the following{' '}
                <span className="treatments-highlight">FDA-approved</span>{' '}
                protocols. Your clinician decides what's appropriate based on
                your symptoms, history, and goals.
              </p>
            </div>
          </div>
        </div>
        <div className="products-scroll-wrapper">
          <button
            type="button"
            className="products-scroll-arrow products-scroll-arrow-left"
            aria-label="Scroll products left"
            onClick={() => {
              const el = document.querySelector('.products-scroll-container');
              if (el) el.scrollBy({ left: -452, behavior: 'smooth' });
            }}
          >
            ‹
          </button>
          <div className="products-scroll-container">
            {TREATMENTS.map((t) => (
              <a href="quiz.html" className="product-card-new" key={t.id}>
                <div className="product-card-image-wrapper">
                  <img
                    src={t.image}
                    alt={t.name}
                    className={t.id === 'patch' ? 'no-shadow' : ''}
                  />
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-name">{t.name}</h3>
                  <p className="product-card-subtitle">{t.subtitle}</p>
                  <span className="product-card-btn">GET STARTED</span>
                </div>
              </a>
            ))}
          </div>
          <button
            type="button"
            className="products-scroll-arrow products-scroll-arrow-right"
            aria-label="Scroll products right"
            onClick={() => {
              const el = document.querySelector('.products-scroll-container');
              if (el) el.scrollBy({ left: 452, behavior: 'smooth' });
            }}
          >
            ›
          </button>
        </div>
      </section>

      {/* (Science section moved above the products section — see below.) */}

      {/* PATIENT STORIES section REMOVED pending real, consented patient
          testimonials (audit findings C-06, H-13). Do not reintroduce with
          fabricated content. */}

      {/* SYMPTOM QUIZ section removed (per request). */}

      {/* HOW IT WORKS + COMPARE — share a single pink-wash gradient flowing
          from the top of "How it works" through the bottom of "Compare". */}
      <div className="hrt-flow-band">

      {/* HOW IT WORKS */}
      <Timeline />

      {/* COMPARE */}
      <section className="compare" data-screen-label="06 Compare">
        <div className="container">
          <div className="compare-head">
            <div className="eyebrow">For comparison</div>
            <h2>Honest about <em>what's different.</em></h2>
            <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0' }}>
              We aren't the cheapest, and we don't try to be everything to everyone.
            </p>
          </div>
          <div className="compare-table">
            <div className="compare-row header">
              <div></div>
              <div>Most clinics</div>
              <div className="col-us">Her Estrogen</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Initial intake review</div>
              <div className="compare-no">Often 2–4 month wait</div>
              <div className="col-us compare-yes">Typically 1–2 business days</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Medication at your door</div>
              <div className="compare-no">2–6 weeks (Rx + pharmacy runs)</div>
              <div className="col-us compare-yes">Shipped free; shipping time varies by state</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Clinician focus</div>
              <div className="compare-no">General practice</div>
              <div className="col-us compare-yes">Women's hormone care</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Async messaging</div>
              <div className="compare-no">Phone tag</div>
              <div className="col-us compare-yes">Messaging during your plan</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">FDA-approved estradiol &amp; progesterone</div>
              <div className="compare-no">Sometimes</div>
              <div className="col-us compare-yes">Default offering</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Dose adjustments</div>
              <div className="compare-no">Annual visit</div>
              <div className="col-us compare-yes">Anytime, free</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Cancel or pause</div>
              <div className="compare-no">Call required</div>
              <div className="col-us compare-yes">One tap</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS section REMOVED — site is pre-launch; 4.9 star rating,
          "2,840 verified patients", and 3 fabricated reviews violate FTC
          16 CFR Part 465 (eff. Oct 2024) and 16 CFR Part 255. Restore only
          with real, named, consenting customers and typicality disclosure
          (audit findings C-06, H-13). */}

      {/* CLINICAL EXCELLENCE — ported from reference, brand-skinned.
          Doctor-card dropped (placeholder/fabrication risk); replaced with a
          factual partner + safety panel. "Board-certified" softened to
          "licensed clinicians via OpenLoop Health" (audit H-05). */}
      <section className="clinical-v2" id="clinical" data-screen-label="07b Clinical excellence">
        <div className="container">
          <span className="eyebrow-chip rv">Clinical excellence</span>
          <h2 className="v2-title rv d1">The best care, <em>by the book.</em></h2>
          <div className="cred-list">
            <div className="cred rv">
              <div className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg></div>
              <div><h4>FDA-approved medications only</h4><p>Never compounded. Every dose manufactured and tested under federal standards.</p></div>
            </div>
            <div className="cred rv d1">
              <div className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg></div>
              <div><h4>Licensed clinicians via OpenLoop Health</h4><p>Licensed in your state, experienced in modern hormonal medicine, reachable through your portal.</p></div>
            </div>
            <div className="cred rv d2">
              <div className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /></svg></div>
              <div><h4>Licensed U.S. pharmacies</h4><p>State-regulated dispensing and discreet packaging, with tracking on every shipment.</p></div>
            </div>
            <div className="cred rv d3">
              <div className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg></div>
              <div><h4>Private by design</h4><p>Your health information is protected and never sold. Care happens in a secure portal.</p></div>
            </div>
          </div>
        </div>
      </section>

      </div>{/* /hrt-flow-band */}

      {/* FAQ */}
      <section className="faq" id="faq" data-screen-label="08 FAQ">
        <div className="container faq-grid">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2>The questions <em>everyone</em> asks first.</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, marginTop: 12 }}>
              Can't find what you're looking for? Email{' '}
              <a href="mailto:support@herestrogen.com" style={{ textDecoration: 'underline' }}>support@herestrogen.com</a>{' '}
              — a clinician answers within one business day.
            </p>
          </div>
          <div className="faq-list">
            {FAQ.map((f, i) =>
            <div key={i} className={'faq-item' + (openFaq === i ? ' open' : '')}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CLOSING — "Unsure where to begin? Start here." mini-quiz (ported from
          v2 reskin, our color scheme). Replaces the prior final CTA. */}
      <section className="start-quiz" id="cta" data-screen-label="09 Start here">
        <div className="container">
          <div className="mini-quiz rv">
            <div>
              <h3>Unsure where to begin? <em>Start here.</em></h3>
              <p>Tell us what's bothering you most — your assessment adapts to you, and a licensed clinician via OpenLoop Health reviews every answer.</p>
            </div>
            <div className="q-options">
              <a className="q-opt" href="quiz.html"><span>I can't sleep</span><span>→</span></a>
              <a className="q-opt" href="quiz.html"><span>Hot flashes</span><span>→</span></a>
              <a className="q-opt" href="quiz.html"><span>Brain fog</span><span>→</span></a>
              <a className="q-opt" href="quiz.html"><span>Mood swings</span><span>→</span></a>
              <a className="q-opt" href="quiz.html"><span>Intimacy discomfort</span><span>→</span></a>
              <a className="q-opt" href="quiz.html"><span>All of the above</span><span>→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer data-screen-label="10 Footer">
        <div className="container foot-simple">
          <img src="assets/logo.png" alt="Her Estrogen" className="foot-logo-large" />
          <div className="foot-tag">
            Modern hormone care, written for the women medicine forgot.
          </div>
          <a href="mailto:support@herestrogen.com" className="foot-email">support@herestrogen.com</a>
        </div>
        <div className="container foot-bottom">
          <div>© 2026 Her Estrogen, PBC.</div>
          <div className="foot-legal-links">
            <a href="privacy.html">Privacy Policy</a>
            <span className="sep">·</span>
            <a href="terms.html">Terms of Service</a>
            <span className="sep">·</span>
            <a href="refunds.html">Cancellation &amp; Refunds</a>
            <span className="sep">·</span>
            <a href="https://openloophealth.com/telehealth-consent" target="_blank" rel="noopener">Telehealth Consent</a>
          </div>
          <div>Telehealth available where independently licensed clinicians are authorized to practice.</div>
        </div>
        <div className="container foot-disclaimer">
          <strong>Important Safety Information.</strong> Estrogen-containing
          products carry boxed warnings for endometrial cancer; cardiovascular
          disorders including stroke, heart attack, and venous thromboembolism;
          probable dementia; and (in combination with progestins) breast
          cancer. Use the lowest effective dose for the shortest duration
          consistent with treatment goals and patient risk. Treatment is
          subject to clinician determination and may not be appropriate for
          everyone. This page is for informational purposes only and does
          not constitute medical advice. Individual results vary. Report side
          effects to FDA MedWatch at <a href="https://www.fda.gov/safety/medwatch" target="_blank" rel="noopener">fda.gov/safety/medwatch</a>.
          See full Privacy Policy and HIPAA Notice for how we handle your information.
        </div>
      </footer>
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);