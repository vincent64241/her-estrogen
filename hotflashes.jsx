import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Your internal thermostat lost its calibration',
    body: 'Estrogen keeps your hypothalamus — your body\'s temperature regulator — stable. As estrogen swings in perimenopause, your brain misreads tiny shifts as overheating and fires an emergency cooling response. That sudden wave of heat? That\'s the alarm going off.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman looking vibrant and energized',
  },
  {
    n: '02',
    headline: 'Your comfort zone for temperature shrank',
    body: 'With steady estrogen, your body tolerates a wide range of core temperatures before reacting. When estrogen drops, that thermoneutral zone narrows dramatically — so the smallest rise in heat sets off flushing, sweating, and that flushed-red feeling out of nowhere.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman resting comfortably',
  },
  {
    n: '03',
    headline: 'Night sweats are hot flashes you sleep through',
    body: 'The same estrogen swings that flush you during the day spike at night — and you wake up drenched. It\'s not your blankets or a warm room. It\'s your hormones firing a full cooling response while you\'re trying to sleep.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman waking at night',
  },
  {
    n: '04',
    headline: 'Stress makes every flash worse',
    body: 'Estrogen helps keep your stress response in check. Without it, adrenaline and cortisol surge more easily — and each surge can trigger or intensify a flash. That\'s the cruel loop: stress sparks a hot flash, and the hot flash spikes your stress.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman feeling overwhelmed',
  },
  {
    n: '05',
    headline: 'They won\'t simply pass on their own',
    body: 'For many women, hot flashes last 7 to 10 years — and powering through them changes nothing underneath. The only way to truly calm them is to address the root cause: the estrogen your body is missing. Not a fan. Not a supplement. The actual fix.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function HotFlashesHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Hot Flashes Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">HOT FLASHES &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your hot flashes{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The sudden heat, the drenching night sweats, the flush that hits out of nowhere — this isn't just "getting older." It's what happens when estrogen becomes erratic and your body loses its thermostat.
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
        <div className="lp-fr-cards">
          {FIVE_REASONS.map((r, idx) => (
            <div key={r.n} className={`lp-fr-card${idx % 2 !== 0 ? ' lp-fr-flip' : ''}`}>
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

function HotFlashesApp() {
  return (
    <>
      <HotFlashesHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<HotFlashesApp />);
