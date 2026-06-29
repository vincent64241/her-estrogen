import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = 'https://quiz.herestrogen.com/herestrogen_hrt';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen is your skin\'s collagen engine',
    body: 'Estrogen drives collagen production — the protein that keeps skin firm and plump. Women lose up to 30% of their skin collagen in the first five years of menopause, which is why fine lines, sagging, and crepey skin can seem to appear almost overnight.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman with healthy, glowing skin',
  },
  {
    n: '02',
    headline: 'Your skin\'s moisture is drying up',
    body: 'Estrogen helps skin hold water and produce its natural oils. As it declines, skin loses hydration and that healthy glow — turning dry, dull, and itchy, with wrinkles that settle in deeper and faster than before.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman caring for her skin',
  },
  {
    n: '03',
    headline: 'Your hair growth cycle is shrinking',
    body: 'Estrogen keeps hair in its growth phase longer. As estrogen falls, more follicles shift into shedding — so hair thins all over, the part widens, and your ponytail gets noticeably smaller.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman noticing thinning hair',
  },
  {
    n: '04',
    headline: 'Androgens take over without estrogen',
    body: 'As estrogen drops, the relative influence of androgens rises. That shift shrinks hair follicles — especially along the hairline and crown — and can bring unwanted facial hair at the very same time.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman examining hair changes',
  },
  {
    n: '05',
    headline: 'Creams and serums work on the surface only',
    body: 'Topicals can\'t replace the hormone your skin and hair are missing. When the changes track with menopause, addressing the estrogen decline underneath is what supports your skin and hair from the inside out — not just the outside in.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function SkinAndHairHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Skin & Hair Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">SKIN, HAIR &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your thinning hair &amp; aging skin{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The fine lines that appeared overnight, the dry crepey skin, the thinning part and smaller ponytail — this isn't just "getting older." It's what happens when estrogen and collagen decline together.
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

function SkinAndHairApp() {
  return (
    <>
      <SkinAndHairHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<SkinAndHairApp />);
