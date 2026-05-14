const { useState, useEffect, useRef, useMemo } = React;

// ============ DATA ============

const PRICING = {
  patch: { 1: 169, 3: 154, 6: 139, 12: 124 },
  oral:  { 1: 149, 3: 134, 6: 119, 12: 104 }
};

const SYMPTOMS_LIST = [
  'Hot Flashes',
  'Sleep Disruption',
  'Brain Fog',
  'Mood Shifts',
  'Low Energy'
];

const DURATIONS = [
  { months: 1, label: 'Month-to-Month', note: 'Try it first, no commitment' },
  { months: 3, label: '3 Months', note: 'Most popular', badge: 'Most Popular' },
  { months: 6, label: '6 Months', note: 'Save more' },
  { months: 12, label: '12 Months', note: 'Best deal', badge: 'Best Deal', isBest: true }
];

const MEDS = {
  patch: {
    name: 'Transdermal Patch',
    badge: 'Most Popular',
    badgeKind: 'pink',
    rating: '4.8',
    reviewCount: '2,847',
    product: 'Bioidentical Estradiol Patch — Twice-Weekly Application',
    image: 'assets/transdermal-patch.png',
    priceFrom: 149,
    priceStrike: 199,
    features: [
      'Twice-weekly patch — steady hormone levels',
      'Bypasses the liver — lower clot risk than oral',
      'Available to ship within 3–5 days of approval',
      'INCLUDES: provider consultation, unlimited messaging, written prescription, free shipping'
    ]
  },
  oral: {
    name: 'Oral Capsules',
    badge: 'Also Recommended',
    badgeKind: 'pink',
    rating: '4.7',
    reviewCount: '1,204',
    product: 'Bioidentical Oral Estradiol + Progesterone Capsules',
    image: 'assets/oral-pills.png',
    priceFrom: 129,
    priceStrike: 179,
    features: [
      'Once-daily oral capsule — simple routine',
      'Plant-derived bioidentical formulation',
      'Available to ship within 3–5 days of approval',
      'INCLUDES: provider consultation, unlimited messaging, written prescription, free shipping'
    ]
  }
};

const GOALS = [
  { text: 'Eliminate hot flashes and night sweats — most women see results within 7 days' },
  { text: 'Restore deep sleep and mental clarity — brain fog lifts as hormones stabilize' },
  { text: 'Reclaim your energy, mood, and sense of self — feel like YOU again' }
];

const INCLUDED = [
  { icon: '💊', text: 'Personalized compounded bioidentical HRT — cost of medication included' },
  { icon: '👩‍⚕️', text: 'Licensed provider review within 24 hours' },
  { icon: '💬', text: 'Unlimited provider messaging — ask questions anytime' },
  { icon: '🚚', text: 'Free shipping on every monthly refill' },
  { icon: '📋', text: 'Monthly check-ins and dose adjustments included' },
  { icon: '🧴', text: 'Optional supplement add-ons available' }
];

const STEPS = [
  { n: 1, title: 'Provider Review', body: "You're already pre-screened. After checkout, a board-certified licensed provider will review your complete intake within 24 hours." },
  { n: 2, title: 'Prescription Approval', body: 'Most prescriptions are approved in less than 24 hours. Your provider may message you through your secure portal with any questions.' },
  { n: 3, title: 'Medication Prepared & Shipped', body: 'Once approved, your custom-compounded HRT is prepared by our licensed pharmacy partner and shipped directly to your door. Tracking info sent by text and email.' },
  { n: 4, title: 'Monthly Refills', body: 'At the start of each cycle, your medication is automatically refilled and shipped. No action needed — we handle everything.' },
  { n: 5, title: 'Unlimited Support', body: "Questions about your protocol, dosage, or how you're feeling? Message your licensed Her Estrogen provider 24/7 through your secure patient portal." }
];

const STATS = [
  { num: '87%', label: 'Women report significant symptom relief within 30 days' },
  { num: '9/10', label: 'Patients say HRT is the most effective treatment they’ve tried' },
  { num: '94%', label: 'Continuation rate after 6 months of treatment' },
  { num: '5+ yrs', label: 'Average length of time patients stay on HRT' }
];

const TESTIMONIALS = [
  {
    title: 'I finally feel like myself again',
    body: "I suffered for 3 years thinking brain fog and no sleep was just 'getting older.' Two months into Her Estrogen and I sleep through the night for the first time since 2021. My husband says I'm a different person. He's right.",
    name: 'Sarah M.'
  },
  {
    title: 'My doctor never mentioned this was an option',
    body: "I spent a year on antidepressants that didn't work. Her Estrogen connected me with a provider who actually listened. Turns out it was perimenopause the whole time. I wish I'd found this sooner.",
    name: 'Jennifer K.'
  },
  {
    title: 'Worth every penny',
    body: 'At 44 I thought feeling exhausted and irritable was just my personality now. Three months of bioidentical HRT through Her Estrogen and I have my energy back, my libido back, and my life back.',
    name: 'Michelle R.'
  }
];

const FAQ_ITEMS = [
  {
    q: 'What is the Her Estrogen prescription plan?',
    a: 'Her Estrogen coordinates access to personalized bioidentical hormone replacement therapy (HRT) through a network of licensed providers. After your checkout, a board-certified provider reviews your intake and writes a custom prescription for compounded bioidentical hormones including estradiol, progesterone, and if indicated, low-dose testosterone. The medication is compounded and shipped directly to your door by our licensed pharmacy partner.'
  },
  {
    q: 'What does the price include?',
    a: 'Your subscription includes your licensed provider consultation, written prescription, custom-compounded medication, unlimited provider messaging, free shipping on every refill, and monthly check-ins. There are no hidden fees and your price does not change as your dose adjusts.'
  },
  {
    q: 'Is a prescription required?',
    a: 'Yes. Bioidentical HRT requires a prescription from a licensed medical provider. Her Estrogen connects you with licensed physicians and nurse practitioners who review your health intake and, when appropriate, prescribe your custom hormone protocol. This is what separates Her Estrogen from OTC supplements — you get real, clinically effective hormone therapy.'
  },
  {
    q: 'How long until I feel results?',
    a: 'Most women notice improvements in sleep quality within the first 1–2 weeks. Hot flash frequency typically reduces by 50–70% within the first month. Full hormonal balance and complete symptom resolution generally occurs within 3 months. Individual results vary based on starting hormone levels and symptom severity.'
  },
  {
    q: "What if the provider determines HRT isn't right for me?",
    a: 'If our licensed provider reviews your intake and determines that HRT is not medically appropriate for you, you will receive a full refund of your subscription payment. No questions asked. This is our complete guarantee.'
  }
];

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

// ============ UTILITIES ============

function firstNameFromEmail(email) {
  if (!email) return 'Your';
  const local = email.split('@')[0] || '';
  const part = local.split(/[._\-+]/)[0] || local;
  if (!part) return 'Your';
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return phone.replace(/\D/g, '').length === 10;
}

// ============ PHASE 1: EMAIL/PHONE CAPTURE ============

function Capture({ onContinue }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!firstName.trim()) next.firstName = 'Please enter your first name.';
    if (!isValidEmail(email)) next.email = 'Please enter a valid email.';
    if (!isValidPhone(phone)) next.phone = 'Please enter a valid 10-digit U.S. phone number.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    const cleanName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase();
    setTimeout(() => onContinue({ firstName: cleanName, email, phone }), 450);
  };

  return (
    <div className="capture">
      <div className="capture-card">
        <img src="assets/logo.png" alt="Her Estrogen" className="capture-logo" />
        <h1>Almost there — where should we send your <em>hormone report?</em></h1>
        <p className="capture-sub">Your personalized HRT protocol is ready. Enter your details to view your results.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label className="field-label">First name</label>
            <input
              className={'input' + (errors.firstName ? ' error' : '')}
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setErrors((x) => ({ ...x, firstName: firstName.trim() ? null : 'Please enter your first name.' }))}
              autoComplete="given-name"
              autoCapitalize="words"
              required
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          <div className="form-row">
            <label className="field-label">Email address</label>
            <input
              className={'input' + (errors.email ? ' error' : '')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setErrors((x) => ({ ...x, email: isValidEmail(email) ? null : 'Please enter a valid email.' }))}
              autoComplete="email"
              inputMode="email"
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="form-row">
            <label className="field-label">Phone number</label>
            <div className="phone-wrap">
              <span className="phone-prefix">🇺🇸 +1</span>
              <input
                className={'input' + (errors.phone ? ' error' : '')}
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onBlur={() => setErrors((x) => ({ ...x, phone: isValidPhone(phone) ? null : 'Please enter a valid 10-digit phone.' }))}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
          <p className="privacy-note">🔒 Your information is protected by HIPAA. We never sell your data.</p>
          <button type="submit" className="btn-primary-full" disabled={submitting}>
            {submitting ? 'Loading…' : 'View My Results →'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ TIMER ============

function useCountdown(initialSeconds, running) {
  const [t, setT] = useState(initialSeconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);
  return t;
}

// ============ TIMELINE CHART (SVG) ============

function TimelineChart() {
  // viewBox: 600 wide, 240 tall
  // Points (x from 60..560, y from 50 (high severity) to 200 (low))
  const pts = [
    { x: 60, y: 60, label: 'Today', tag: '' },
    { x: 175, y: 110, label: 'Week 2', tag: 'Sleep begins improving' },
    { x: 290, y: 145, label: 'Month 1', tag: 'Hot flashes reduce 60%' },
    { x: 420, y: 178, label: 'Month 3', tag: 'Energy and mood restored' },
    { x: 540, y: 200, label: 'Month 6', tag: 'Full hormonal balance achieved' }
  ];
  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    return acc + ` C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="chart-wrap">
      <svg className="chart-svg" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8235c" />
            <stop offset="100%" stopColor="#ec84a8" />
          </linearGradient>
          <linearGradient id="fillG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b8235c" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#b8235c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis label */}
        <text x="14" y="44" fontFamily="DM Mono, monospace" fontSize="9" fill="#9b8b91" letterSpacing="0.06em">SEVERITY</text>
        <text x="14" y="58" fontFamily="DM Mono, monospace" fontSize="9" fill="#9b8b91">HIGH</text>
        <text x="14" y="204" fontFamily="DM Mono, monospace" fontSize="9" fill="#9b8b91">LOW</text>

        {/* Horizontal gridlines */}
        {[60, 110, 160, 200].map((y, i) => (
          <line key={i} x1="50" y1={y} x2="580" y2={y} stroke="#f0d9e2" strokeWidth="1" strokeDasharray="2 4" />
        ))}

        {/* Area under curve */}
        <path d={`${pathD} L 540 210 L 60 210 Z`} fill="url(#fillG)" />

        {/* Curve */}
        <path d={pathD} stroke="url(#lineG)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Points + labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#b8235c" strokeWidth="2.5" />
            <text x={p.x} y="230" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="10" fill="#7a6770" letterSpacing="0.04em">{p.label}</text>
            {p.tag && (
              <g>
                <rect x={p.x - 64} y={p.y - 32} width="128" height="22" rx="11" fill="#8a1745" />
                <text x={p.x} y={p.y - 17} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#fff" fontWeight="600">{p.tag}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============ STRIPE CARD ELEMENT (mounted via JS API) ============

function CardElementMount({ onReady }) {
  useEffect(() => {
    if (!window.Stripe) return;
    const stripe = window.Stripe('pk_test_placeholder_key_here');
    const elements = stripe.elements({
      fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' }]
    });
    const card = elements.create('card', {
      style: {
        base: {
          color: '#1a1216',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': { color: '#a89aa1' }
        },
        invalid: { color: '#c33', iconColor: '#c33' }
      }
    });
    card.mount('#card-element');
    onReady && onReady({ stripe, card });
    return () => card.destroy();
  }, []);

  return <div id="card-element"></div>;
}

// ============ MAIN APP ============

function App() {
  const [phase, setPhase] = useState('capture');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMed, setSelectedMed] = useState('patch');
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [openFaq, setOpenFaq] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const checkoutRef = useRef(null);
  const pricingRef = useRef(null);
  const stripeApiRef = useRef(null);

  const timeLeft = useCountdown(10 * 60, phase === 'results');
  const expired = timeLeft <= 0 && phase === 'results';

  const monthly = PRICING[selectedMed][selectedDuration];
  const total = monthly * selectedDuration;
  const med = MEDS[selectedMed];

  // shipping form
  const [form, setForm] = useState({
    fullName: '', address1: '', address2: '', city: '',
    state: '', zip: '', billSame: true
  });
  const updateForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleCaptureContinue = ({ firstName, email, phone }) => {
    setFirstName(firstName);
    setEmail(email);
    setPhone(phone);
    setPhase('results');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToCheckout = () => {
    setCheckoutVisible(true);
    setTimeout(() => {
      checkoutRef.current && checkoutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const scrollToPricing = () => {
    pricingRef.current && pricingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Demo: simulate Stripe call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (phase === 'capture') {
    return <Capture onContinue={handleCaptureContinue} />;
  }

  return (
    <div className="results">

      {/* SECTION 1 — Urgency bar */}
      <div className={'urgency-bar' + (expired ? ' expired' : '')}>
        <span className="label"><strong>{firstName}</strong> · Pre-Approved · Offer expires in</span>
        <span className="timer">{expired ? '0:00 — Refresh to continue' : formatTime(timeLeft)}</span>
      </div>

      {/* SECTION 2 — Approval headline */}
      <section className="approval">
        <div className="container">
          <span className="eyebrow">Pre-screened ✓</span>
          <h1>{firstName} — <em>Pre-Approved</em> for Hormone Restoration</h1>
          <p className="approval-sub">Based on your intake assessment, a licensed Her Estrogen provider has pre-screened your profile. You are a strong candidate for bioidentical HRT.</p>

          <div className="symptoms-block">
            <div className="symptoms-label">Your reported symptoms</div>
            <div className="symptoms-tags">
              {SYMPTOMS_LIST.map((s, i) => (
                <span key={i} className="symptom-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="data-cards two">
            <div className="data-card">
              <div className="label">Hormone type</div>
              <div className="value">Bioidentical HRT</div>
            </div>
            <div className="data-card">
              <div className="label">Life stage</div>
              <div className="value">Perimenopause</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Success probability */}
      <section style={{ background: '#fff', paddingTop: 0 }}>
        <div className="container">
          <div className="probability">
            <div className="probability-text">Based on your symptom profile, you have a very high likelihood of responding well to bioidentical HRT</div>
            <div>
              <div className="probability-stat">94.3%</div>
              <div className="probability-label">Likelihood of improvement</div>
            </div>
          </div>
          <div className="progress"><div className="progress-fill" style={{ width: '94.3%' }}></div></div>
        </div>
      </section>

      {/* SECTION 4 — Timeline chart */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Your <em>symptom relief</em> timeline</h2>
          <p className="section-sub">Most women feel a meaningful difference within the first 30 days.</p>
          <TimelineChart />
        </div>
      </section>

      {/* SECTION 5 — Recommendation */}
      <section style={{ background: '#fff' }}>
        <div className="container">
          <div className="recommend">
            <div>
              <span className="recommend-badge">Our Recommendation</span>
              <h3>Personalized compounded bioidentical HRT</h3>
              <p>Based on your intake, we recommend a personalized compounded bioidentical HRT protocol including estradiol and micronized progesterone — customized to your exact hormone levels and symptom profile.</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>You can discuss your specific formulation with your licensed Her Estrogen provider after checkout — your protocol is always adjustable.</p>
              <span className="small-badge">Prescription Required — Included in your plan</span>
            </div>
            <div className="vial-wrap">
              <img src="assets/transdermal-patch.png" alt="Her Estrogen transdermal patch" className="rec-product-img" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Goals */}
      <section style={{ background: 'var(--cream)' }}>
        <div className="container">
          <h2 className="section-title">The goals you will <em>accomplish</em> with your plan:</h2>
          <div className="goals" style={{ marginTop: 24 }}>
            {GOALS.map((g, i) => (
              <div className="goal" key={i}>
                <div className="goal-check">✓</div>
                <div className="goal-text">{g.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — What's included */}
      <section style={{ background: '#fff' }}>
        <div className="container">
          <h2 className="section-title">Everything <em>included</em> in your Her Estrogen plan:</h2>
          <div className="included-card" style={{ marginTop: 24 }}>
            <div className="included-list">
              {INCLUDED.map((item, i) => (
                <div className="included-row" key={i}>
                  <div className="icon">{item.icon}</div>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>
            <div className="included-note">+ No insurance required. HSA/FSA accepted.</div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Steps */}
      <section style={{ background: 'var(--cream)' }}>
        <div className="container">
          <h2 className="section-title">What <em>happens next?</em></h2>
          <div className="steps" style={{ marginTop: 32 }}>
            {STEPS.map((s) => (
              <div className={`step s${s.n}`} key={s.n}>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — Pricing */}
      <section className="pricing-section" ref={pricingRef}>
        <div className="container">
          <div className="urgency-callout">
            <span className="reserved-pill">Your approval is reserved for {expired ? '0:00' : formatTime(timeLeft)}</span>
            <h2>Save Up to $840 Instantly</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', margin: '8px 0' }}>Pay month-to-month or bundle for major savings. No contracts. Cancel anytime.</p>
            <div className="green-line">24/7 provider access + unlimited messaging + medication — all included.</div>
          </div>

          <h3 className="meds-head">Choose your HRT protocol:</h3>
          <div className="meds-grid">
            {['patch', 'oral'].map((key) => {
              const m = MEDS[key];
              return (
                <div
                  key={key}
                  className={`med-card ${selectedMed === key ? 'selected' : ''}`}
                  onClick={() => setSelectedMed(key)}
                  role="button"
                >
                  <span className="badge">{m.badge}</span>
                  <div className="med-img-wrap">
                    <img src={m.image} alt={m.name} className="med-img" />
                  </div>
                  <div className="med-rating">
                    <span className="stars">{'★★★★★'}</span>
                    <span className="review-count">{m.rating} — {m.reviewCount} Reviews</span>
                  </div>
                  <h3>{m.product}</h3>
                  <div className="price">
                    <span className="price-num">Starting at ${m.priceFrom}/mo</span>
                    <span className="price-strike">${m.priceStrike}</span>
                  </div>
                  <ul>
                    {m.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="trust-row">
            <span>🔒 HIPAA Secure</span>
            <span>💳 HSA/FSA Approved</span>
            <span>🚚 Free Shipping</span>
            <span>✅ Cancel Anytime</span>
          </div>

          {/* Duration */}
          <div className="duration-section">
            <h3 className="meds-head">Choose your plan length:</h3>
            <div className="duration-grid">
              {DURATIONS.map((d) => {
                const price = PRICING[selectedMed][d.months];
                const isSelected = selectedDuration === d.months;
                return (
                  <div
                    key={d.months}
                    className={`dur-card ${isSelected ? 'selected' : ''} ${d.isBest ? 'best' : ''}`}
                    onClick={() => setSelectedDuration(d.months)}
                    role="button"
                  >
                    {d.badge && <span className="badge">{d.badge}</span>}
                    <div className="dur-name">{d.label}</div>
                    <div className="dur-price">${price}<span className="dur-unit">/mo</span></div>
                    <div className="dur-note">{d.note}</div>
                  </div>
                );
              })}
            </div>

            <div className="summary-box">
              Currently selected: <strong>{med.name}</strong> — <strong>{selectedDuration === 1 ? 'Month-to-Month' : `${selectedDuration} Month Plan`}</strong> — <strong>${monthly}/month</strong> — Billed as <strong>${total.toLocaleString()} every {selectedDuration === 1 ? 'month' : `${selectedDuration} months`}</strong>
            </div>

            <button className="cta-large" onClick={scrollToCheckout}>Continue to Checkout →</button>
          </div>
        </div>
      </section>

      {/* SECTION 11 — Checkout */}
      {checkoutVisible && (
        <section className="checkout-section" ref={checkoutRef}>
          <div className="container">
            <div className="checkout-card">
              <div className="secure-banner">
                <span>🛡</span>
                <span>Your data is protected by HIPAA. All transactions secured and encrypted by Stripe.</span>
              </div>

              <form onSubmit={handleCheckoutSubmit}>
                <h3 className="checkout-h">Shipping information</h3>
                <div className="form-grid">
                  <div className="form-row">
                    <label className="field-label">Email</label>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <label className="field-label">Full name</label>
                    <input className="input" type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} required />
                  </div>
                  <div className="form-row">
                    <label className="field-label">Address line 1</label>
                    <input className="input" type="text" value={form.address1} onChange={(e) => updateForm('address1', e.target.value)} required />
                  </div>
                  <div className="form-row">
                    <label className="field-label">Address line 2 (optional)</label>
                    <input className="input" type="text" value={form.address2} onChange={(e) => updateForm('address2', e.target.value)} />
                  </div>
                  <div className="form-grid three-col">
                    <div className="form-row">
                      <label className="field-label">City</label>
                      <input className="input" type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} required />
                    </div>
                    <div className="form-row">
                      <label className="field-label">State</label>
                      <select className="input" value={form.state} onChange={(e) => updateForm('state', e.target.value)} required>
                        <option value="">—</option>
                        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-row">
                      <label className="field-label">ZIP</label>
                      <input className="input" type="text" inputMode="numeric" maxLength="5" value={form.zip} onChange={(e) => updateForm('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="field-label">Phone</label>
                    <input className="input" type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
                  </div>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.billSame} onChange={(e) => updateForm('billSame', e.target.checked)} />
                    Billing address same as shipping
                  </label>
                </div>

                <h3 className="checkout-h">Payment method</h3>
                <div className="pay-tabs">
                  {[
                    { id: 'card', label: 'Card' },
                    { id: 'klarna', label: 'Klarna' },
                    { id: 'amazon', label: 'Amazon Pay' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={`pay-tab ${paymentMethod === t.id ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(t.id)}
                    >{t.label}</button>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <CardElementMount onReady={(api) => { stripeApiRef.current = api; }} />
                ) : (
                  <div className="alt-pay-info">
                    You'll be redirected to {paymentMethod === 'klarna' ? 'Klarna' : 'Amazon Pay'} to complete payment after clicking submit.
                  </div>
                )}

                <p className="agree">
                  By subscribing, you authorize Her Estrogen to charge you <strong>${total.toLocaleString()}.00 today</strong> and <strong>${total.toLocaleString()}.00 every {selectedDuration === 1 ? 'month' : `${selectedDuration} months`}</strong> until you cancel. Cancel anytime with 72 hours notice before renewal.
                </p>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Processing…' : 'Start My HRT Journey →'}
                </button>

                <div className="guarantee">
                  🔒 <strong>Provider Guarantee</strong> — If our licensed provider determines HRT is not right for you, you receive a full refund. No questions asked.
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 12 — Research + Stats */}
      <section className="research-section">
        <div className="container">
          <div className="research-label">Backed by clinical research from</div>
          <div className="research-logos">
            <div className="research-logo">Mayo Clinic</div>
            <div className="research-logo">Harvard Medical School</div>
            <div className="research-logo">NIH</div>
            <div className="research-logo">The Menopause Society</div>
            <div className="research-logo">NAMS</div>
          </div>
          <h2 className="stats-title">What makes Her Estrogen so much <em>better</em> than anything else?</h2>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13 — Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">The results <em>speak for themselves</em></h2>
          <p className="section-sub">Her Estrogen success stories are coming in, and we can't get enough.</p>
          <div className="reviews-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="review" key={i}>
                <div className="stars">★★★★★</div>
                <h4>{t.title}</h4>
                <div className="review-body">"{t.body}"</div>
                <div className="review-author">
                  <span className="name">{t.name}</span>
                  <span className="verified">✅ Verified patient</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14 — Final CTA */}
      <section className="final-cta">
        <div className="narrow">
          <span className="pill">Are You Ready?</span>
          <h2>Start Your Hormone Restoration Today</h2>
          <p className="timer-text">Your pre-approval expires in {expired ? '0:00' : formatTime(timeLeft)}</p>
          <div className="green-bar">HRT protocols start at just $149 — no insurance required</div>
          <p className="subhead">The most effective women's hormone program is right here.</p>
          <div className="incl">
            <ul>
              <li>Access to Bioidentical HRT — medication cost included</li>
              <li>No insurance required</li>
              <li>Board-certified licensed provider review</li>
              <li>1:1 Provider guidance and messaging</li>
              <li>Hormone health report — personalized to your profile</li>
              <li>Free shipping, always</li>
            </ul>
          </div>
          <p className="fineprint">Pay one month at a time. No contracts. Cancel anytime.</p>
          <button onClick={scrollToPricing} className="cta-cream">Choose My Plan →</button>
        </div>
      </section>

      {/* SECTION 15 — FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title center">Frequently Asked <em>Questions</em></h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((f, i) => (
              <div key={i} className={'faq-item' + (openFaq === i ? ' open' : '')}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-a"><div style={{ paddingRight: 40 }}>{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 16 — Disclaimer */}
      <section className="disclaimer-section">
        <div className="disclaimer">
          *The assessment completed on the Her Estrogen website does not create a doctor-patient relationship. A licensed provider from our clinical partner network will review your intake after checkout to determine if HRT is appropriate. Licensed providers retain the decision to prescribe. Results from bioidentical HRT may vary. Her Estrogen is not a healthcare provider — we coordinate access to licensed clinical services. HSA/FSA eligibility is determined by your plan administrator. Compounded medications are not FDA-evaluated for safety or efficacy as finished products. All data is protected under HIPAA.
        </div>
        <div className="footer-links">
          <a href="privacy.html">Privacy Policy</a>·
          <a href="terms.html">Terms of Service</a>·
          <a href="privacy.html">HIPAA Notice</a>·
          <a href="terms.html#refunds">Refund Policy</a>·
          <a href="mailto:support@herestrogen.com">Contact Us</a>
        </div>
      </section>

      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-check">✓</div>
            <h2>You're officially a Her Estrogen member, {firstName}!</h2>
            <p className="sub">Your intake has been sent to a licensed provider. You will receive a review within 24 hours. Check your email at <strong>{email}</strong> for next steps.</p>
            <div className="steps-row">
              <div className="success-step"><div className="n">01</div><div className="t">Provider review</div><div>Within 24 hours</div></div>
              <div className="success-step"><div className="n">02</div><div className="t">Custom prescription</div><div>Compounded for you</div></div>
              <div className="success-step"><div className="n">03</div><div className="t">Shipped to your door</div><div>Free, discreet, fast</div></div>
            </div>
            <div className="success-actions">
              <button className="success-btn primary">Add to Calendar</button>
              <button className="success-btn">Download App</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
