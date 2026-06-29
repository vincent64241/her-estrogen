import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = 'https://quiz.herestrogen.com/herestrogen_hrt';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen keeps your digestion moving',
    body: 'Estrogen and progesterone help regulate the muscle contractions that move food through your gut. As they swing in menopause, that rhythm slows and stutters — bringing bloating, constipation, and a stomach that just feels off for no clear reason.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman feeling comfortable and light',
  },
  {
    n: '02',
    headline: 'Bloating became your new normal',
    body: 'Hormone shifts change how your body holds water and how gas moves through the gut. The result is that puffy, distended, "nothing fits by evening" bloating that can leave you looking and feeling months along — even when nothing about your diet has changed.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman dealing with bloating',
  },
  {
    n: '03',
    headline: 'Your gut bacteria changed with your hormones',
    body: 'Estrogen and your gut microbiome are deeply linked — scientists call it the "estrobolome." As estrogen falls, the balance of gut bacteria shifts with it, which can worsen gas, irregularity, and food sensitivities you never used to have.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman supporting her gut health',
  },
  {
    n: '04',
    headline: 'Your gut and stress are wired together',
    body: 'Estrogen helps buffer the gut-brain stress axis. Without it, cortisol and anxiety hit your digestion harder — triggering cramping, urgency, or that nervous-stomach feeling, especially when everything else is flaring at once.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman with an upset stomach',
  },
  {
    n: '05',
    headline: 'It\'s not "just IBS" or something you ate',
    body: 'Being told it\'s stress or to cut out more foods rarely fixes hormonal digestive changes. When the bloating and irregularity track with menopause, addressing the estrogen shift underneath is what calms your gut at the source.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function DigestionHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Digestion Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">DIGESTION &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your bloating &amp; digestive changes{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The bloating that won't quit, the constipation, the stomach that's suddenly sensitive to everything — this isn't just "something you ate." It's what happens when estrogen declines and your gut loses its rhythm.
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

function DigestionApp() {
  return (
    <>
      <DigestionHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<DigestionApp />);
