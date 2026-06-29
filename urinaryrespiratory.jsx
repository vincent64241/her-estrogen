import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen keeps your bladder & urethra strong',
    body: 'The bladder and urethra are lined with estrogen receptors. As estrogen falls, that tissue thins and weakens — so you leak when you laugh, cough, or sneeze, and feel like you have to go far more often than you used to.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman feeling confident and comfortable',
  },
  {
    n: '02',
    headline: 'Sudden urgency that won\'t wait',
    body: 'Estrogen helps regulate the bladder muscle. Without it, the bladder turns overactive and twitchy — triggering that gotta-go-right-now urgency and waking you several times a night just to pee.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman resting at night',
  },
  {
    n: '03',
    headline: 'UTIs that keep coming back',
    body: 'Estrogen maintains the protective lining and healthy bacteria of your urinary tract. As it declines, that natural defense breaks down — which is why recurrent UTIs and burning become so common in menopause.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman managing urinary discomfort',
  },
  {
    n: '04',
    headline: 'Estrogen helps keep your airways open',
    body: 'Estrogen and progesterone influence the muscles and lining of your airways. As they decline, airways can tighten and inflame more easily — bringing breathlessness, chest tightness, and a lingering cough. Many women find asthma worsens, or shows up for the first time, in perimenopause.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman catching her breath',
  },
  {
    n: '05',
    headline: 'Congestion, allergies & air hunger',
    body: 'Estrogen interacts with histamine — the chemical behind allergic reactions — so as it fluctuates, congestion and a runny nose can flare. Paired with the palpitations and anxiety from the same hormone swings, you can feel winded or air-hungry even at rest.',
    img: 'assets/lifestyle/lifestyle-3.jpg',
    alt: 'Woman dealing with congestion',
  },
  {
    n: '06',
    headline: 'It\'s hormonal — not just "getting older"',
    body: 'Pads, inhalers, and antihistamines help you cope, but they don\'t restore what estrogen used to maintain. When urinary and breathing changes track with menopause, addressing the estrogen shift underneath is part of getting back to normal. (Sudden or severe shortness of breath always warrants urgent medical care.)',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman thriving after treatment',
  },
];

function UrinaryRespiratoryHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Urinary & Respiratory Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">URINARY, RESPIRATORY &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            6 reasons your urinary &amp; breathing changes{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The bladder leaks and constant urgency, the recurring UTIs, the breathlessness and asthma flares — this isn't just "getting older." Both your bladder and your airways are rich in estrogen receptors, and they feel it when estrogen drops.
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
    <section className="lp-five-reasons" data-screen-label="02 6 Reasons">
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

function UrinaryRespiratoryApp() {
  return (
    <>
      <UrinaryRespiratoryHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<UrinaryRespiratoryApp />);
