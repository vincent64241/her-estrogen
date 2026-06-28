import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen helps fuel desire itself',
    body: 'Estrogen acts directly on the brain regions and tissues behind desire and arousal. As it declines in menopause, the spark simply isn\'t generated the way it used to be — so desire can fade even when nothing about your relationship has.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman feeling confident and connected',
  },
  {
    n: '02',
    headline: 'Intimacy became physically uncomfortable',
    body: 'Estrogen keeps vaginal tissue thick, elastic, and naturally lubricated. As it drops, that tissue thins and dries — making intimacy uncomfortable or even painful. And when it hurts, your body quietly learns to avoid it.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman feeling at ease',
  },
  {
    n: '03',
    headline: 'Blood flow and sensitivity dropped',
    body: 'Estrogen supports blood flow to the genital tissue that powers arousal and sensation. With less of it, arousal is slower and orgasms can feel weaker or harder to reach — even when you\'re in the mood and everything else is right.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman relaxing comfortably',
  },
  {
    n: '04',
    headline: 'Everything else estrogen disrupts kills the mood',
    body: 'Desire is the first thing to go when you feel awful. Night sweats, broken sleep, low mood, and zero energy are all downstream of falling estrogen — and together they leave nothing in the tank for intimacy. Steady the hormone driving them and desire has room to return.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman reflecting quietly',
  },
  {
    n: '05',
    headline: 'It\'s not you, your partner, or "just age"',
    body: 'Low desire in menopause is a hormone problem — not a relationship failing or something you simply have to accept. When your libido tracks with the estrogen shift, addressing the root cause is how intimacy and connection come back.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function LibidoHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Libido Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">LIBIDO &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your low libido{' '}
            <em>is actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The desire that faded, the discomfort that makes you pull away, the feeling that the spark just left — this isn't you, and it isn't "just age." It's what happens when estrogen declines.
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

function LibidoApp() {
  return (
    <>
      <LibidoHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<LibidoApp />);
