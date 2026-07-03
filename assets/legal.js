/* ────────────────────────────────────────────────────────────────
   Single source of truth for external OpenLoop legal URLs.
   Referenced on every page (footer + any consent links) via the
   data-legal-link attribute. Update the URLs here only.
   ──────────────────────────────────────────────────────────────── */
window.HE_LEGAL = {
  OPENLOOP_TELEHEALTH_CONSENT_URL: 'https://openloophealth.com/telehealth-consent',
  OPENLOOP_NPP_URL: 'https://openloophealth.com/notice-of-privacy-practices'
};

(function () {
  var MAP = { npp: 'OPENLOOP_NPP_URL', telehealth: 'OPENLOOP_TELEHEALTH_CONSENT_URL' };
  function apply() {
    document.querySelectorAll('[data-legal-link]').forEach(function (a) {
      var key = MAP[a.getAttribute('data-legal-link')];
      if (key && window.HE_LEGAL[key]) {
        a.setAttribute('href', window.HE_LEGAL[key]);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
