import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, WeekTimelineSection, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

const QUIZ_URL = '/quiz.html';  // QUIZ_URL_PLACEHOLDER — replace with live OpenLoop intake URL

const FIVE_REASONS = [
  {
    n: '01',
    headline: 'Estrogen steadies your mood chemistry',
    body: 'Estrogen boosts serotonin, your brain\'s primary mood stabilizer. As estrogen swings in perimenopause, serotonin drops with it — and you feel it as irritability, low mood, and tears that show up out of nowhere.',
    img: 'assets/case-joy.jpg',
    alt: 'Woman feeling calm and steady',
  },
  {
    n: '02',
    headline: 'The swings themselves are the trigger',
    body: 'It isn\'t only low estrogen — it\'s how erratically it rises and crashes. Those rapid swings whipsaw your brain chemistry, which is why your mood can flip from fine to furious to flat inside a single day.',
    img: 'assets/lifestyle/lifestyle-1.jpg',
    alt: 'Woman riding emotional ups and downs',
  },
  {
    n: '03',
    headline: 'Your calm hormone is fading too',
    body: 'Progesterone fuels GABA, your brain\'s natural calming signal. As progesterone declines, that built-in brake weakens — leaving you wired, on edge, and anxious for no obvious reason, especially at night.',
    img: 'assets/lifestyle/lifestyle-2.jpg',
    alt: 'Woman feeling anxious at night',
  },
  {
    n: '04',
    headline: 'Stress hits harder without estrogen',
    body: 'Estrogen helps keep cortisol — your stress hormone — in check. Without it, cortisol runs higher and lingers longer, so everyday stress feels overwhelming and that wave of panic can rise out of nowhere.',
    img: 'assets/case-reading.jpg',
    alt: 'Woman overwhelmed by stress',
  },
  {
    n: '05',
    headline: 'It\'s not "just stress" — and it\'s treatable',
    body: 'Being told to relax or wait it out doesn\'t fix a hormone problem. When the mood shifts and anxiety are driven by estrogen and progesterone, the way back to feeling like yourself is treating the root cause — not white-knuckling through it.',
    img: 'assets/lifestyle/lifestyle-4.jpg',
    alt: 'Woman feeling like herself again',
  },
];

function MoodSwingsHero() {
  return (
    <section className="lp-sleep-hero" data-screen-label="01 Mood Swings Hero">
      <div className="lp-sh-wrap">
        <div className="lp-sh-left">
          <div className="lp-sh-eyebrow">MOOD SWINGS &amp; HORMONAL CHANGE</div>
          <h1 className="lp-sh-h1">
            5 reasons your mood swings &amp; anxiety{' '}
            <em>are actually hormonal.</em>
          </h1>
          <p className="lp-sh-sub">
            The irritability out of nowhere, the 3am anxiety, the crying you can't explain, the short fuse — this isn't just "who you are now." It's what happens when estrogen and progesterone swing.
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

function MoodSwingsApp() {
  return (
    <>
      <MoodSwingsHero />
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

ReactDOM.createRoot(document.getElementById('root')).render(<MoodSwingsApp />);
