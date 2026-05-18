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
  desc: 'The gold standard for hormonal restoration — FDA-approved, liver-safe, and precisely dosed.',
  features: [
  ['Application', 'Once daily — inner arm or thigh'],
  ['Delivery', 'Transdermal (bypasses the liver)'],
  ['Treats', 'Hot flashes, sleep, mood, bone density'],
  ['Status', 'FDA-Approved']],
  image: 'assets/cream.png'
},
{
  id: 'patch',
  eyebrow: 'FDA-Approved · No Daily Routine',
  name: 'Estradiol Patch',
  desc: 'Consistent hormone delivery, zero daily effort — changed just twice a week.',
  features: [
  ['Application', 'Twice weekly — adhesive patch'],
  ['Delivery', 'Transdermal — steady levels'],
  ['Treats', 'Hot flashes, sleep, mood, bone density'],
  ['Status', 'FDA-Approved']],
  image: 'assets/transdermal-patch.png'
},
{
  id: 'pill',
  eyebrow: 'FDA-Approved · Oral Option',
  name: 'Estradiol Pill',
  desc: 'A convenient once-daily oral tablet — one of the most studied forms of HRT with decades of clinical evidence.',
  features: [
  ['Application', 'Once daily — oral tablet'],
  ['Delivery', 'Oral (passes through the liver)'],
  ['Treats', 'Hot flashes, sleep, mood, bone density'],
  ['Status', 'FDA-Approved']],
  image: 'assets/oral-pills.png'
},
{
  id: 'dhea',
  eyebrow: 'FDA-Approved · Vaginal Health',
  name: 'Estradiol Vaginal Cream',
  desc: 'FDA-approved estradiol vaginal cream — restores vaginal tissue health and relieves intimate menopause symptoms.',
  features: [
  ['Application', 'Vaginal cream — as directed'],
  ['Form', 'Estrace Vaginal Cream'],
  ['Treats', 'Dryness, painful sex, GSM, recurrent UTIs'],
  ['Status', 'FDA-Approved']],
  image: 'assets/vaginal.png'
},
{
  id: 'progesterone',
  eyebrow: 'FDA-Approved · Sleep + Protection',
  name: 'Progesterone Pill',
  desc: 'Bioidentical oral progesterone taken nightly — protects your uterine lining and unlocks deep, restorative sleep.',
  features: [
  ['Application', 'Nightly oral pill — at bedtime'],
  ['Dose', '100 mg or 200 mg as prescribed'],
  ['Treats', 'Sleep, anxiety, uterine protection'],
  ['Status', 'FDA-Approved']],
  image: 'assets/oral-pills.png'
}];


const REVIEWS = [
{ stars: 5, body: 'I spent two years asking my OB about night sweats and was told to "ride it out." Three weeks on the patch and I am sleeping through the night for the first time since I was 44.', name: 'Marisol R.', age: 'Age 51 · Texas' },
{ stars: 5, body: 'The intake form was the first time a doctor actually asked about my mood, my cycle, my libido, and my sleep in the same conversation. Felt seen.', name: 'Priya N.', age: 'Age 47 · California' },
{ stars: 5, body: 'My brain fog is gone. I run a team of 14 and I had started doubting myself in meetings. The clinician walked me through every dose change.', name: 'Kelly D.', age: 'Age 49 · New York' }];

// 8 case studies — only the working photos. Bump back to 20 once the rest push.
// PLACEHOLDER content; replace with real, consented patient quotes before scale.
const CASE_STUDIES_HOME = [
  { name: 'Mira L.',     meta: 'Age 47 · New York',       quote: "Best decision I've made for myself in years.",                   photo: 'assets/case-3.jpg'  },
  { name: 'Karen H.',    meta: 'Age 53 · Illinois',       quote: 'I cried the first night I slept through.',                       photo: 'assets/case-7.jpg'  },
  { name: 'Diana W.',    meta: 'Age 50 · Oregon',         quote: "Calm. Rested. Steady. Words I haven't used in years.",           photo: 'assets/case-8.jpg'  },
  { name: 'Lisa P.',     meta: 'Age 48 · Massachusetts',  quote: 'My partner says I came back to him. He is right.',               photo: 'assets/case-9.jpg'  },
  { name: 'Patricia L.', meta: 'Age 54 · Pennsylvania',   quote: 'Everything I tried before this was a guess. This was not.',      photo: 'assets/case-12.jpg' },
  { name: 'Veronica E.', meta: 'Age 52 · Ohio',           quote: "It's quiet at 3am again. That's a miracle.",                     photo: 'assets/case-18.jpg' },
  { name: 'Tracy G.',    meta: 'Age 55 · Utah',           quote: 'I have my afternoons back — I did not realize they were gone.',  photo: 'assets/case-19.jpg' },
  { name: 'Olivia N.',   meta: 'Age 47 · Maryland',       quote: 'I tell every woman in my life about this.',                      photo: 'assets/case-20.jpg' }
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
{ q: 'How much does it cost?', a: 'Consults are $49. Medications start at $49/month and most patients spend $90–180/month depending on protocol. We do not bill insurance, but most prescriptions can be filled at your local pharmacy with coverage as an alternative.' },
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
        <img src="assets/hero-bg.jpg" alt="Three women smiling together against blue sky" className="hero-bg-img" />
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
            shipped directly to your door in days.
          </p>
          <ul className="hero-checks">
            <li><span className="check">✓</span> Licensed providers review your intake within 24 hours</li>
            <li><span className="check">✓</span> Custom hormone protocol built for your symptoms</li>
            <li><span className="check">✓</span> Start for just $149/month — no insurance needed</li>
            <li><span className="check">✓</span> Unlimited provider messaging included</li>
            <li><span className="check">✓</span> HSA/FSA approved</li>
            <li><span className="check">✓</span> Free shipping on every order</li>
          </ul>
          <div className="hero-cta">
            <a href="quiz.html" className="btn btn-primary">Am I Qualified?</a>
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
          <div className="treatments-head">
            <div className="eyebrow">Treatments</div>
            <h2>Four protocols. <em>Mixed and matched</em> for your body.</h2>
            <p className="treatments-sub">
              Most patients start with one or two of the following. Your
              clinician decides what's appropriate based on your symptoms,
              history, and goals.
            </p>
          </div>
          <div className="product-tabs">
            {TREATMENTS.map((t) =>
              <button
                key={t.id}
                className={'tab' + (activeTreatment === t.id ? ' active' : '')}
                onClick={() => setActiveTreatment(t.id)}>
                {t.name}
              </button>
            )}
          </div>
          <div className="product">
            <div className="product-img">
              <div className="product-svg"><img src={tx.image} alt={tx.name} style={{width: '88%', height: '88%', objectFit: 'contain'}} /></div>
            </div>
            <div>
              <div className="eyebrow">{tx.eyebrow}</div>
              <h3>{tx.name}</h3>
              <p className="product-desc">{tx.desc}</p>
              <ul className="product-features">
                {tx.features.map(([k, v]) =>
                  <li key={k}>
                    <span className="feat-key">{k}</span>
                    <span className="feat-val">{v}</span>
                  </li>
                )}
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                <a href="quiz.html" className="btn btn-primary">Get Started</a>
              </div>
            </div>
          </div>
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

        {/* Single row — all 8 cases, scrolls left, duplicated for seamless loop */}
        <div className="marquee-row">
          <div className="marquee-track marquee-left">
            {[...CASE_STUDIES_HOME, ...CASE_STUDIES_HOME].map((c, i) => (
              <div className="marquee-card" key={`r1-${i}`} aria-hidden={i >= 8 ? 'true' : undefined}>
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
                </div>
              </div>
            ))}
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
                  <div className="avatar">{r.name.charAt(0)}</div>
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