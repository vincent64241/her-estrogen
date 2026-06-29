import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = 'https://quiz.herestrogen.com/herestrogen_hrt';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen helps protect your gums',
    body: 'Gum tissue is full of estrogen receptors. As estrogen drops, gums can become inflamed, tender, and start to recede — bringing bleeding when you brush and a higher risk of gum disease, even with the exact same routine you\'ve always had.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman with a healthy smile',
  },
  {
    n: '02',
    headline: 'Dry mouth came out of nowhere',
    body: 'Estrogen supports saliva production, and saliva is your mouth\'s natural defense against decay. As estrogen declines, your mouth turns dry — which fuels bad breath, more cavities, and that constant parched, sticky feeling.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman reaching for water',
  },
  {
    n: '03',
    headline: 'Burning mouth & altered taste',
    body: 'Falling estrogen can irritate the nerves in your mouth, causing burning mouth syndrome — a scalded, tingling sensation on the tongue and lips — often alongside a metallic or "off" taste that just won\'t go away.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman experiencing mouth discomfort',
  },
  {
    n: '04',
    headline: 'Your jawbone is losing density too',
    body: 'The same estrogen loss that thins the bones in your hips and spine thins your jawbone. That can loosen teeth, shift your bite, and quietly undermine the foundation your teeth depend on — long before a dentist flags it.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman at a dental check-up',
  },
  {
    n: '05',
    headline: 'It\'s not "getting older" or poor hygiene',
    body: 'Brushing harder or more often won\'t fix a hormone-driven change. When dry mouth, sore gums, and dental problems track with menopause, addressing the estrogen decline underneath is what protects your mouth at the source.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function OralHealthHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Oral Health Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">ORAL, DENTAL &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your oral &amp; dental changes{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The bleeding gums, the dry mouth, the burning or metallic taste, the teeth that suddenly feel loose — this isn't just "getting older" or poor brushing. It's what happens when estrogen declines in your gums, saliva, and jawbone.
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

function OralHealthApp() {
  return (
    <>
      <OralHealthHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<OralHealthApp />);
