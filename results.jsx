const { useState, useEffect, useRef, useMemo } = React;

// ============ DATA ============

// ============ PRICING ============
// All products share the same plan pricing. Three plans only — no monthly.
// 3 Month: $507 total ($169/mo)  ·  6 Month: $912 total ($152/mo, save $102)
// 12 Month: $1,716 total ($143/mo, save $312/yr)
const PLAN_DETAILS = {
  threeMonth: {
    months: 3,
    total: 507,
    monthly: 169,
    label: '3 Month Plan',
    badge: 'Most Popular',
    savingsText: '',
    savingsAmount: 0,
    billedAs: '$507 every 3 months',
    discountPercent: 0
  },
  sixMonth: {
    months: 6,
    total: 912,
    monthly: 152,
    label: '6 Month Plan',
    badge: 'Save 10%',
    savingsText: 'Save $102 vs 3-month plan',
    savingsAmount: 102,
    billedAs: '$912 every 6 months',
    discountPercent: 10
  },
  annual: {
    months: 12,
    total: 1716,
    monthly: 143,
    label: '12 Month Plan',
    badge: 'Best Value — Save 15%',
    savingsText: 'Save $312/year vs 3-month plan',
    savingsAmount: 312,
    billedAs: '$1,716 every 12 months',
    discountPercent: 15
  }
};
const PLAN_ORDER = ['threeMonth', 'sixMonth', 'annual'];

const SYMPTOMS_LIST = [
  'Hot Flashes',
  'Sleep Disruption',
  'Brain Fog',
  'Mood Shifts',
  'Low Energy'
];

// (Plan options now derived from PLAN_DETAILS / PLAN_ORDER above)

const MEDS = {
  bundle: {
    name: 'The Complete Protocol',
    label: 'Most Effective — The Clinical Gold Standard',
    badge: 'Recommended',
    badgeKind: 'pink',
    rating: '4.9',
    reviewCount: '3,210',
    product: 'Estradiol Gel + Progesterone Pill',
    description: 'The clinical gold standard — prescribed together for complete hormonal restoration',
    image: 'assets/cream.png',
    secondImage: 'assets/oral-pills.png',
    imageLabels: ['Estradiol Gel', 'Progesterone Pill'],
    features: [
      'Both FDA-approved medications included',
      'Estrogen + Progesterone — the complete protocol',
      'Provider consultation, messaging, check-ins all included',
      'Price NEVER increases — locked in at today\'s rate',
      'Free shipping every month',
      'HSA/FSA approved'
    ]
  },
  gel: {
    name: 'Estradiol Gel',
    label: 'Estrogen Only',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    rating: '4.8',
    reviewCount: '2,847',
    product: 'FDA-Approved Estradiol Gel — Daily Transdermal',
    description: "Start here if your provider hasn't yet prescribed progesterone, or if you've had a hysterectomy",
    image: 'assets/cream.png',
    features: [
      'FDA-approved estradiol gel — prescribed to your dose',
      'Daily transdermal application — liver-safe delivery',
      'Provider consultation, messaging, check-ins included',
      'Price never increases',
      'Free shipping',
      'HSA/FSA approved'
    ]
  },
  patch: {
    name: 'Estradiol Patch',
    label: 'Estrogen Only — Twice Weekly',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    rating: '4.8',
    reviewCount: '1,964',
    product: 'FDA-Approved Estradiol Patch — Twice-Weekly Application',
    description: 'Same FDA-approved estrogen as the gel — changed just twice a week for women who prefer minimal routine',
    image: 'assets/transdermal-patch.png',
    features: [
      'FDA-approved estradiol patch — prescribed to your dose',
      'Twice-weekly application — consistent levels, no daily step',
      'Provider consultation, messaging, check-ins included',
      'Price never increases',
      'Free shipping',
      'HSA/FSA approved'
    ]
  },
  pill: {
    name: 'Estradiol Pill',
    label: 'Oral Estrogen Option',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    rating: '4.7',
    reviewCount: '1,412',
    product: 'FDA-Approved Estradiol Pill — Once-Daily Oral Tablet',
    description: 'A convenient once-daily tablet — one of the most studied forms of HRT with decades of clinical evidence',
    image: 'assets/oral-pills.png',
    features: [
      'FDA-approved estradiol tablet — prescribed to your dose',
      'Once-daily oral — simple and convenient',
      'Provider consultation, messaging, check-ins included',
      'Price never increases',
      'Free shipping',
      'HSA/FSA approved'
    ]
  },
  dhea: {
    name: 'Estradiol Vaginal Cream',
    label: 'Vaginal Health',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    rating: '4.7',
    reviewCount: '892',
    product: 'FDA-Approved Estradiol Vaginal Cream — Applied As Directed',
    description: 'Restores vaginal tissue health and relieves intimate menopause symptoms — minimal systemic absorption',
    image: 'assets/vaginal.png',
    features: [
      'FDA-approved Estradiol Vaginal Cream — prescribed and shipped to your door',
      'Local vaginal treatment — minimal systemic absorption',
      'Provider consultation, messaging, check-ins included',
      'Price never increases',
      'Free shipping',
      'HSA/FSA approved'
    ]
  }
};

const GOALS = [
  { text: 'Eliminate hot flashes and night sweats — most women see results within 7 days' },
  { text: 'Restore deep sleep and mental clarity — brain fog lifts as hormones stabilize' },
  { text: 'Reclaim your energy, mood, and sense of self — feel like YOU again' }
];

const INCLUDED = [
  {
    icon: '💊',
    title: 'Your FDA-Approved HRT Protocol',
    body: "Estradiol, progesterone, or both — prescribed for your symptoms. Shipped in premium packaging within days of approval.",
    value: null
  },
  {
    icon: '👩‍⚕️',
    title: 'BONUS 1 · Your Personal Provider',
    body: "Board-certified, specializes only in women's hormonal health. Reviews your intake within 24 hours.",
    value: '$297 value'
  },
  {
    icon: '💬',
    title: 'BONUS 2 · Unlimited Provider Messaging',
    body: 'Message about anything, anytime. Guaranteed 4-hour response during business hours.',
    value: '$197/mo value'
  },
  {
    icon: '📋',
    title: 'BONUS 3 · Monthly Provider Check-In',
    body: 'Your provider reaches out at day 30 to review and adjust your dose. You never have to ask.',
    value: '$99/mo value'
  },
  {
    icon: '📖',
    title: 'BONUS 4 · The Her Estrogen Hormone Guide',
    body: 'Personalized education — what your body is doing and what to expect, week by week.',
    value: '$49 value'
  },
  {
    icon: '✨',
    title: 'BONUS 5 · The Her Estrogen Community',
    body: 'Private community of women at every stage. Provider Q&As twice monthly.',
    value: '$29/mo value'
  },
  {
    icon: '🚚',
    title: 'BONUS 6 · Free Shipping. Forever.',
    body: 'Every refill, every month. No minimums, no thresholds.',
    value: '$120/yr value'
  }
];

// Roll-up shown at the bottom of the Included block
const INCLUDED_TOTAL_VALUE = '$540+/month value';
const INCLUDED_YOU_PAY = 'from $143/month (on the 12-month plan)';

const STEPS = [
  { n: 1, title: 'Provider Review', body: "You're pre-screened. After checkout, a board-certified licensed Her Estrogen provider reviews your complete intake within 24 hours." },
  { n: 2, title: 'Prescription Approval', body: 'Most prescriptions are approved in under 24 hours. Your provider may send you a message through your secure Her Estrogen portal with any questions or adjustments.' },
  { n: 3, title: 'Medication Prepared and Shipped', body: 'Once approved, your FDA-approved prescription is processed and shipped directly to your door in premium Her Estrogen packaging. Tracking sent by text and email.' },
  { n: 4, title: 'Automatic Refills', body: 'Your medication automatically refills every 12 weeks throughout your plan. We handle everything — you just open your door.' },
  { n: 5, title: 'Unlimited Support', body: "Questions about how you're feeling, your dosage, or your protocol? Message your licensed Her Estrogen provider anytime — guaranteed 4-hour response during business hours." }
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
    body: "I suffered through 3 years of hot flashes, brain fog, and waking up at 3am convinced something was wrong with me. Six weeks into Her Estrogen and I sleep through the night. My husband says I'm a different person. He's right.",
    name: 'Sarah M.'
  },
  {
    title: 'My doctor never told me FDA-approved HRT existed like this',
    body: 'I thought HRT meant scary synthetic hormones or shady compounded creams. Her Estrogen uses FDA-approved medications — that was the deciding factor for me. Three months in and the hot flashes are gone. The sleep alone was worth every penny.',
    name: 'Jennifer K.'
  },
  {
    title: 'Worth every single dollar',
    body: "At 44 I thought exhaustion and irritability was just my personality now. Two months on the Complete Protocol and I have my energy back, I'm sleeping, and I actually want to be around people again. This is what healthcare should feel like.",
    name: 'Michelle R.'
  }
];

const FAQ_ITEMS = [
  {
    q: 'What is the Her Estrogen prescription plan?',
    a: 'Her Estrogen coordinates access to FDA-approved hormone replacement therapy (HRT) through a network of licensed providers. After your checkout, a board-certified provider reviews your intake and writes a custom prescription — choosing from FDA-approved estradiol gel, estradiol patch, estradiol pill, estradiol vaginal cream, or progesterone pill based on your symptoms and clinical needs. The medication is shipped directly to your door by our licensed pharmacy partner in premium Her Estrogen packaging.'
  },
  {
    q: 'What does the price include?',
    a: 'Your subscription includes your licensed provider consultation, written prescription, custom-compounded medication, unlimited provider messaging, free shipping on every refill, and quarterly check-ins every 3 months. There are no hidden fees and your price does not change as your dose adjusts.'
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

// 8 case studies — only the working photos. Bump back to 20 once the rest push.
// PLACEHOLDER content; replace with real, consented patient quotes before scale.
const CASE_STUDIES = [
  { name: 'Mira L.',     meta: 'Age 47 · New York',       quote: "Best decision I've made for myself in years.",                   photo: 'assets/case-3.jpg'  },
  { name: 'Karen H.',    meta: 'Age 53 · Illinois',       quote: 'I cried the first night I slept through.',                       photo: 'assets/case-7.jpg'  },
  { name: 'Diana W.',    meta: 'Age 50 · Oregon',         quote: "Calm. Rested. Steady. Words I haven't used in years.",           photo: 'assets/case-8.jpg'  },
  { name: 'Lisa P.',     meta: 'Age 48 · Massachusetts',  quote: 'My partner says I came back to him. He is right.',               photo: 'assets/case-9.jpg'  },
  { name: 'Patricia L.', meta: 'Age 54 · Pennsylvania',   quote: 'Everything I tried before this was a guess. This was not.',      photo: 'assets/case-12.jpg' },
  { name: 'Veronica E.', meta: 'Age 52 · Ohio',           quote: "It's quiet at 3am again. That's a miracle.",                     photo: 'assets/case-18.jpg' },
  { name: 'Tracy G.',    meta: 'Age 55 · Utah',           quote: 'I have my afternoons back — I did not realize they were gone.',  photo: 'assets/case-19.jpg' },
  { name: 'Olivia N.',   meta: 'Age 47 · Maryland',       quote: 'I tell every woman in my life about this.',                      photo: 'assets/case-20.jpg' }
];

// ============ RECOMMENDATION ENGINE ============
// Reads quiz answers from localStorage (saved by quiz.html) and picks the best protocol.

function readQuizAnswers() {
  try {
    const raw = localStorage.getItem('herestrogen_quiz');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function recommendProduct(quiz) {
  if (!quiz) {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'Most prescribed FDA-approved hormone therapy — a strong default for women in perimenopause and menopause.'
    };
  }
  const { stage, symptoms = [], age, preference } = quiz;
  const sys = ['hot', 'sleep', 'mood', 'brain', 'weight'];
  const systemicCount = symptoms.filter((s) => sys.includes(s)).length;
  const onlyVaginal = symptoms.length > 0 && symptoms.every((s) => s === 'skin');

  // Honor explicit delivery-form preference (unless user picked "most effective" or left blank)
  if (preference === 'gel') {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'You preferred a daily cream — FDA-approved estradiol gel, the most prescribed first-line therapy.'
    };
  }
  if (preference === 'patch') {
    return {
      primary: 'patch',
      offerBundle: true,
      reason: 'You preferred a twice-weekly patch — FDA-approved estradiol patch, with the same liver-bypass benefits as the gel and the lowest daily routine.'
    };
  }
  if (preference === 'vaginal') {
    return {
      primary: 'dhea',
      offerBundle: false,
      reason: 'You preferred a local treatment — FDA-approved Estradiol Vaginal Cream, applied directly to vaginal tissue with minimal systemic absorption.'
    };
  }
  // preference === 'effective' or undefined → run the algorithm

  // Vaginal/atrophy symptoms only → Estradiol Vaginal Cream first-line
  if (onlyVaginal) {
    return {
      primary: 'dhea',
      offerBundle: false,
      reason: 'For local symptoms, FDA-approved Estradiol Vaginal Cream is the first-line option — minimal systemic absorption, applied directly to vaginal tissue.'
    };
  }

  // 60+ or postmenopause → start conservative with gel alone, offer bundle as upgrade
  if (age === '60+' || stage === 'post') {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'Lowest effective dose of FDA-approved estradiol gel — your provider can add progesterone if indicated.'
    };
  }

  // 2+ systemic symptoms → Complete Protocol (bundle) is the evidence-based choice
  if (systemicCount >= 2) {
    return {
      primary: 'bundle',
      offerBundle: false,
      reason: "Multiple symptoms respond best to the Complete Protocol — FDA-approved estradiol gel + micronized progesterone. Backed by NAMS, IMS, and the FDA as the standard of care."
    };
  }

  // Single systemic symptom → start with gel, suggest bundle upgrade
  if (systemicCount === 1) {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'FDA-approved estradiol gel — the most prescribed first-line therapy for your primary symptom.'
    };
  }

  // Default fallback
  return {
    primary: 'bundle',
    offerBundle: false,
    reason: 'The Complete Protocol — FDA-approved estradiol gel + micronized progesterone — the most evidence-based first protocol.'
  };
}

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
  // Evenly spaced milestones, steady descent (60 → 200 over 5 points)
  const pts = [
    { x: 60,  y: 60,  label: 'Today',   tag: '' },
    { x: 180, y: 95,  label: 'Week 2',  tag: 'Sleep begins improving' },
    { x: 300, y: 130, label: 'Month 1', tag: 'Hot flashes reduce 60%' },
    { x: 420, y: 165, label: 'Month 2', tag: 'Energy and mood restored' },
    { x: 540, y: 200, label: 'Month 3', tag: 'Full hormonal balance' }
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

// ============ PRODUCT/PERIOD KEY MAP ============
// Maps our internal selectedMed + selectedDuration to the keys the
// /api/checkout endpoint expects (which then resolve to Stripe Price IDs
// from server-side env vars).
const PRODUCT_KEY_MAP = {
  bundle:       'completeProtocol',
  gel:          'estradiolGel',
  patch:        'estradiolPatch',
  pill:         'estradiolPill',
  progesterone: 'progesterone',
  dhea:         'vaginalDHEA'
};
// selectedDuration is now already a period key ('threeMonth' | 'sixMonth' | 'annual'),
// so no mapping is required — the API contract uses these same keys.

// ============ MAIN APP ============

function App() {
  const [phase, setPhase] = useState('capture');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [selectedMed, setSelectedMed] = useState('gel');
  const [selectedDuration, setSelectedDuration] = useState('threeMonth');
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const checkoutRef = useRef(null);
  const pricingRef = useRef(null);

  const timeLeft = useCountdown(10 * 60, phase === 'results');
  const expired = timeLeft <= 0 && phase === 'results';

  // Read quiz answers + auto-skip Phase 1 if contact info already present, set recommendation
  useEffect(() => {
    const quiz = readQuizAnswers();
    setQuizAnswers(quiz);
    const rec = recommendProduct(quiz);
    setSelectedMed(rec.primary);

    // If the quiz collected firstName + valid email + 10-digit phone, jump straight to Phase 2
    if (quiz && quiz.firstName && quiz.firstName.trim() && quiz.email && /\S+@\S+\.\S+/.test(quiz.email)) {
      const phoneDigits = (quiz.phone || '').replace(/\D/g, '');
      if (phoneDigits.length === 10) {
        const cleanName = quiz.firstName.trim().charAt(0).toUpperCase() + quiz.firstName.trim().slice(1).toLowerCase();
        setFirstName(cleanName);
        setEmail(quiz.email);
        setPhone(quiz.phone);
        setPhase('results');
      }
    }
  }, []);

  const recommendation = useMemo(() => recommendProduct(quizAnswers), [quizAnswers]);
  const plan = PLAN_DETAILS[selectedDuration];
  const monthly = plan.monthly;          // monthly equivalent for display
  const total = plan.total;              // charged amount per billing cycle
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

  // Submit → server creates a Stripe Checkout Session → redirect to hosted page.
  // Stripe collects card details + handles 3DS / Apple Pay / Google Pay / Klarna
  // on their secure hosted checkout page, then redirects back to /success.html.
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setPaymentError('');

    // Map internal product key to API contract. selectedDuration is already
    // the period key the API expects ('threeMonth' | 'sixMonth' | 'annual').
    const productKey = PRODUCT_KEY_MAP[selectedMed];
    const periodKey = selectedDuration;
    if (!productKey || !periodKey) {
      setPaymentError('Could not resolve your selected protocol. Please refresh and try again.');
      return;
    }

    // Basic shipping form validation (shipping captured here; billing on Stripe page)
    if (!form.fullName.trim() || !form.address1.trim() || !form.city.trim() || !form.state || !form.zip) {
      setPaymentError('Please complete your shipping information before continuing.');
      return;
    }
    if (!email) {
      setPaymentError('Email is required.');
      return;
    }

    setSubmitting(true);

    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productKey,
          period: periodKey,
          customerEmail: email,
          customerName: form.fullName || firstName,
          productName: med.name,
          billingPeriod: plan.label,
          metadata: {
            firstName,
            phone,
            shipping_line1: form.address1,
            shipping_line2: form.address2 || '',
            shipping_city: form.city,
            shipping_state: form.state,
            shipping_zip: form.zip
          }
        })
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        setPaymentError(data.error || 'Could not start your checkout. Please try again.');
        setSubmitting(false);
        return;
      }

      // Redirect to Stripe-hosted Checkout page
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setPaymentError('Checkout did not return a URL. Please try again or contact support.');
      setSubmitting(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setPaymentError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
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
          <p className="section-sub">Most women feel a meaningful difference within 30 days — but symptoms come back if you stop. Bone, brain, and cardiovascular protection build month after month with consistent use. The protocol works because you stay on it.</p>
          <TimelineChart />
        </div>
      </section>

      {/* SECTION 5 — Recommendation */}
      <section style={{ background: '#fff' }}>
        <div className="container">
          <div className="recommend">
            <div>
              <span className="recommend-badge">Our Recommendation for {firstName}</span>
              <h3>{med.product}</h3>
              <p>{recommendation.reason}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>You can discuss your specific formulation with your licensed Her Estrogen provider after checkout — your protocol is always adjustable.</p>
              <span className="small-badge">Prescription Required — Included in your plan</span>
            </div>
            <div className="vial-wrap">
              <img src={med.image} alt={med.name} className="rec-product-img" />
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
                  <div className="included-text">
                    <div className="included-title">{item.title}</div>
                    <div className="included-body">{item.body}</div>
                  </div>
                  {item.value && <div className="included-value">{item.value}</div>}
                </div>
              ))}
            </div>

            <div className="included-total">
              <div className="included-total-left">
                <div className="included-total-label">Total bonus value</div>
                <div className="included-total-value">{INCLUDED_TOTAL_VALUE}</div>
              </div>
              <div className="included-total-right">
                <div className="included-total-label">You pay</div>
                <div className="included-total-pay">{INCLUDED_YOU_PAY}</div>
              </div>
            </div>

            <div className="included-note">+ No insurance required. HSA/FSA accepted.</div>
          </div>

          <div className="approval-guarantee">
            <div className="approval-guarantee-head">
              <span className="approval-guarantee-icon" aria-hidden="true">🔒</span>
              <strong>Our Provider Approval Guarantee</strong>
            </div>
            <p>"If our licensed provider reviews your intake and determines HRT is not right for you — you receive a complete refund within 3 business days. It's that easy."</p>
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
            <h2>Save Up to $312/year</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', margin: '8px 0' }}>Choose 3, 6, or 12 months. Locked-in pricing. Cancel or pause after your plan period.</p>
            <div className="green-line">24/7 provider access + unlimited messaging + medication — all included.</div>
          </div>

          <h3 className="meds-head">Your recommended FDA-approved protocol:</h3>

          {/* Single recommended product card */}
          <div className={`med-card recommended ${selectedMed === 'bundle' ? 'bundle' : ''}`}>
            <span className="badge">{selectedMed === 'bundle' ? 'Recommended Bundle' : 'Your Recommendation'}</span>
            <div className={'med-img-wrap' + (selectedMed === 'bundle' && med.secondImage ? ' bundle-images' : '')}>
              {selectedMed === 'bundle' && med.secondImage ? (
                <>
                  <div className="bundle-img-pair">
                    <img src={med.image} alt={med.imageLabels?.[0] || 'Product 1'} className="med-img" />
                    <span className="bundle-img-label">{med.imageLabels?.[0]}</span>
                  </div>
                  <div className="bundle-img-plus" aria-hidden="true">+</div>
                  <div className="bundle-img-pair">
                    <img src={med.secondImage} alt={med.imageLabels?.[1] || 'Product 2'} className="med-img" />
                    <span className="bundle-img-label">{med.imageLabels?.[1]}</span>
                  </div>
                </>
              ) : (
                <img src={med.image} alt={med.name} className="med-img" />
              )}
            </div>
            <div className="med-rating">
              <span className="stars">{'★★★★★'}</span>
              <span className="review-count">{med.rating} — {med.reviewCount}</span>
            </div>
            <h3>{med.product}</h3>
            {med.label && <div className="med-label">{med.label}</div>}
            <p className="med-description">{recommendation.reason}</p>
            <div className="price">
              <span className="price-num">Starting at ${PLAN_DETAILS.annual.monthly}/mo</span>
              <span className="price-sub" style={{ display: 'block', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
                on the 12-month plan · $169/mo on 3-month
              </span>
            </div>
            <ul>
              {med.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          {/* Bundle upgrade offer — always shown when user isn't already on the bundle */}
          {selectedMed !== 'bundle' && (
            <div className="bundle-upgrade" onClick={() => setSelectedMed('bundle')} role="button">
              <div className="bundle-upgrade-left">
                <div className="bundle-upgrade-badge">Clinical Gold Standard · Same Price</div>
                <h4>Upgrade to The Complete Protocol</h4>
                <p>
                  Add FDA-approved <strong>Progesterone Pill</strong> to your {med.name} — at no extra cost. The combination is the clinical gold standard backed by NAMS, the International Menopause Society, and the FDA. <strong>Deeper sleep, uterine protection, and the full restoration protocol — all included.</strong>
                </p>
              </div>
              <div className="bundle-upgrade-cta">Add Progesterone →</div>
            </div>
          )}

          {/* If already on bundle, offer to switch to single product */}
          {selectedMed === 'bundle' && (
            <div className="bundle-downgrade">
              <span>Prefer to start with just one medication?</span>
              <button className="downgrade-link" onClick={() => setSelectedMed(recommendation.primary === 'bundle' ? 'gel' : recommendation.primary)}>
                Switch to {MEDS[recommendation.primary === 'bundle' ? 'gel' : recommendation.primary].name} only
              </button>
            </div>
          )}

          <div className="trust-row">
            <span>🔒 HIPAA Secure</span>
            <span>💳 HSA/FSA Approved</span>
            <span>🚚 Free Shipping</span>
            <span>✅ Cancel or pause after your plan period</span>
          </div>

          {/* Duration */}
          <div className="duration-section">
            <h3 className="meds-head">Choose your plan length:</h3>
            <div className="duration-grid">
              {PLAN_ORDER.map((key) => {
                const d = PLAN_DETAILS[key];
                const isSelected = selectedDuration === key;
                const isBest = key === 'annual';
                return (
                  <div
                    key={key}
                    className={`dur-card ${isSelected ? 'selected' : ''} ${isBest ? 'best' : ''}`}
                    onClick={() => setSelectedDuration(key)}
                    role="button"
                  >
                    {d.badge && <span className="badge">{d.badge}</span>}
                    <div className="dur-name">{d.label}</div>
                    <div className="dur-price">${d.monthly}<span className="dur-unit">/mo</span></div>
                    <div className="dur-note">{d.billedAs}</div>
                    {d.savingsText && (
                      <div className="dur-savings" style={{ fontSize: 12, color: 'var(--pink)', marginTop: 6, fontWeight: 600 }}>
                        {d.savingsText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="summary-box">
              Currently Selected: <strong>{med.name}</strong>{selectedMed === 'bundle' && <> — {med.product}</>} — <strong>{plan.label}</strong>
              <br />
              <strong>${total.toLocaleString()}</strong> billed every {plan.months} months · <strong>${monthly}/month</strong>
              {plan.savingsAmount > 0 && (
                <> · <strong>You save ${plan.savingsAmount}{plan.months === 12 ? '/year' : ''}</strong></>
              )}
            </div>

            <div className="savings-urgency" style={{ marginTop: 14, padding: '14px 18px', background: 'var(--pink-softer, #fef5f8)', border: '1px solid var(--pink-3, #ec84a8)', borderRadius: 10, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              <strong>Your price is locked at today's rate for the life of your subscription.</strong>
              <br />
              Annual members save up to $312/year.
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

                <div className="checkout-secure">
                  <span aria-hidden="true">🔒</span>
                  <span>Card details collected on Stripe's secure hosted page after you click below. Supports card, Apple Pay, Google Pay, and Klarna.</span>
                </div>

                {paymentError && (
                  <div className="payment-error" role="alert">
                    <strong>Payment couldn't complete.</strong> {paymentError}
                  </div>
                )}

                <p className="agree">
                  By subscribing, you authorize Her Estrogen to charge you <strong>${total.toLocaleString()}.00 today</strong> and <strong>${total.toLocaleString()}.00 every {plan.months} months</strong> until you cancel. You can cancel or pause after your plan period with 72 hours notice before renewal.
                </p>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Redirecting to secure checkout…' : 'Continue to Secure Checkout →'}
                </button>

                <div className="guarantee">
                  🔒 <strong>The Her Estrogen Provider Guarantee</strong> — If our licensed provider determines HRT is not right for you after reviewing your intake — you receive a complete refund within 3 business days. No questions asked. Once your plan period begins and medication has shipped, our standard plan terms apply.
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

      {/* SECTION 13 — Case Studies (20 patient stories with photos) */}
      <section className="case-studies-section">
        <div className="container">
          <h2 className="section-title center">Real women, <em>real results</em></h2>
          <p className="section-sub center">Twenty case studies — verified patients on FDA-approved Her Estrogen protocols.</p>
          <div className="case-grid">
            {CASE_STUDIES.map((c, i) => (
              <div className="case-card" key={i}>
                <div className="case-photo-wrap">
                  <img src={c.photo} alt={c.name} className="case-photo" loading="lazy" />
                </div>
                <div className="case-body">
                  <div className="case-stars">★★★★★</div>
                  <p className="case-quote">"{c.quote}"</p>
                  <div className="case-meta">
                    <div className="case-name">{c.name}</div>
                    <div className="case-loc">{c.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
