import {
  TrustMarquee, ProductsSection, BonusPromisesSection, EduSection,
  ScienceSection, HrtFlowBand, FaqSection, StartQuizSection, FooterSection,
} from './shared.jsx';

// TODO(vincent): replace '#' with the live OpenLoop intake URL once available.
// Update the matching value in index.html's nav button (INTAKE_URL_PLACEHOLDER) in lockstep.
// After editing, run `npm run build` and re-sync the mirror.
const INTAKE_URL = 'https://quiz.herestrogen.com/herestrogen_hrt';  // INTAKE_URL_PLACEHOLDER

function App() {
  return (
    <>
      {/* HERO — homepage-specific split layout */}
      <section className="hero-split" data-screen-label="01 Hero">
        <div className="hs-wrap">
          <div className="hs-card rv d1">
            <div className="hs-content">
              <div className="hs-stars">
                <span className="hs-star-pips" aria-label="5 stars">{'★★★★★'}</span>
                <span className="hs-stars-label">Excellent! Licensed clinicians in all 50 states</span>
              </div>
              <h1 className="hs-h1 write-on">
                <span className="word" style={{ animationDelay: '0ms'   }}>You</span>{' '}
                <span className="word" style={{ animationDelay: '80ms'  }}>Have</span>{' '}
                <span className="word" style={{ animationDelay: '160ms' }}>Menopause</span>{' '}
                <span className="word" style={{ animationDelay: '240ms' }}>Symptoms?</span>
                <br />
                <em>
                  <span className="word" style={{ animationDelay: '360ms' }}>HerEstrogen</span>{' '}
                  <span className="word" style={{ animationDelay: '450ms' }}>Fixes</span>{' '}
                  <span className="word" style={{ animationDelay: '540ms' }}>That.</span>
                </em>
              </h1>
              <p className="hs-sub"><em>FDA-Approved hormone replacement therapy with results in just weeks. Feel like your 30's again.</em></p>
              <p className="hs-price">HRT Plans Starting at&nbsp;<strong>$95/mo</strong>&nbsp;<s className="price-was">$160</s>&nbsp;<span className="price-badge">Up to 40% OFF</span><span className="price-per-day">= $3.17/day</span></p>
              <ul className="hs-bullets">
                <li>
                  <span className="hs-bullet-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
                  100% online intake — no office visit needed.
                </li>
                <li>
                  <span className="hs-bullet-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg></span>
                  Prescription + telehealth included. No insurance required.
                </li>
                <li>
                  <span className="hs-bullet-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></span>
                  Same price, every month. No hidden fees.
                </li>
                <li>
                  <span className="hs-bullet-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></span>
                  Free shipping. Arrives in 7 days.
                </li>
              </ul>
              <div className="hs-ctas">
                <a className="hs-btn-primary" href={INTAKE_URL}>
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <a className="hs-btn-secondary" href="#why" onClick={(e) => { e.preventDefault(); const el = document.getElementById('why'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>What is HRT?</a>
              </div>
              <div className="hs-trust">
                <span className="hs-trust-item hs-trust-no">No Hidden Fees</span>
                <span className="hs-trust-item hs-trust-no">No Insurance Required</span>
                <span className="hs-trust-item hs-trust-yes">Cancel Anytime</span>
              </div>
            </div>
            <div className="hs-photo" aria-hidden="true">
              <img src="assets/products-hero.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      <TrustMarquee />
      <ProductsSection ctaUrl={INTAKE_URL} />
      <BonusPromisesSection />
      <EduSection ctaUrl={INTAKE_URL} />
      <ScienceSection ctaUrl={INTAKE_URL} />
      <HrtFlowBand ctaUrl={INTAKE_URL} />
      <FaqSection />
      <StartQuizSection ctaUrl={INTAKE_URL} />
      <FooterSection />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
