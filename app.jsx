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
  id: 'estradiol',
  eyebrow: 'Bioidentical estradiol',
  name: 'Transdermal patch',
  desc: 'Twice-weekly patch delivering bioidentical 17β-estradiol through the skin — bypassing the liver for a steadier hormonal floor.',
  price: 89, strike: 145, unit: '/ month',
  features: [
  ['Dose', '0.025 – 0.1 mg / day'],
  ['Cadence', 'Apply 2x per week'],
  ['Form', 'Adhesive matrix patch'],
  ['Ships', 'Every 90 days']],
  svg: `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="patchG" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#fbeae0"/>
        <stop offset="100%" stop-color="#e6c3b0"/>
      </radialGradient>
    </defs>
    <g transform="translate(60 60) rotate(-6 100 100)">
      <rect x="0" y="0" width="200" height="200" rx="22" fill="url(#patchG)" stroke="#c89a85" stroke-width="1.2" opacity="0.96"/>
      <circle cx="100" cy="100" r="56" fill="none" stroke="#b8235c" stroke-width="1.4" opacity="0.55"/>
      <circle cx="100" cy="100" r="34" fill="#b8235c" opacity="0.18"/>
      <text x="100" y="108" text-anchor="middle" font-family="Lora, Georgia, serif" font-style="italic" font-size="22" fill="#8a1745" font-weight="500">her</text>
      <g stroke="#c89a85" stroke-width="0.8" opacity="0.45" fill="none">
        <path d="M22 22 L40 40"/><path d="M178 22 L160 40"/>
        <path d="M22 178 L40 160"/><path d="M178 178 L160 160"/>
      </g>
    </g>
  </svg>`

},
{
  id: 'progesterone',
  eyebrow: 'Micronized progesterone',
  name: 'Nightly oral capsule',
  desc: 'Plant-derived, bioidentical progesterone taken before bed — pairs with estradiol if you have an intact uterus, and supports sleep.',
  price: 49, strike: 95, unit: '/ month',
  features: [
  ['Dose', '100 – 200 mg / night'],
  ['Cadence', 'Daily, before sleep'],
  ['Form', 'Soft-gel capsule'],
  ['Ships', 'Every 90 days']],
  svg: `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="capL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbe6d9"/><stop offset="100%" stop-color="#e9b787"/>
      </linearGradient>
      <linearGradient id="capR" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c97a3e"/><stop offset="100%" stop-color="#a85a26"/>
      </linearGradient>
    </defs>
    <g transform="translate(160 160) rotate(-22)">
      <g transform="translate(-110 -38)">
        <path d="M38 0 H110 V76 H38 a38 38 0 0 1 0 -76 z" fill="url(#capL)" stroke="#c79676" stroke-width="0.8"/>
        <path d="M110 0 H182 a38 38 0 0 1 0 76 H110 z" fill="url(#capR)" stroke="#7e3f15" stroke-width="0.8"/>
        <ellipse cx="66" cy="22" rx="22" ry="6" fill="#fff" opacity="0.55"/>
        <ellipse cx="140" cy="22" rx="22" ry="5" fill="#fff" opacity="0.22"/>
      </g>
    </g>
  </svg>`

},
{
  id: 'testosterone',
  eyebrow: 'Compounded testosterone',
  name: 'Low-dose cream',
  desc: 'Physician-compounded topical testosterone for libido, energy, and lean mass — dosed at a fraction of male protocols.',
  price: 119, strike: 199, unit: '/ month',
  features: [
  ['Dose', '0.5 – 5 mg / day'],
  ['Cadence', 'Once daily, topical'],
  ['Form', 'Compounded cream'],
  ['Ships', 'Every 60 days']],
  svg: `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tubeG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="45%" stop-color="#fdf6f2"/>
        <stop offset="100%" stop-color="#e9d3cc"/>
      </linearGradient>
    </defs>
    <g transform="translate(115 40)">
      <rect x="0" y="30" width="90" height="34" rx="4" fill="#b8235c"/>
      <rect x="0" y="30" width="90" height="6" fill="#8a1745" opacity="0.35"/>
      <rect x="4" y="60" width="82" height="8" rx="2" fill="#fdf6f2" stroke="#d9c0b5" stroke-width="0.8"/>
      <path d="M0 68 L90 68 L80 240 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 z" fill="url(#tubeG)" stroke="#c9aea4" stroke-width="0.9"/>
      <text x="45" y="150" text-anchor="middle" font-family="Lora, Georgia, serif" font-style="italic" font-size="20" fill="#b8235c" font-weight="500">her</text>
      <text x="45" y="175" text-anchor="middle" font-family="DM Mono, monospace" font-size="7" fill="#7a6770" letter-spacing="1">TESTOSTERONE</text>
      <text x="45" y="187" text-anchor="middle" font-family="DM Mono, monospace" font-size="7" fill="#7a6770" letter-spacing="1">CREAM 2%</text>
      <path d="M16 80 Q12 100 14 130" stroke="#fff" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
    </g>
  </svg>`

},
{
  id: 'vaginal',
  eyebrow: 'Local estradiol',
  name: 'Vaginal estradiol',
  desc: 'Low-dose local estrogen for dryness, discomfort, and urinary symptoms — minimal systemic absorption, used independently or alongside.',
  price: 69, strike: 110, unit: '/ month',
  features: [
  ['Dose', '10 mcg insert'],
  ['Cadence', '2x per week'],
  ['Form', 'Vaginal insert'],
  ['Ships', 'Every 90 days']],
  svg: `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="appG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="50%" stop-color="#fdf6f2"/>
        <stop offset="100%" stop-color="#e9d3cc"/>
      </linearGradient>
      <radialGradient id="insG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#e9d3cc"/>
      </radialGradient>
    </defs>
    <g transform="translate(40 120) rotate(-8)">
      <rect x="0" y="0" width="170" height="36" rx="18" fill="url(#appG)" stroke="#c9aea4" stroke-width="0.9"/>
      <rect x="170" y="6" width="50" height="24" rx="3" fill="#b8235c"/>
      <rect x="170" y="6" width="50" height="6" fill="#8a1745" opacity="0.4"/>
      <ellipse cx="22" cy="18" rx="10" ry="2" fill="#fff" opacity="0.6"/>
    </g>
    <g transform="translate(200 180)">
      <ellipse cx="0" cy="0" rx="30" ry="18" fill="url(#insG)" stroke="#c9aea4" stroke-width="0.9"/>
      <ellipse cx="-10" cy="-6" rx="10" ry="3" fill="#fff" opacity="0.6"/>
      <text x="0" y="3" text-anchor="middle" font-family="DM Mono, monospace" font-size="6" fill="#b8235c" letter-spacing="1">10mcg</text>
    </g>
  </svg>`

}];


const REVIEWS = [
{ stars: 5, body: 'I spent two years asking my OB about night sweats and was told to "ride it out." Three weeks on the patch and I am sleeping through the night for the first time since I was 44.', name: 'Marisol R.', age: 'Age 51 · Texas' },
{ stars: 5, body: 'The intake form was the first time a doctor actually asked about my mood, my cycle, my libido, and my sleep in the same conversation. Felt seen.', name: 'Priya N.', age: 'Age 47 · California' },
{ stars: 5, body: 'My brain fog is gone. I run a team of 14 and I had started doubting myself in meetings. The clinician walked me through every dose change.', name: 'Kelly D.', age: 'Age 49 · New York' }];


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
  image: 'lifestyle — woman, soft window light, phone in hand',
  src: 'https://images.unsplash.com/photo-1771340589665-cf724a153b46?auto=format&fit=crop&w=1200&q=80',
  meta: '~ 10 min to complete'
},
{
  eyebrow: 'Step 02',
  title: 'Get prescribed',
  body: "If hormone therapy is appropriate, your clinician builds a protocol around your symptoms, history, and goals — bioidentical estrogen, progesterone, or testosterone, dosed conservatively.",
  image: 'macro — clinician writing Rx pad, warm desktop',
  src: 'https://images.unsplash.com/photo-1629540266304-fff9c67b7660?auto=format&fit=crop&w=1200&q=80',
  meta: 'Reviewed within 48 hrs'
},
{
  eyebrow: 'Step 03',
  title: 'Receive your medication',
  body: "Your prescriptions ship in discreet packaging straight to your door, every 90 days. Message your clinician anytime; we adjust dose based on how you feel.",
  image: 'still life — package at doorstep, soft morning light',
  src: 'https://images.unsplash.com/photo-1758686253896-e6c76b6f7aa1?auto=format&fit=crop&w=1200&q=80',
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
    const onScroll = () => {
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

      // fade-in cards near viewport
      const nextVis = visible.slice();
      let changed = false;
      cardRefs.current.forEach((c, i) => {
        if (!c || nextVis[i]) return;
        const cr = c.getBoundingClientRect();
        if (cr.top < vh * 0.88) {nextVis[i] = true;changed = true;}
      });
      if (changed) setVisible(nextVis);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
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
  const [activeTreatment, setActiveTreatment] = useState('estradiol');
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
      {/* HERO */}
      <section className="hero" data-screen-label="01 Hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow"></div>
            <h1>
              The years after 40<br />
              shouldn't feel like<br />
              a <em>quiet emergency.</em>
            </h1>
            <p className="hero-sub">
              Physician-prescribed estrogen, progesterone, and testosterone
              for perimenopause and beyond — evaluated by a clinician,
              shipped to your door, adjusted on your terms.
            </p>
            <div className="hero-cta">
              <a href="quiz.html" className="btn btn-primary">Start free assessment →</a>
              <a href="#how" className="btn btn-ghost">How it works</a>
            </div>
            <div className="hero-meta">
              <div><span className="check">✓</span> Board-certified clinicians</div>
              <div><span className="check">✓</span> $49 first consult</div>
            </div>
          </div>
          <div className="hero-art">
            <img src="https://images.unsplash.com/photo-1764173039248-78beb636931a?auto=format&fit=crop&w=1400&q=80" alt="Woman in her 50s, joyful portrait" className="photo" />
            <div className="tag">
              <div className="tag-num">93%</div>
              <div className="tag-text">
                of patients report symptom relief within<br />
                <strong>90 days of starting therapy.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="press">
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

      {/* SYMPTOMS / QUIZ */}
      <section className="quiz" id="symptoms" data-screen-label="02 Symptom checker">
        <div className="container">
          <div className="quiz-head">
            <div>
              <div className="eyebrow">Symptom inventory · 30 seconds</div>
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

      {/* SCIENCE */}
      <section className="science" data-screen-label="03 What is HRT">
        <div className="container science-grid">
          <div>
            <div className="eyebrow">What we prescribe</div>
            <h2>Bioidentical hormones, <em>conservative dosing,</em> careful follow-up.</h2>
            <div className="science-body">
              <p>
                Estradiol, progesterone, and (in some cases) low-dose
                testosterone — the same molecules your ovaries used to
                produce, in delivery forms studied for safety and efficacy
                in women.
              </p>
              <p>
                Our default is the lowest dose that resolves your symptoms,
                reviewed every 90 days. We adjust based on how you feel —
                not on a one-size-fits-not protocol.
              </p>
            </div>
            <div className="science-stats">
              <div className="stat">
                <div className="stat-num">17β</div>
                <div className="stat-label">Bioidentical estradiol — identical to the body's own</div>
              </div>
              <div className="stat">
                <div className="stat-num">90d</div>
                <div className="stat-label">Re-evaluation cadence with your clinician</div>
              </div>
              <div className="stat">
                <div className="stat-num">3+</div>
                <div className="stat-label">Delivery routes (patch, oral, topical, local)</div>
              </div>
              <div className="stat">
                <div className="stat-num">32</div>
                <div className="stat-label">U.S. states currently licensed</div>
              </div>
            </div>
          </div>
          <div className="science-art">
            <img src="https://images.unsplash.com/photo-1772723246504-3c56817b437f?auto=format&fit=crop&w=1200&q=80" alt="Women, mid-life, together" className="photo" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Timeline />

      {/* TREATMENTS */}
      <section className="treatments" id="treatments" data-screen-label="05 Treatments">
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
              <div className="product-svg" dangerouslySetInnerHTML={{__html: tx.svg}} />
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
              <div className="product-price">
                <span className="price-num">${tx.price}</span>
                <span className="price-strike">${tx.strike}</span>
                <span className="price-unit">{tx.unit}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="quiz.html" className="btn btn-primary">Start with this protocol →</a>
                <a href="#" className="btn btn-ghost">Clinical details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <a href="#" style={{ textDecoration: 'underline' }}>care@herestrogen.com</a>{' '}
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
        <div className="container foot-grid">
          <div className="foot foot-logo">
            <img src="assets/logo.png" alt="Her Estrogen" />
            <div className="foot-tag">
              Modern hormone care, written for the women medicine forgot.
            </div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'rgba(245,239,230,.5)', letterSpacing: '0.1em' }}>
              CARE@HERESTROGEN.COM
            </div>
          </div>
          <div className="foot">
            <h4>Treatments</h4>
            <ul>
              <li><a href="#">Estradiol patch</a></li>
              <li><a href="#">Progesterone</a></li>
              <li><a href="#">Testosterone cream</a></li>
              <li><a href="#">Vaginal estradiol</a></li>
              <li><a href="#">Lab panels</a></li>
            </ul>
          </div>
          <div className="foot">
            <h4>Company</h4>
            <ul>
              <li><a href="#">How it works</a></li>
              <li><a href="#">Our clinicians</a></li>
              <li><a href="#">Science library</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="foot">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help center</a></li>
              <li><a href="#">Shipping & returns</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="container foot-bottom">
          <div>© 2026 Her Estrogen, PBC.</div>
          <div>Licensed in 32 U.S. states · LegitScript certified</div>
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