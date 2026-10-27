/* "Activate rmResident Portal" chooser (Figma Admin → Add New Template Pages).
   Opens from the orange Activate button on the Get Started banner.
   Just Activate → Administration (Activated). Guided Setup → Setup guide. Prototype only. */
(function () {
  'use strict';
  var I = '../assets/icons.svg#', R = '../assets/rollout/';
  function icon(id) { return '<svg class="rmx-icon"><use href="' + I + id + '"></use></svg>'; }
  var choice = 'guided';
  /* Confirm Activation (Figma 2972:56232) — shared by every Activate button. */
  function confirmActivate(onYes, kind) {
    if (document.querySelector('.sg-confirm')) return;
    var d = document.createElement('div'); d.className = 'sg-confirm';
    d.innerHTML = '<div class="ro-scrim" style="z-index:990"></div><div class="ro-dialog ro-popup" role="alertdialog" aria-label="Confirm Publish" style="z-index:1000">' +
      '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span>Confirm Publish</span><span class="sg-confirm__icons"><a href="#" aria-label="Help">' + icon('help') + '</a><a href="#" data-confirm-close aria-label="Close">' + icon('close') + '</a></span></div>' +
      '<div class="ro-dialog__body">' + icon('info-filled') + '<div class="sg-confirm__text">' + (kind === 'skip' ? '<p>Publishing now will make rmResident Portal the live experience for all residents and retire TWA across all locations using the default settings.</p><p>Do you want to continue?</p>' : '<p>Publishing will make rmResident Portal the live experience for all residents and retire TWA across all locations.</p>') + '</div></div>' +
      '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" data-confirm-go data-ro-final>Publish</button><button type="button" class="rmx-btn rmx-btn--secondary" data-confirm-close>Cancel</button></div></div>';
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-confirm-close]')) { e.preventDefault(); d.remove(); }
      else if (e.target.closest('[data-confirm-go]')) onYes();
    });
    document.body.appendChild(d);
  }
  window.ROConfirmActivate = confirmActivate;
  function goActivated() { var s = window.RO.get(); s.converted = true; s.activated = true; s.justLive = true; window.RO.save(s); location.href = 'admin-activated.html'; }
  function open() {
    if (document.querySelector('.ro-act')) return;
    var w = document.createElement('div');
    w.className = 'ro-act';
    w.innerHTML = '<div class="ro-scrim"></div>' +
      '<div class="ro-act__dialog" role="dialog" aria-label="Get started with rmResident Portal">' +
      '<div class="ro-act__icons"><button type="button" aria-label="Help">' + icon('help') + '</button><button type="button" data-act-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<h2 class="ro-act__title">Get started with rmResident Portal</h2>' +
      '<p class="ro-act__lead">We’ll do the heavy lifting for you! After this step, all your TWA settings will be automatically copied to their respective rmResident Portal settings. You can review each area and mark it Ready to Publish, or skip the review and publish now. Your residents won’t see the new portal until you publish.</p>' +
      '<div class="ro-act__opts" role="radiogroup">' +
      '<button type="button" class="ro-act__opt" role="radio" data-opt="guided"><span class="ro-act__radio"></span><span class="ro-act__body"><span class="ro-act__head"><svg class="rmx-icon ro-act__ic"><use href="' + I + 'settings"></use></svg>Review Settings</span><span class="ro-act__desc">I want to review and update my portal settings before I publish the portal for my residents.</span></span></button>' +
      '<button type="button" class="ro-act__opt" role="radio" data-opt="just"><span class="ro-act__radio"></span><span class="ro-act__body"><span class="ro-act__head"><svg class="rmx-icon ro-act__ic"><use href="' + I + 'check-circle-filled"></use></svg>Publish Now</span><span class="ro-act__desc">I want to publish the portal with a copy of my current TWA settings.</span></span></button>' +
      '</div>' +
      '<img class="ro-tourart" src="' + R + 'announcement-art.png" alt="Preview of the new rmResident Portal tenant dashboard">' +
      '<div class="ro-act__foot"><div class="ro-act__note">' + icon('info') + 'You can switch back to TWA at any point.</div><a class="rmx-btn rmx-btn--primary" href="#" data-act-next data-rmx-component="Button">Next</a></div>' +
      '</div>';
    document.body.appendChild(w);
    function sel(v) {
      choice = v;
      [].forEach.call(w.querySelectorAll('.ro-act__opt'), function (b) { b.setAttribute('aria-checked', String(b.dataset.opt === v)); });
    }
    sel(choice);
    w.addEventListener('click', function (e) {
      var o = e.target.closest('.ro-act__opt');
      if (o) return sel(o.dataset.opt);
      if (e.target.closest('[data-act-close]') || e.target.classList.contains('ro-scrim')) return w.remove();
      if (e.target.closest('[data-act-next]')) {
        e.preventDefault();
        if (choice === 'just') return confirmActivate(goActivated, 'skip');
        var rs = window.RO.get(); rs.reviewing = true; window.RO.save(rs);
        w.remove();
        if (window.ROStepper) window.ROStepper(); else location.href = 'admin-get-started.html';
      }
    });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { w.remove(); document.removeEventListener('keydown', esc); } });
  }
  /* After "Save as Draft" the banner button becomes Activate (opens the confirmation). */
  function splitUp() {
    var s = window.RO && window.RO.get();
    if (!s || !s.guidedSaved || s.activated) return;
    var b = document.querySelector('[data-ro-activate-open]');
    if (!b) return;
    b.removeAttribute('data-ro-activate-open');
    b.textContent = 'Publish'; b.setAttribute('data-ro-final', '');
    var body = document.querySelector('.ro-banner--start .ro-banner__body');
    if (body) body.textContent = 'Make sure all settings you updated are marked as Ready to Publish before publishing.';
    var ttl = document.querySelector('.ro-banner--start .ro-banner__title');
    if (ttl) ttl.textContent = 'Publish your portal';
    b.addEventListener('click', function (e) { e.preventDefault(); confirmActivate(goActivated); });
    /* a way back into the guide next to Publish */
    var wrapB = document.createElement('div'); wrapB.className = 'ro-banner__btns';
    b.parentNode.insertBefore(wrapB, b);
    var back = document.createElement('a'); back.className = 'rmx-btn rmx-btn--secondary'; back.href = window.RO.guideUrl(); back.textContent = 'Review Settings';
    wrapB.appendChild(back); wrapB.appendChild(b);
  }
  document.addEventListener('DOMContentLoaded', splitUp);
  /* The four portal settings stay hidden while the Get Started banner is showing, i.e. until the portal is activated
     (the Activated page is a different state and shows them). */
  (function () {
    var items = document.querySelector('.ro-banner--start + .ro-items'), rs = window.RO && window.RO.get();
    if (items && !(rs && (rs.reviewing || rs.guidedSaved))) items.hidden = true;
  })();
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-ro-activate-open]')) { e.preventDefault(); choice = 'guided'; open(); }
  });
})();
