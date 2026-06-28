import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Your brain literally runs on estrogen',
    body: 'Estrogen fuels the brain regions behind memory and focus — the hippocampus and prefrontal cortex are dense with estrogen receptors. As estrogen declines, those areas lose the support they\'re used to, and word-finding, recall, and concentration start to slip.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman looking clear-headed and focused',
  },
  {
    n: '02',
    headline: 'Your brain\'s energy supply dipped',
    body: 'Estrogen helps your brain use glucose, its main fuel. When estrogen drops, brain energy metabolism falls with it — which shows up as mental fatigue, slow processing, and that "thinking through mud" haze that hits by mid-afternoon.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman resting and recharging',
  },
  {
    n: '03',
    headline: 'Lost sleep is wrecking your recall',
    body: 'Hormonal night wakeups and hot flashes fragment your sleep — and deep sleep is exactly when your brain files away memories. Less of it means more forgotten names, missed words, and those walk-into-a-room-and-blank moments.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman waking unrested',
  },
  {
    n: '04',
    headline: 'Your focus chemicals shifted too',
    body: 'Estrogen helps regulate serotonin and dopamine — the same chemicals behind attention and motivation. When estrogen swings, focus scatters and the mental sharpness you always relied on feels just out of reach.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman struggling to concentrate',
  },
  {
    n: '05',
    headline: 'It\'s not early dementia — it\'s hormonal',
    body: 'For most women, perimenopausal brain fog is real but reversible — and the fear it sparks is the worst part. Addressing the hormone shift underneath is how you get your clarity back, not white-knuckling harder through the haze.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function BrainFogHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Brain Fog Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">BRAIN FOG &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your brain fog{' '}
            <em>is actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The lost words, the walk-into-a-room blanks, the can't-focus haze by mid-afternoon — this isn't just "getting older," and it isn't early dementia. It's what happens when estrogen declines.
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

function BrainFogApp() {
  return (
    <>
      <BrainFogHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<BrainFogApp />);
