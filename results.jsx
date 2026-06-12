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

// Audit findings C-06, H-13, C-11: removed rating/reviewCount fields. Site
// is pre-launch — no real reviews exist. Restore only with verified data.
// Audit finding H-19: removed "custom-compounded" / "bioidentical" framing
// where it conflicts with the FDA-approved product line.
const MEDS = {
  bundle: {
    name: 'The Complete Protocol',
    label: 'Estradiol + Progesterone',
    badge: 'Often Prescribed',
    badgeKind: 'pink',
    product: 'Estradiol Gel + Progesterone Pill',
    description: 'When clinically appropriate, FDA-approved estradiol and oral progesterone are commonly prescribed together for hormone therapy.',
    image: 'assets/cream.png',
    secondImage: 'assets/oral-pills.png',
    imageLabels: ['Estradiol Gel', 'Progesterone Pill'],
    features: [
      'FDA-approved estradiol + FDA-approved oral progesterone',
      'Clinician consultation, messaging, and check-ins during your plan',
      'Price locked in at today\'s rate for your plan term',
      'Free shipping',
      'HSA/FSA accepted'
    ]
  },
  gel: {
    name: 'Estradiol Gel',
    label: 'Estradiol — Topical Gel',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    product: 'FDA-approved estradiol gel',
    description: 'A topical estradiol gel — one of several FDA-approved forms of estrogen therapy your clinician may consider.',
    image: 'assets/cream.png',
    features: [
      'FDA-approved estradiol gel — dose set by the clinician',
      'Daily topical application',
      'Clinician consultation, messaging, and check-ins during your plan',
      'Price locked in at today\'s rate for your plan term',
      'Free shipping',
      'HSA/FSA accepted'
    ]
  },
  patch: {
    name: 'Estradiol Patch',
    label: 'Estradiol — Transdermal Patch',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    product: 'FDA-approved estradiol patch',
    description: 'A twice-weekly transdermal estradiol patch — one of several FDA-approved forms of estrogen therapy your clinician may consider.',
    image: 'assets/estradiol-patch.png?v=2',
    features: [
      'FDA-approved estradiol patch — dose set by the clinician',
      'Twice-weekly application',
      'Clinician consultation, messaging, and check-ins during your plan',
      'Price locked in at today\'s rate for your plan term',
      'Free shipping',
      'HSA/FSA accepted'
    ]
  },
  pill: {
    name: 'Estradiol Pill',
    label: 'Estradiol — Oral Tablet',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    product: 'FDA-approved oral estradiol tablet',
    description: 'A once-daily oral estradiol tablet — one of several FDA-approved forms of estrogen therapy your clinician may consider.',
    image: 'assets/oral-pills.png',
    features: [
      'FDA-approved estradiol tablet — dose set by the clinician',
      'Once-daily oral',
      'Clinician consultation, messaging, and check-ins during your plan',
      'Price locked in at today\'s rate for your plan term',
      'Free shipping',
      'HSA/FSA accepted'
    ]
  },
  dhea: {
    name: 'Estradiol Vaginal Cream',
    label: 'Estradiol — Vaginal Cream',
    badge: 'FDA-Approved',
    badgeKind: 'pink',
    product: 'FDA-approved estradiol vaginal cream',
    description: 'A vaginal estradiol cream — used for local treatment when clinically appropriate.',
    image: 'assets/vaginal.png',
    features: [
      'FDA-approved estradiol vaginal cream',
      'Local application; minimal systemic absorption',
      'Clinician consultation, messaging, and check-ins during your plan',
      'Price locked in at today\'s rate for your plan term',
      'Free shipping',
      'HSA/FSA accepted'
    ]
  }
};

// Goals reframed as conversation topics, not guaranteed outcomes (audit
// findings C-11, FTC §5). Specific time-to-relief claims removed.
const GOALS = [
  { text: 'Discuss vasomotor symptoms (hot flashes, night sweats) with your clinician' },
  { text: 'Discuss sleep, mood, and cognitive symptoms in the context of hormone changes' },
  { text: 'Build a personalized plan with a licensed clinician — adjusted over time based on how you feel' }
];

// "What's included" rewritten to drop unsubstantiated dollar "values" and
// "guaranteed" SLAs (audit findings H-14, C-11, H-05).
const INCLUDED = [
  {
    icon: '💊',
    title: 'FDA-approved medication (if prescribed)',
    body: "If a clinician approves treatment, your medication ships from a licensed pharmacy partner. Specific protocol is determined by the clinician.",
    value: null
  },
  {
    icon: '👩‍⚕️',
    title: 'Licensed clinician via OpenLoop Health',
    body: "A clinician licensed in your state reviews your intake — typically within 1–2 business days. Treatment is subject to clinician determination and is not guaranteed.",
    value: null
  },
  {
    icon: '💬',
    title: 'Messaging during your plan',
    body: 'Message the clinical team during your plan about dosing or how you are feeling. Response times vary by clinician availability.',
    value: null
  },
  {
    icon: '📋',
    title: 'Periodic clinician check-ins',
    body: 'Periodic check-ins to review progress and discuss any dose changes the clinician recommends.',
    value: null
  },
  {
    icon: '📖',
    title: 'Educational resources',
    body: 'Plain-language information about hormone changes, treatment options, and what to discuss with your clinician.',
    value: null
  },
  {
    icon: '🚚',
    title: 'Free shipping',
    body: 'No shipping charges on plan medications.',
    value: null
  }
];

// Roll-up — removed unsubstantiated "$540+/month value" claim.
const INCLUDED_TOTAL_VALUE = '';
const INCLUDED_YOU_PAY = 'from $143/month on the 12-month plan';

// Audit findings H-07, H-14: removed hard SLA promises ("24 hours",
// "guaranteed 4-hour response"). Reconciled with Terms §6: treatment is
// subject to clinician determination and not guaranteed.
const STEPS = [
  { n: 1, title: 'Clinician review', body: "After checkout, a licensed clinician via our medical partner, OpenLoop Health, reviews your intake — typically within 1–2 business days. Treatment is subject to clinician determination and is not guaranteed." },
  { n: 2, title: 'Treatment decision', body: 'The clinician decides whether hormone therapy is clinically appropriate for you. If approved, they may message you with dose questions through your secure portal. If not approved, your subscription payment is refunded per the refund policy below.' },
  { n: 3, title: 'Medication shipped (if prescribed)', body: 'If prescribed, your medication is shipped from a licensed pharmacy partner. Shipping windows vary by state. Tracking sent by email.' },
  { n: 4, title: 'Refills', body: 'During your plan, refills are sent on a regular schedule. You can cancel before any renewal — see Terms §7 for renewal and cancellation details.' },
  { n: 5, title: 'Ongoing support', body: "Message the clinical team during your plan about dosing or how you're feeling. Response times vary by clinician availability." }
];

// Audit finding C-11: efficacy stats removed pending sourced citations.
// "87% relief in 30 days", "94% continuation", "5+ years average" cannot be
// from a pre-launch site. Restore only with peer-reviewed citations visible
// at the point of claim (WHI, KEEPS, ELITE, etc.), reviewed by counsel.
const STATS = [];

// Audit findings C-06, H-13: fabricated testimonials removed. Restore only
// with named, consenting customers + typicality disclosure per 16 CFR Part 465.
const TESTIMONIALS = [];

// FAQ rewritten per audit findings H-15, H-19, M-17: refund language
// aligned with Terms §8 (refund window closes when first medication ships);
// removed "custom-compounded" / "bioidentical" framing where it conflicts
// with the FDA-approved branded/generic product line; replaced "Her
// Estrogen provider" with OpenLoop attribution.
const FAQ_ITEMS = [
  {
    q: 'How does HerEstrogen work?',
    a: 'HerEstrogen coordinates access to hormone therapy through a network of independent licensed clinicians at our medical partner, OpenLoop Health. After your subscription is initiated, a licensed clinician reviews your intake. If hormone therapy is clinically appropriate, the clinician may prescribe an FDA-approved product — estradiol gel, estradiol patch, oral estradiol, oral micronized progesterone, or vaginal estradiol cream — selected based on your clinical picture. Medication is shipped from a licensed pharmacy partner.'
  },
  {
    q: 'What does the price include?',
    a: 'Your plan includes the clinician intake review, the prescription (if a clinician approves treatment), messaging access during your plan, periodic check-ins, and free shipping. There are no separate consultation fees. Plans automatically renew at the same price unless cancelled before the renewal date — see Terms §7 and §8 for renewal and cancellation details.'
  },
  {
    q: 'Is a prescription required?',
    a: 'Yes. Estradiol and oral progesterone are prescription medications. A licensed clinician via OpenLoop Health reviews your intake and decides whether to prescribe. HerEstrogen is not itself a medical provider; we coordinate access to independent licensed clinicians.'
  },
  {
    q: 'How quickly will I feel different?',
    a: "Individual results vary. Hormone therapy is not appropriate for everyone, and outcomes depend on the individual's clinical picture, dosing, and other factors. Your clinician may adjust dosing during the plan based on how you are feeling."
  },
  {
    q: "What if the clinician determines hormone therapy isn't right for me?",
    a: 'If a licensed clinician via OpenLoop Health reviews your intake and determines that hormone therapy is not medically appropriate, you will receive a full refund of your subscription payment per Terms §8. The refund window closes once medication has shipped — once your plan period begins and medication has shipped, standard plan terms apply.'
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

// Audit finding C-10: algorithm output reframed as "topics your clinician may
// discuss with you" rather than "your prescription is X." The clinician —
// not the page — decides what (if anything) to prescribe. Specific dose,
// formulation, and even whether to prescribe at all are determined by the
// independent licensed clinician at OpenLoop Health after intake review.
function recommendProduct(quiz) {
  const generic = {
    primary: 'gel',
    offerBundle: true,
    reason: 'Estradiol therapy is one of the FDA-approved options a clinician may consider for hormone therapy. The clinician will choose the form and dose (or recommend an alternative) based on your individual clinical picture.'
  };
  if (!quiz) return generic;
  const { stage, symptoms = [], age, preference } = quiz;
  const sys = ['hot', 'sleep', 'mood', 'brain', 'weight'];
  const systemicCount = symptoms.filter((s) => sys.includes(s)).length;
  const onlyVaginal = symptoms.length > 0 && symptoms.every((s) => s === 'skin');

  if (preference === 'gel') {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'You said you would prefer a topical gel. A topical estradiol gel is one of the FDA-approved forms of estrogen therapy a clinician may consider for you.'
    };
  }
  if (preference === 'patch') {
    return {
      primary: 'patch',
      offerBundle: true,
      reason: 'You said you would prefer a transdermal patch. A twice-weekly estradiol patch is one of the FDA-approved forms of estrogen therapy a clinician may consider for you.'
    };
  }
  if (preference === 'vaginal') {
    return {
      primary: 'dhea',
      offerBundle: false,
      reason: 'You said you would prefer a local treatment. A vaginal estradiol cream is one of the FDA-approved local treatments a clinician may consider for you.'
    };
  }

  if (onlyVaginal) {
    return {
      primary: 'dhea',
      offerBundle: false,
      reason: 'For local symptoms, a vaginal estradiol cream is one of the FDA-approved local treatments a clinician may consider for you.'
    };
  }

  if (age === '60+' || stage === 'post') {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'A topical estradiol gel is one of several FDA-approved forms of estrogen therapy a clinician may consider, often at a low effective dose. The clinician decides on the actual protocol.'
    };
  }

  if (systemicCount >= 2) {
    return {
      primary: 'bundle',
      offerBundle: false,
      reason: 'When systemic symptoms are present, clinicians often consider estrogen with oral micronized progesterone (for patients with a uterus). The actual treatment plan is decided by the clinician after reviewing your intake.'
    };
  }

  if (systemicCount === 1) {
    return {
      primary: 'gel',
      offerBundle: true,
      reason: 'A topical estradiol gel is one of several FDA-approved forms of estrogen therapy a clinician may consider for the symptom you reported.'
    };
  }

  return generic;
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
        <img src="assets/logo.png" alt="HerEstrogen" className="capture-logo" />
        <h1>Almost there — where should we send your <em>next steps?</em></h1>
        <p className="capture-sub">Enter your details to view your next steps. Submitting this form does not create a doctor-patient relationship or guarantee a prescription.</p>
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
          {/* Updated to be accurate to the actual data flow — Klaviyo
              receives email + first_name and does not currently have a BAA,
              so "HIPAA-protected" was misleading (audit findings C-04, M-04). */}
          <p className="privacy-note">🔒 We do not sell your data. See our <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> for how your information is used.</p>
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

    // Meta Pixel — sanitized InitiateCheckout signal (no medical metadata).
    // Value passed is the 3-month plan price ($507) per the tracking spec.
    // The helper is defined inline in results.html; it's a no-op if fbq is
    // unavailable (ad-blocker, network failure).
    if (typeof window.trackInitiateCheckout === 'function') {
      window.trackInitiateCheckout(507);
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
        {/* Audit finding C-10 / FTC §5: "Pre-Approved" framing softened so
            visitors don't conflate intake submission with treatment approval. */}
        <span className="label"><strong>{firstName}</strong> · Intake spot held for</span>
        <span className="timer">{expired ? '0:00 — Refresh to continue' : formatTime(timeLeft)}</span>
      </div>

      {/* SECTION 2 — Approval headline */}
      <section className="approval">
        <div className="container">
          <span className="eyebrow">Intake received</span>
          <h1>{firstName} — your intake is <em>ready for clinician review</em></h1>
          <p className="approval-sub">Thanks for your intake. A licensed clinician via our medical partner, OpenLoop Health, will review your responses to decide whether hormone therapy is clinically appropriate for you. Treatment is subject to clinician determination and is not guaranteed.</p>

          <div className="symptoms-block">
            <div className="symptoms-label">Topics you flagged</div>
            <div className="symptoms-tags">
              {SYMPTOMS_LIST.map((s, i) => (
                <span key={i} className="symptom-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="data-cards two">
            <div className="data-card">
              <div className="label">Possible category</div>
              <div className="value">FDA-approved estradiol &amp; progesterone</div>
            </div>
            <div className="data-card">
              <div className="label">Decision-maker</div>
              <div className="value">Licensed clinician (OpenLoop Health)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit finding C-11: unsourced 94.3% "likelihood of improvement"
          claim removed. Restore only with sourced citation. */}

      {/* Audit findings C-11, FTC §5: unsourced "Most women feel a meaningful
          difference within 30 days" timeline copy removed. The visual chart
          shown earlier in the file was also reframing efficacy claims as
          guaranteed timelines — the section is hidden site-wide pending
          counsel-blessed copy with peer-reviewed citations. */}
      {/* (Timeline chart section removed pending sourced copy) */}

      {/* SECTION 5 — Recommendation */}
      <section style={{ background: '#fff' }}>
        <div className="container">
          <div className="recommend">
            <div>
              <span className="recommend-badge">Topic for clinician review · {firstName}</span>
              <h3>{med.product}</h3>
              <p>{recommendation.reason}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>This is a category for discussion only — not a prescription. A licensed clinician via OpenLoop Health decides the actual treatment (including whether hormone therapy is appropriate at all) after reviewing your intake.</p>
              <span className="small-badge">Prescription required — clinician approval is not guaranteed</span>
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
          <h2 className="section-title">Everything <em>included</em> in your HerEstrogen plan:</h2>
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

          {/* Refund block aligned with Terms §8 — refund applies only if a
              clinician declines treatment or you cancel before shipment.
              Once medication ships, standard plan terms apply (audit
              finding H-15). */}
          <div className="approval-guarantee">
            <div className="approval-guarantee-head">
              <span className="approval-guarantee-icon" aria-hidden="true">🔒</span>
              <strong>Refund policy</strong>
            </div>
            <p>If a licensed clinician via OpenLoop Health determines hormone therapy is not clinically appropriate for you after reviewing your intake, you will receive a full refund of your subscription payment within three business days. You may also cancel and receive a refund before your first medication ships. Once medication has shipped, standard plan terms apply — see Terms §8 for the full refund policy.</p>
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
            {/* Audit finding H-14: "approval is reserved for X" countdown
                framing softened — no health/treatment urgency framing. */}
            <span className="reserved-pill">Your intake spot is held for {expired ? '0:00' : formatTime(timeLeft)}</span>
            <h2>Save up to $312/year on the 12-month plan</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', margin: '8px 0' }}>Choose 3, 6, or 12 months. Plans automatically renew at the same price unless cancelled before the renewal date — see Terms §7. Cancel anytime before any renewal.</p>
            <div className="green-line">Clinician intake review + messaging during your plan + medication (if prescribed) — all included.</div>
          </div>

          <h3 className="meds-head">FDA-approved category your clinician may consider:</h3>

          {/* Single recommended product card */}
          <div className={`med-card recommended ${selectedMed === 'bundle' ? 'bundle' : ''}`}>
            <span className="badge">{selectedMed === 'bundle' ? 'Often prescribed together' : 'Category for clinician review'}</span>
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
            {/* Audit findings C-06, H-13: per-product star rating + review
                count removed. Restore only with real review data. */}
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

          {/* Audit findings C-10, C-11, M-18: bundle "upsell" reframed.
              Removed unsourced "clinical gold standard" and unsupported
              endorsement claims (NAMS/IMS/FDA). The decision to add
              progesterone is the clinician's. */}
          {selectedMed !== 'bundle' && (
            <div className="bundle-upgrade" onClick={() => setSelectedMed('bundle')} role="button">
              <div className="bundle-upgrade-left">
                <div className="bundle-upgrade-badge">Topic for discussion · Same plan price</div>
                <h4>Discuss FDA-approved oral progesterone</h4>
                <p>
                  Clinicians sometimes consider oral micronized progesterone alongside estrogen for patients with a uterus. Whether to prescribe — and at what dose — is the clinician's decision after reviewing your intake. Adding this topic to your plan does not change your plan price.
                </p>
              </div>
              <div className="bundle-upgrade-cta">Add to discussion →</div>
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
            <span>🔒 Privacy-protected per our Privacy Policy</span>
            <span>💳 HSA/FSA accepted</span>
            <span>🚚 Free shipping</span>
            <span>✅ Cancel before any renewal — see Terms §7</span>
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
                <span>Card details are collected on the payment processor's secure hosted page after you continue. We do not store your card number.</span>
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
                  <span>Card details collected on the payment processor's secure hosted page after you click below.</span>
                </div>

                {paymentError && (
                  <div className="payment-error" role="alert">
                    <strong>Payment couldn't complete.</strong> {paymentError}
                  </div>
                )}

                {/* California ARL + FTC ROSCA + FTC Click-to-Cancel disclosure
                    (audit findings H-09, H-15). Clear-and-conspicuous, in a
                    bordered box immediately above the Pay button. Counsel
                    should sign off on the exact wording before launch. */}
                <div className="agree" style={{ border: '2px solid var(--pink, #b8235c)', borderRadius: 10, padding: '14px 16px', background: '#fef5f8', fontSize: 14, lineHeight: 1.55, color: '#1a1216', margin: '20px 0' }}>
                  <strong>Subscription &amp; renewal terms.</strong>{' '}
                  By subscribing, you authorize HerEstrogen to charge you
                  <strong> ${total.toLocaleString()}.00 today</strong> and the same amount
                  <strong> every {plan.months} months</strong> until you cancel. Your
                  subscription automatically renews at the same price for
                  successive {plan.months}-month terms unless you cancel before
                  the renewal date. You may cancel anytime by emailing{' '}
                  <a href="mailto:support@herestrogen.com">support@herestrogen.com</a> or via your account page.
                  <br /><br />
                  <strong>Refund policy.</strong> If a licensed clinician determines
                  hormone therapy is not clinically appropriate for you after reviewing
                  your intake, your subscription payment is refunded in full. You may
                  also cancel before your medication has been ordered for a full
                  refund. <strong>Once your medication has been ordered, refunds are
                  not available</strong> per applicable pharmacy regulations. Multi-month
                  plans are eligible for prorated refunds calculated at the 3-month plan
                  rate. See the full
                  {' '}<a href="refunds.html" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>Cancellation &amp; Refund Policy</a>.
                  Treatment is subject to clinician determination and is not guaranteed.
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Redirecting to secure checkout…' : 'Continue to Secure Checkout →'}
                </button>

                <div className="guarantee" style={{ marginTop: 14, fontSize: 13, color: '#3d2b33' }}>
                  🔒 Card details collected on Stripe's secure hosted page after you click above.
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Audit findings M-16, C-11: "Backed by clinical research from
          [Mayo / Harvard / NIH / NAMS]" logo block removed pending
          documented relationships or explicit citation. Also removed
          "What makes HerEstrogen so much better than anything else?"
          comparative claim. */}

      {/* Audit findings C-06, H-13: 20-case-study section removed. Pre-launch
          site has no real patients; "verified patients on FDA-approved Her
          Estrogen protocols" claim was demonstrably false. Restore only
          with documented, consenting customers. */}

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

      {/* SECTION 16 — Important Safety Information + Disclaimer */}
      <section className="disclaimer-section">
        <div className="disclaimer" style={{ fontSize: 13, lineHeight: 1.55 }}>
          <strong>Important Safety Information.</strong> Hormone therapy is a
          prescription treatment with real risks — including cardiovascular events,
          breast cancer (in combination with progestins), and others — that vary by
          individual, product, dose, and duration. Use the lowest effective dose for
          the shortest duration consistent with treatment goals and individual risk.
          These are prescription medications and may not be appropriate for everyone.
          Discuss risks and benefits with your clinician. Report side effects to FDA
          MedWatch at <a href="https://www.fda.gov/safety/medwatch" target="_blank" rel="noopener">fda.gov/safety/medwatch</a>.
          <br /><br />
          The intake completed on this site does not create a doctor-patient
          relationship. A licensed clinician via our medical partner, OpenLoop
          Health, reviews your intake to determine clinical appropriateness;
          the clinician retains discretion to decline. HerEstrogen is not a
          healthcare provider — we coordinate access to independent licensed
          clinical services. HSA/FSA eligibility is determined by your plan
          administrator. The medications discussed on this page are FDA-approved
          branded or generic products; we do not market mass-compounded BHRT.
        </div>
        <div className="footer-links">
          <a href="privacy.html">Privacy Policy</a>·
          <a href="terms.html">Terms of Service</a>·
          <a href="privacy.html">HIPAA Notice</a>·
          <a href="refunds.html">Cancellation &amp; Refund Policy</a>·
          <a href="https://openloophealth.com/telehealth-consent" target="_blank" rel="noopener">OpenLoop Telehealth Consent</a>·
          <a href="https://www.fda.gov/safety/medwatch" target="_blank" rel="noopener">Report a side effect (FDA MedWatch)</a>·
          <a href="mailto:support@herestrogen.com">Contact Us</a>
        </div>
      </section>

      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-check">✓</div>
            <h2>Thanks, {firstName}. Your intake has been submitted.</h2>
            <p className="sub">A licensed clinician via our medical partner, OpenLoop Health, will review your intake — typically within 1&ndash;2 business days. Treatment is subject to clinician approval and is not guaranteed. Check your email at <strong>{email}</strong> for next steps.</p>
            <div className="steps-row">
              <div className="success-step"><div className="n">01</div><div className="t">Clinician review</div><div>Typically 1–2 business days</div></div>
              <div className="success-step"><div className="n">02</div><div className="t">Treatment decision</div><div>If clinically appropriate</div></div>
              <div className="success-step"><div className="n">03</div><div className="t">Medication ships (if prescribed)</div><div>From a licensed pharmacy</div></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
