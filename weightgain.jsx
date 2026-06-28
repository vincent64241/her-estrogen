import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen decides where your fat goes',
    body: 'Estrogen steers fat toward your hips and thighs. As it drops, that fat redistributes to your belly — the deep visceral fat that wraps around your organs. Same number on the scale, different shape, and far harder to budge.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman looking vibrant and energized',
  },
  {
    n: '02',
    headline: 'Your metabolism quietly downshifted',
    body: 'Estrogen helps regulate how efficiently your body burns energy. As it declines, your resting metabolic rate falls — so the same meals that kept your weight steady for years now slowly add to it, even though nothing about how you eat has changed.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman resting comfortably',
  },
  {
    n: '03',
    headline: 'You\'re losing the muscle that burns calories',
    body: 'Falling estrogen accelerates muscle loss. Muscle is your most metabolically active tissue — it burns calories around the clock, even at rest. Less of it means a slower burn all day long, no matter how hard you work out.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman staying active',
  },
  {
    n: '04',
    headline: 'Your hunger signals got louder',
    body: 'Estrogen influences leptin and insulin — the hormones that tell you when you\'re full. When estrogen swings, those signals misfire, driving cravings (especially for sugar) and leaving you hungrier than your body actually needs.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman managing cravings',
  },
  {
    n: '05',
    headline: 'Diet and exercise alone stopped working',
    body: 'If you\'re eating less and moving more but the scale won\'t move, it isn\'t willpower — it\'s biology. The only way to work with your body again is to address the hormone shift underneath, not just cut more calories or add another workout.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function WeightGainHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Weight Gain Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">WEIGHT GAIN &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your weight gain{' '}
            <em>is actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The stubborn belly fat, the scale creeping up while you eat the same, the diets that suddenly stop working — this isn't just "getting older." It's what happens when estrogen declines and your metabolism shifts.
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

function WeightGainApp() {
  return (
    <>
      <WeightGainHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<WeightGainApp />);
