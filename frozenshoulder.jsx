import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Frozen shoulder peaks exactly when estrogen drops',
    body: 'Adhesive capsulitis overwhelmingly strikes women between 40 and 60 — the same window estrogen falls. That\'s no coincidence: the shoulder capsule is rich in estrogen receptors, and losing that signal lets it thicken, tighten, and lock up.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman moving freely',
  },
  {
    n: '02',
    headline: 'Estrogen keeps your joints lubricated',
    body: 'Estrogen maintains the fluid and collagen that cushion every joint. As it declines, joints lose lubrication and tissues stiffen — which is why aches and that locked-up shoulder so often arrive right alongside other menopause symptoms.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman stretching comfortably',
  },
  {
    n: '03',
    headline: 'Your collagen is breaking down faster',
    body: 'Estrogen helps your body build and maintain collagen — the scaffolding of tendons, ligaments, and joint capsules. As estrogen drops, that collagen weakens and the shoulder capsule can scar and contract, the hallmark of a frozen shoulder.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman with limited shoulder movement',
  },
  {
    n: '04',
    headline: 'Inflammation runs unchecked',
    body: 'Estrogen has a natural anti-inflammatory effect. Without it, low-grade inflammation rises across your joints and connective tissue — fueling the pain, swelling, and morning stiffness that just won\'t loosen up no matter how much you move.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman feeling joint pain',
  },
  {
    n: '05',
    headline: 'Your bones are thinning at the same time',
    body: 'Estrogen doesn\'t just protect your joints — it protects your bones. Women can lose up to 20% of their bone density in the five to seven years after menopause, once estrogen\'s brake on bone breakdown lifts. It\'s silent at first, then shows up as aches, fractures, or lost height long before most women connect it to hormones.',
    img: 'assets/lifestyle/lifestyle-3.jpg',
    alt: 'Woman staying strong and active',
  },
  {
    n: '06',
    headline: 'Stretching alone won\'t fix the cause',
    body: 'Physical therapy and calcium help you cope, but they don\'t replace the hormone driving the stiffness and bone loss. When joint pain, frozen shoulder, and thinning bones track with menopause, addressing the estrogen shift underneath is how you protect them at the source.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function FrozenShoulderHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Frozen Shoulder Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">JOINTS, BONES &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            6 reasons your frozen shoulder &amp; joint pain{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The shoulder that locked up out of nowhere, the joints that ache and stiffen, the bone density quietly slipping away — this isn't just "wear and tear." It's what happens when estrogen drops.
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

function FrozenShoulderApp() {
  return (
    <>
      <FrozenShoulderHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<FrozenShoulderApp />);
