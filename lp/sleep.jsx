import {
  TrustMarquee, EduSection, ScienceSection, HrtFlowBand,
  FaqSection, StartQuizSection, FooterSection,
} from '../shared.jsx';

// TODO(vincent): replace '/quiz.html' with the live OpenLoop intake URL.
const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER

const FIVE_REASONS = [
  {
    n: '01',
    title: 'Progesterone is your natural sleep sedative — and it\'s dropping',
    body: 'Progesterone binds to the same receptors as sleep medications. As it declines in perimenopause, the sedative signal fades. A licensed clinician can prescribe oral progesterone taken at bedtime to help restore that signal.',
  },
  {
    n: '02',
    title: 'Estrogen controls your thermostat — and it\'s misfiring',
    body: 'Estrogen calibrates the hypothalamus, which regulates body temperature. When levels fall, even a small temperature rise triggers a vasomotor event — a hot flash or night sweat — that wakes you from deep sleep.',
  },
  {
    n: '03',
    title: 'Low estrogen disrupts your sleep architecture',
    body: 'Estrogen supports REM sleep cycles. When it drops, you spend less time in restorative deep sleep and more time in lighter stages — so you wake easily and feel unrefreshed even after 8 hours in bed.',
  },
  {
    n: '04',
    title: 'The "wired but exhausted" feeling is a hormonal stress signal',
    body: 'Estrogen modulates cortisol. When estrogen declines, your stress response becomes less regulated — cortisol can spike at night, leaving you alert and anxious at 3am despite being exhausted.',
  },
  {
    n: '05',
    title: 'It compounds: poor sleep drops estrogen further',
    body: 'Sleep deprivation suppresses estrogen production, which worsens the original estrogen decline. The cycle feeds itself. Addressing the hormonal root cause — not just the symptom — is the clinical approach to breaking it.',
  },
];

function SleepHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Sleep Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">SLEEP &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            You don't have an insomnia problem.{' '}
            <em>You have a hormone problem.</em>
          </h1>
          <p className="lp-sh-sub">
            The 3am wakeups, the night sweats, the lying-there-exhausted-but-wired...
          </p>
          <p className="lp-sh-price">
            HRT Plans Starting at&nbsp;<strong>$95/mo</strong>&nbsp;
            <s className="price-was">$160</s>&nbsp;
            <span className="price-badge">Up to 40% OFF</span>
            <span className="price-per-day">= $3.17/day</span>
          </p>
          <div className="lp-sh-ctas">
            <a className="hs-btn-primary" href={QUIZ_URL}>
              Take the 2-minute assessment →
            </a>
          </div>
          <div className="hs-trust">
            <span className="hs-trust-item hs-trust-no">No Hidden Fees</span>
            <span className="hs-trust-item hs-trust-no">No Insurance Required</span>
            <span className="hs-trust-item hs-trust-yes">Cancel Anytime</span>
          </div>
        </div>
        <div className="lp-sh-right" aria-hidden="true">
          <img src="../assets/lifestyle/lifestyle-1.jpg" alt="" />
        </div>
      </div>
    </section>
  );
}

function FiveReasonsSection() {
  return (
    <section className="lp-five-reasons" data-screen-label="02 5 Reasons">
      <div className="container">
        <div className="eyebrow">Why you can't sleep</div>
        <h2 className="lp-fr-h2">
          5 reasons your 3am wakeups{' '}
          <em>are hormonal.</em>
        </h2>
        <p className="lp-fr-sub">
          Sleep problems in perimenopause and menopause are not a separate condition. They are a direct symptom of hormonal decline. Here's the mechanism.
        </p>
        <ol className="lp-fr-list">
          {FIVE_REASONS.map((r) => (
            <li key={r.n} className="lp-fr-item">
              <span className="lp-fr-num">{r.n}</span>
              <div className="lp-fr-body">
                <h3 className="lp-fr-title">{r.title}</h3>
                <p className="lp-fr-text">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="lp-fr-cta-wrap">
          <a href={QUIZ_URL} className="hs-btn-primary">
            Take the 2-minute assessment →
          </a>
        </div>
      </div>
    </section>
  );
}

function SleepApp() {
  return (
    <>
      <SleepHero />
      <TrustMarquee />
      <FiveReasonsSection />
      <EduSection ctaUrl={QUIZ_URL} />
      <ScienceSection ctaUrl={QUIZ_URL} />
      <HrtFlowBand ctaUrl={QUIZ_URL} />
      <FaqSection />
      <StartQuizSection ctaUrl={QUIZ_URL} />
      <FooterSection />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SleepApp />);
