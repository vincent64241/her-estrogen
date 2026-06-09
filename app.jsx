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
      {/* HERO — editorial layout */}
      <section className="hero hero-editorial" data-screen-label="01 Hero">
        <img src="assets/hero-bg-desktop.jpg?v=2" alt="Hero" className="hero-bg-img" />
        <div className="hero-gradient"></div>

        <div className="hero-editorial-content">
          {/* Star rating + "X+ patients" removed per audit findings C-06 / H-13.
              Site is pre-launch; reintroduce only after counsel review with
              real, named, consenting reviews. */}
          <h1>
            Poor Sleep. Low Energy. Brain Fog.<br />
            It's not in your head — <em>it's your hormones.</em>
          </h1>
          <p className="hero-sub">
            FDA-approved hormone therapy, prescribed by a licensed clinician
            via OpenLoop Health when clinically appropriate. Treatment is
            subject to clinician approval; outcomes vary by individual.
          </p>
          <ul className="hero-checks">
            <li><span className="check">✓</span> Licensed clinicians via OpenLoop Health typically review intakes within 1–2 business days</li>
            <li><span className="check">✓</span> Treatment plan built around your clinical picture (when prescribed)</li>
            <li><span className="check">✓</span> Messaging with the clinical team during your plan</li>
            <li><span className="check">✓</span> HSA/FSA accepted</li>
            <li><span className="check">✓</span> Free shipping on every order</li>
          </ul>
          <div className="hero-cta">
            <a href="quiz.html" className="btn btn-primary">Am I Qualified?</a>
          </div>
        </div>

      </section>

      {/* LIFESTYLE GRID — aspirational AI imagery (NOT presented as patients).
          No names, no quotes, no efficacy claims. Service-attribute stats only.
          Compliance-safe per audit findings C-06, H-13, C-11 (lifestyle imagery
          is fine; patient testimonials require real consenting customers). */}
      <section className="lifestyle-section" data-screen-label="01a Lifestyle">
        <div className="container">
          <div className="lifestyle-head">
            <h2>The hormone care women have been <em>waiting for</em>.</h2>
            <p className="lifestyle-head-sub">
              Modern, clinician-led hormone care designed for women navigating
              perimenopause and menopause. FDA-approved options when prescribed
              by a licensed clinician via OpenLoop Health.
            </p>
          </div>

          <div className="lifestyle-grid">
            <div className="lifestyle-card l1"><img src="assets/lifestyle/lifestyle-1.jpg" alt="" /></div>
            <div className="lifestyle-card l2"><img src="assets/lifestyle/lifestyle-2.jpg" alt="" /></div>
            <div className="lifestyle-card l3"><img src="assets/lifestyle/lifestyle-3.jpg" alt="" /></div>
            <div className="lifestyle-card l4"><img src="assets/lifestyle/lifestyle-4.jpg" alt="" /></div>
            <div className="lifestyle-card l5"><img src="assets/lifestyle/lifestyle-5.jpg" alt="" /></div>
            <div className="lifestyle-card l6"><img src="assets/lifestyle/lifestyle-6.jpg" alt="" /></div>
            <div className="lifestyle-card l7"><img src="assets/lifestyle/lifestyle-7.jpg" alt="" /></div>
          </div>

          <div className="lifestyle-stats">
            <div className="lifestyle-stat">
              <div className="lifestyle-stat-check" aria-hidden="true">✓</div>
              <div className="lifestyle-stat-text">FDA-approved estradiol &amp; oral progesterone when prescribed</div>
            </div>
            <div className="lifestyle-stat">
              <div className="lifestyle-stat-check" aria-hidden="true">✓</div>
              <div className="lifestyle-stat-text">Clinician-led intake via our medical partner OpenLoop Health</div>
            </div>
            <div className="lifestyle-stat">
              <div className="lifestyle-stat-check" aria-hidden="true">✓</div>
              <div className="lifestyle-stat-text">Free shipping. Cancel before any renewal. HSA/FSA accepted.</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* TREATMENTS (no animation) */}
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

      {/* PATIENT STORIES section REMOVED pending real, consented patient
          testimonials (audit findings C-06, H-13). Do not reintroduce with
          fabricated content. */}

      {/* SYMPTOMS / QUIZ — moved below treatments */}
      <section className="quiz" id="symptoms" data-screen-label="03 Symptom checker">
        <div className="container">
          <div className="quiz-head">
            <div>
              <div className="eyebrow">Symptom quiz · 30 seconds</div>
              <h2>Which of these <em>actually</em> sound like you?</h2>
            </div>
            <p className="quiz-intro">
              Tap anything you've noticed in the last six months. We'll match
              you with a protocol — and a clinician who treats women in your
              stage of life every day.
            </p>
          </div>
          <div className="symptom-grid">
            {SYMPTOMS.map((s) => {
              const active = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  className={'symptom' + (active ? ' active' : '')}
                  onClick={() => toggle(s.id)}>

                  <span className="symptom-glyph">{s.glyph}</span>
                  <span className="symptom-name">{s.name}</span>
                  <span className="symptom-note">{s.note}</span>
                </button>);

            })}
          </div>
          <div className="quiz-action">
            <a href="quiz.html" className="btn btn-primary">
              Continue with {selected.size || 0} {selected.size === 1 ? 'symptom' : 'symptoms'} →
            </a>
            <div>
              <div className="quiz-count"><strong>{selected.size}</strong> / {SYMPTOMS.length} selected</div>
              <div className="progress"><div className="progress-fill" style={{ width: progress + '%' }}></div></div>
            </div>
          </div>
        </div>
      </section>

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

      {/* CTA */}
      <section className="cta-final" id="cta" data-screen-label="09 CTA">
        <div className="narrow">
          <div className="eyebrow">Refund available if a clinician determines HRT is not right for you (before shipment)</div>
          <h2>You don't have to <em>ride it out.</em></h2>
          <p>
            Submit your intake today. A licensed clinician via OpenLoop Health
            will review it — typically within 1&ndash;2 business days.
            Treatment is subject to clinician approval and is not guaranteed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="quiz.html" className="btn btn-rose" style={{ padding: '16px 28px', fontSize: 16 }}>
              Start free assessment →
            </a>
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