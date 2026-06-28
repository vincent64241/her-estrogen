import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Your sleep hormone is running dry',
    body: 'Progesterone is what makes you feel genuinely sleepy at bedtime. It\'s the first hormone to drop in perimenopause — sometimes years before your period changes. Without it, you\'re exhausted but can\'t fall asleep. Sound familiar?',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman resting peacefully',
  },
  {
    n: '02',
    headline: 'Your internal thermostat broke at 3am',
    body: 'Estrogen keeps your hypothalamus — your body\'s temperature regulator — stable. When estrogen fluctuates at night, your brain reads it as overheating and fires an emergency cooling response: a hot flash. You wake up drenched. You can\'t fall back asleep.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman looking vibrant and energized',
  },
  {
    n: '03',
    headline: 'Your deep sleep quietly disappeared',
    body: 'Estrogen is what moves you into deep, restorative sleep stages. When it drops, you get stuck in light sleep all night — waking at the slightest sound, never reaching the sleep that actually heals you. Eight hours in bed. Still exhausted.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman feeling well-rested',
  },
  {
    n: '04',
    headline: 'Stress hormones spike while you sleep',
    body: 'Estrogen normally keeps cortisol in check overnight. Without it, cortisol can surge in the early hours — triggering your fight-or-flight response at 3am. You bolt awake feeling anxious, heart racing, thoughts spinning. It\'s not stress. It\'s biology.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman awake, reading at night',
  },
  {
    n: '05',
    headline: 'Poor sleep makes your hormones worse',
    body: 'Here\'s the cruel part: sleep deprivation suppresses estrogen production. Lower estrogen means worse sleep. Worse sleep means lower estrogen. The cycle feeds itself. The only way to break it is to treat the root cause — not just the symptom.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
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
            The 3am wakeups, the night sweats, the lying-there-exhausted-but-wired — this isn't just "getting older." It's what happens when estrogen and progesterone disappear.
          </p>
          <p className="lp-sh-price">
            HRT Plans Starting at&nbsp;<strong>$95/mo</strong>&nbsp;
            <s className="price-was">$160</s>&nbsp;
            <span className="price-badge">Up to 40% OFF</span>
            <span className="price-per-day">= $3.17/day</span>
          </p>
          <div className="lp-sh-ctas">
            <a className="hs-btn-primary" href={QUIZ_URL}>
              Get Started →
            </a>
          </div>
          <div className="hs-trust">
            <span className="hs-trust-item hs-trust-no">No Hidden Fees</span>
            <span className="hs-trust-item hs-trust-no">No Insurance Required</span>
            <span className="hs-trust-item hs-trust-yes">Cancel Anytime</span>
          </div>
        </div>
        <div className="lp-sh-right" aria-hidden="true">
          <img src="assets/products-hero.png" alt="" className="lp-sh-product-img" />
        </div>
      </div>
    </section>
  );
}

function FiveReasonsSection() {
  return (
    <section className="lp-five-reasons" data-screen-label="02 5 Reasons">
      <div className="container">
        <div className="lp-fr-intro">
          <div className="eyebrow">Why you can't sleep</div>
          <h2 className="lp-fr-h2">
            5 reasons your poor sleep<br />
            <em>is actually hormonal.</em>
          </h2>
          <p className="lp-fr-sub">
            Most sleep problems in perimenopause and menopause have the same root cause. Here's exactly what's happening inside your body.
          </p>
        </div>

        <div className="lp-fr-cards">
          {FIVE_REASONS.map((r, i) => (
            <div key={r.n} className={'lp-fr-card' + (i % 2 === 1 ? ' lp-fr-card-flip' : '')}>
              <div className="lp-fr-card-img">
                <img src={r.img} alt={r.alt} />
              </div>
              <div className="lp-fr-card-body">
                <span className="lp-fr-num">{r.n}</span>
                <h3 className="lp-fr-title">{r.headline}</h3>
                <p className="lp-fr-text">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-fr-cta-wrap">
          <a href={QUIZ_URL} className="hs-btn-primary">
            Get Started →
          </a>
          <p className="lp-fr-cta-note">Licensed clinicians in all 50 states · No insurance required</p>
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
      <ProductsSection ctaUrl={QUIZ_URL} />
      <BonusPromisesSection />
      <EduSection ctaUrl={QUIZ_URL} />
      <ScienceSection ctaUrl={QUIZ_URL} />
      <WeekTimelineSection ctaUrl={QUIZ_URL} />
      <FaqSection />
      <StartQuizSection ctaUrl={QUIZ_URL} />
      <FooterSection />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SleepApp />);
