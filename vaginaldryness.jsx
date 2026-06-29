import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = 'https://quiz.herestrogen.com/herestrogen_hrt';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen keeps vaginal tissue thick & resilient',
    body: 'Estrogen maintains the thickness, elasticity, and blood flow of vaginal tissue. As it declines in menopause, that tissue thins and grows fragile — what doctors call vaginal atrophy — which is exactly why dryness, irritation, and tearing start to show up.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman feeling comfortable and at ease',
  },
  {
    n: '02',
    headline: 'Your natural lubrication dried up',
    body: 'Estrogen drives the natural moisture and lubrication that makes intimacy comfortable. Without it, the tissue stays dry — so friction that once felt good now burns, stings, or pinches instead.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman relaxing comfortably',
  },
  {
    n: '03',
    headline: 'Sex started to hurt — so you started avoiding it',
    body: 'When tissue is thin and dry, penetration can cause real pain (dyspareunia). Your body learns to brace and pull away, which tightens the muscles and can make the next time hurt even more — a cycle that has nothing to do with desire.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman looking thoughtful',
  },
  {
    n: '04',
    headline: 'It\'s not just sex — it\'s burning, itching & UTIs',
    body: 'The same estrogen loss affects your entire urinary and vaginal tract — known as GSM. That brings burning, itching, urgency, and recurring UTIs, symptoms most women endure silently because they assume nothing can be done.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman dealing with discomfort',
  },
  {
    n: '05',
    headline: 'Lubricants only mask it — they don\'t restore the tissue',
    body: 'Over-the-counter lubes can help in the moment, but they don\'t rebuild the tissue estrogen used to maintain. When dryness and pain track with menopause, addressing the estrogen decline underneath is what actually restores lasting comfort.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function VaginalDrynessHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Vaginal Dryness Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">VAGINAL HEALTH &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your dryness &amp; painful sex{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The dryness, the burning, the intimacy that suddenly hurts — this isn't just "getting older," and it isn't in your head. It's what happens when estrogen leaves vaginal tissue thin and dry.
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

function VaginalDrynessApp() {
  return (
    <>
      <VaginalDrynessHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<VaginalDrynessApp />);
