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
  image: 'assets/estradiol-patch.png'
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


const REVIEWS = [
{ stars: 5, body: 'I spent two years asking my OB about night sweats and was told to "ride it out." Three weeks on the patch and I am sleeping through the night for the first time since I was 44.', name: 'Marisol R.', age: 'Age 51 · Texas', photo: 'assets/case-1.jpg' },
{ stars: 5, body: 'The intake form was the first time a doctor actually asked about my mood, my cycle, my libido, and my sleep in the same conversation. Felt seen.', name: 'Priya N.', age: 'Age 47 · California', photo: 'assets/case-5.jpg' },
{ stars: 5, body: 'My brain fog is gone. I run a team of 14 and I had started doubting myself in meetings. The clinician walked me through every dose change.', name: 'Kelly D.', age: 'Age 49 · New York', photo: 'assets/case-14.jpg' }];

// 5 case studies — PLACEHOLDER content. Replace with real, consented patient stories
// before scale. quote = the gut-punch headline. story = the full paragraph revealed on
// "Read my story" click. Photos: /assets/case-N.jpg.
const CASE_STUDIES_HOME = [
  {
    name: 'Mira L.',
    meta: 'Age 47 · New York',
    quote: 'I got my marriage back.',
    story: "Three years of resentment built between me and my husband. I couldn't figure out why I was angry all the time, too tired for him, too short with everything. We were in counseling. Six weeks on the patch and the fog lifted — the anger wasn't him, it wasn't us. It was estrogen. We're more in love now than we've been since the kids were small.",
    photo: 'assets/case-couple.jpg'
  },
  {
    name: 'Karen H.',
    meta: 'Age 53 · Illinois',
    quote: "My kids told me I'm laughing again.",
    story: "My son asked me why I was so mad all the time. He was eight. That broke me. I started HRT two months later. The first thing my daughter noticed: \"Mom, you're laughing again.\" I didn't know I had stopped laughing. They have their mom back, and I have my joy back.",
    photo: 'assets/case-joy.jpg'
  },
  {
    name: 'Diana W.',
    meta: 'Age 50 · Oregon',
    quote: 'I remembered a word for the first time in months.',
    story: "I run a team of fourteen and I had started doubting every decision. I couldn't find words. I'd open my laptop and forget what I'd come there to do. Three weeks on progesterone and estradiol — clarity. The first time I remembered a colleague's name without straining, I cried at my desk.",
    photo: 'assets/case-reading.jpg'
  },
  {
    name: 'Lisa P.',
    meta: 'Age 48 · Massachusetts',
    quote: "I'm meeting my best friend for coffee again.",
    story: "For two years I canceled every coffee, every dinner, every group plan. I told myself I was 'just too tired.' The truth was — I felt like a ghost. Six weeks on HRT and the fog lifted. Last Saturday I drove forty minutes to see my oldest friend and we sat at that café for three hours like we used to. I cried in the car after. I had my person back.",
    photo: 'assets/case-friends.jpg'
  },
  {
    name: 'Patricia L.',
    meta: 'Age 54 · Pennsylvania',
    quote: "I'm back at the gym.",
    story: "I had gained twenty pounds I couldn't lose. My joints ached. I gave up on the gym at fifty-two — figured my body was just done. A year on HRT and I'm lifting again, walking three miles a day, sleeping through the night. The weight is moving. I have my body back.",
    photo: 'assets/case-gym.jpg'
  }
];

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

const PATIENT_STORIES = [
  {
    name: 'Jessica L.',
    location: 'Age 48 · Florida',
    body: "I haven't had a hot flash in 6 weeks. My husband keeps telling me I look 10 years younger — and I finally feel like the woman he married.",
    photo: 'assets/testimonial-1.jpg'
  },
  {
    name: 'Amanda K.',
    location: 'Age 52 · Colorado',
    body: 'My sleep is finally restored. I wake up rested, energetic, and ready to take on the day. I wish I had started this years ago.',
    photo: 'assets/testimonial-2.jpg'
  },
  {
    name: 'Diana W.',
    location: 'Age 46 · Washington',
    body: 'After two ineffective specialists, Her Estrogen got my hormones right in 30 days. Best money I have ever spent on my health.',
    photo: 'assets/testimonial-3.jpg'
  }
];


const FAQ = [
{ q: 'Is hormone therapy safe?', a: 'For most healthy women under 60 (or within 10 years of menopause), modern bioidentical HRT has a favorable risk-benefit profile. Your clinician reviews personal and family history, current meds, and labs before prescribing, and reassesses every 90 days.' },
{ q: 'Do I need bloodwork to start?', a: 'Not always. Symptom-based prescribing is supported by current guidelines for many patients, but our clinicians may order labs (FSH, estradiol, thyroid, lipids) when it changes the plan. Labs are available at-home or at any Quest location.' },
{ q: 'What if I have a history of breast cancer or clots?', a: 'These histories require a careful, individualized conversation. Some patients are still candidates for local-only therapy; others are not. Our clinicians will be direct about what we can and cannot prescribe.' },
{ q: 'How much does it cost?', a: 'All Her Estrogen plans share the same pricing: $507 for 3 months ($169/mo), $912 for 6 months ($152/mo, save $102), or $1,716 for 12 months ($143/mo, save $312/year). Every plan includes your FDA-approved prescription, unlimited provider messaging, monthly check-ins, and free shipping. We do not bill insurance, but plans can be paid with HSA/FSA.' },
{ q: 'Can I use my own pharmacy?', a: 'Yes. We can ship from our partner pharmacy or send the prescription to any local pharmacy you prefer. Compounded formulations only ship from our partner.' },
{ q: 'How quickly will I feel different?', a: 'Sleep and night sweats often improve within 2–3 weeks. Mood, libido, and body composition shifts typically take 8–12 weeks. We adjust dose based on how you feel, not just labs.' }];


const TIMELINE_STEPS = [
{
  eyebrow: 'Step 01',
  title: 'Get approved',
  body: "Complete a 10-minute medical and symptom intake — written by women's-health clinicians, not a generic chatbot. Our team reviews your information and gets back to you within 48 hours.",
  image: 'woman smiling at her phone, completing the intake',
  src: 'assets/step-1-get-approved.jpg',
  meta: '~ 10 min to complete'
},
{
  eyebrow: 'Step 02',
  title: 'Get prescribed',
  body: "If hormone therapy is appropriate, your clinician builds a protocol around your symptoms, history, and goals — bioidentical estrogen, progesterone, or testosterone, dosed conservatively.",
  image: 'clinician on a video call, writing your prescription',
  src: 'assets/step-2-get-prescribed.jpg',
  meta: 'Reviewed within 48 hrs'
},
{
  eyebrow: 'Step 03',
  title: 'Receive your medication',
  body: "Your prescriptions ship in discreet packaging straight to your door, every 90 days. Message your clinician anytime; we adjust dose based on how you feel.",
  image: 'patient receiving her package at the door',
  src: 'assets/step-3-receive-medication.jpg',
  meta: 'Free shipping · 3–5 days'
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
          <div className="hero-stars">
            <span className="stars">★★★★★</span>
            <span>4.9 from 12,000+ patients</span>
          </div>
          <h1>
            Poor Sleep. Low Energy. Brain Fog.<br />
            It's not in your head — <em>it's your hormones.</em>
          </h1>
          <p className="hero-sub">
            Real bioidentical HRT. Real relief. Prescribed online and
            shipped directly to your door in <span className="hero-sub-underline">days.</span>
          </p>
          <ul className="hero-checks">
            <li><span className="check">✓</span> Licensed providers review your intake within 24 hours</li>
            <li><span className="check">✓</span> Custom hormone protocol built for your symptoms</li>
            <li><span className="check">✓</span> Unlimited provider messaging included</li>
            <li><span className="check">✓</span> HSA/FSA approved</li>
            <li><span className="check">✓</span> Free shipping on every order</li>
          </ul>
          <div className="hero-cta">
            <a href="quiz.html" className="btn btn-primary">Am I Qualified?</a>
          </div>
        </div>

      </section>

      {/* EDUCATIONAL CONVERSION SECTION — Why HRT */}
      <section className="edu-section" id="why" data-screen-label="01b Why HRT">
        <div className="container">

          {/* 1 — Hook banner pill */}
          <div className="edu-hook">
            <span className="edu-hook-pill">Backed by 30+ years of clinical research</span>
          </div>

          {/* 2 — Main headline block */}
          <div className="edu-head">
            <div className="eyebrow">Why Her Estrogen</div>
            <h2>Every woman deserves to feel like <em>herself</em> again.</h2>
            <p className="edu-sub">
              Perimenopause and menopause affect every woman — yet 75% receive no treatment.
              Her Estrogen exists to change that. FDA-approved hormone replacement therapy,
              prescribed online, delivered to your door.
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
              <h3>FDA-Approved. Always.</h3>
              <p>Only FDA-approved bioidentical hormones. No compounded formulations, ever.</p>
            </div>
            <div className="edu-why-card">
              <div className="edu-why-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Approved in 24 Hours.</h3>
              <p>Complete your intake online. A licensed provider reviews and ships in days.</p>
            </div>
            <div className="edu-why-card">
              <div className="edu-why-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Finally, Someone Who Listens.</h3>
              <p>Providers who specialize only in women's hormones. Unlimited messaging, monthly check-ins.</p>
            </div>
          </div>

          {/* 4 — Education block (2 columns: text + stats) */}
          <div className="edu-education">
            <div className="edu-text">
              <h3>Why women in perimenopause and menopause need HRT.</h3>
              <p>Estrogen and progesterone run your sleep, mood, brain, bones, and metabolism — when they decline, every system that depends on them starts failing. HRT replaces the exact molecules your body is missing, so symptoms stop and function returns.</p>
            </div>
            <div className="edu-stats">
              <div className="edu-stat">
                <div className="edu-stat-num">92%</div>
                <div className="edu-stat-label">of women report meaningful symptom relief within 90 days</div>
              </div>
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

      {/* PATIENT STORIES — 20 case-studies in two scrolling rows; pause on hover */}
      <section className="marquee-section" data-screen-label="02b Patient stories">
        <div className="container">
          <div className="patient-stories-head">
            <div className="eyebrow">Real patient stories</div>
            <h2>Women just like you — <em>thriving again.</em></h2>
          </div>
        </div>

        {/* Static grid — all 8 cases, no animation */}
        <div className="marquee-row">
          <div className="marquee-track marquee-static">
            {CASE_STUDIES_HOME.map((c, i) => {
              const isOpen = openStory === i;
              return (
                <div className={'marquee-card' + (isOpen ? ' is-open' : '')} key={`r1-${i}`}>
                  <div className="marquee-photo-wrap">
                    <img src={c.photo} alt={c.name} className="marquee-photo" loading="eager" decoding="async" />
                  </div>
                  <div className="marquee-card-body">
                    <div className="marquee-stars">★★★★★</div>
                    <p className="marquee-quote">"{c.quote}"</p>
                    <div className="marquee-meta">
                      <div className="marquee-name">{c.name}</div>
                      <div className="marquee-loc">{c.meta}</div>
                    </div>
                    <button
                      className="marquee-story-btn"
                      onClick={() => setOpenStory(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? 'Hide story' : 'Read my story →'}
                    </button>
                    {isOpen && (
                      <div className="marquee-story-body">
                        <p>{c.story}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
              <div className="compare-feat">Initial consult</div>
              <div className="compare-no">2–4 month wait</div>
              <div className="col-us compare-yes">Within 48 hrs</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Medication at your door</div>
              <div className="compare-no">2–6 weeks (Rx + pharmacy runs)</div>
              <div className="col-us compare-yes">3–5 days, free shipping</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Clinician specialty</div>
              <div className="compare-no">General practice</div>
              <div className="col-us compare-yes">Menopause-trained</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Async messaging</div>
              <div className="compare-no">Phone tag only</div>
              <div className="col-us compare-yes">Same-day reply</div>
            </div>
            <div className="compare-row">
              <div className="compare-feat">Bioidentical options</div>
              <div className="compare-no">Sometimes</div>
              <div className="col-us compare-yes">Default standard</div>
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

      {/* REVIEWS */}
      <section className="reviews" id="reviews" data-screen-label="07 Reviews">
        <div className="container">
          <div className="reviews-head">
            <div>
              <div className="eyebrow">From our patients</div>
              <h2>What women say after <em>ninety days.</em></h2>
            </div>
            <div className="reviews-meta">
              <div className="reviews-rating">4.9<span className="stars">★★★★★</span></div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                Across 2,840 verified patients
              </div>
            </div>
          </div>
          <div className="review-grid">
            {REVIEWS.map((r, i) =>
            <div className="review" key={i}>
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
                <div className="review-body">"{r.body}"</div>
                <div className="review-author">
                  {r.photo ? (
                    <img className="review-photo" src={r.photo} alt={r.name} loading="lazy" />
                  ) : (
                    <div className="avatar">{r.name.charAt(0)}</div>
                  )}
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-age">{r.age}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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
          <div className="eyebrow">$49 to start · refundable if you're not a candidate</div>
          <h2>You don't have to <em>ride it out.</em></h2>
          <p>
            Ten minutes today, a clinician within forty-eight hours,
            and a real plan in your hands by the end of the week.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="quiz.html" className="btn btn-rose" style={{ padding: '16px 28px', fontSize: 16 }}>
              Start free assessment →
            </a>
            <a href="quiz.html" className="btn btn-ghost" style={{ padding: '16px 28px', fontSize: 16 }}>
              Talk to a clinician first
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
          </div>
          <div>Licensed in all 50 U.S. states · LegitScript certified</div>
        </div>
        <div className="container foot-disclaimer">
          Her Estrogen provides telehealth services through independently
          licensed clinicians. Hormone therapy is not appropriate for
          everyone; risks and benefits will be reviewed with your prescriber
          before treatment. This site is for informational purposes and is
          not medical advice. Individual results vary.
        </div>
      </footer>
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);