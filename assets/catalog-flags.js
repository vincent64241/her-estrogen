/* HerEstrogen — non-GLP-1 catalog launch gates.
   PEPTIDE_LAUNCH_ENABLED gates Sermorelin / NAD+ / PT-141 from public view.
   DEFAULT false. Flip true ONLY after legal sign-off on peptide marketing. */
(function(){'use strict';
  var PEPTIDE_LAUNCH_ENABLED = true;   /* LAUNCHED 2026-07-09 per operator: peptides are permitted; ship live. */
  window.PEPTIDE_LAUNCH_ENABLED = PEPTIDE_LAUNCH_ENABLED;
  function apply(){
    [].forEach.call(document.querySelectorAll('[data-peptide-gated]'),function(el){ el.hidden = !PEPTIDE_LAUNCH_ENABLED; });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply); else apply();
})();
