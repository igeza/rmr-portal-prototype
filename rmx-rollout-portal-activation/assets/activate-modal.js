/* "Activate rmResident Portal" chooser (Figma Admin → Add New Template Pages).
   Opens from the orange Activate button on the Get Started banner.
   Just Activate → Administration (Activated). Guided Setup → Setup guide. Prototype only. */
(function () {
  'use strict';
  var I = '../assets/icons.svg#', R = '../assets/rollout/';
  function icon(id) { return '<svg class="rmx-icon"><use href="' + I + id + '"></use></svg>'; }
  var choice = 'just';
  function open() {
    if (document.querySelector('.ro-act')) return;
    var w = document.createElement('div');
    w.className = 'ro-act';
    w.innerHTML = '<div class="ro-scrim"></div>' +
      '<div class="ro-act__dialog" role="dialog" aria-label="Activate rmResident Portal">' +
      '<div class="ro-act__icons"><button type="button" aria-label="Help">' + icon('help') + '</button><button type="button" data-act-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<h2 class="ro-act__title">Activate rmResident Portal</h2>' +
      '<p class="ro-act__lead">Your TWA settings carry over to the Default profile. All residents will see the new rmResident Portal as soon as you activate.  How would you like to get started?</p>' +
      '<div class="ro-act__opts" role="radiogroup">' +
      '<button type="button" class="ro-act__opt" role="radio" data-opt="just"><span class="ro-act__radio"></span><span class="ro-act__body"><span class="ro-act__head"><svg class="rmx-icon ro-act__ic"><use href="' + I + 'check-circle-filled"></use></svg>Just Activate</span><span class="ro-act__desc">I have reviewed the settings or will review them after portal is published to my residents.</span></span></button>' +
      '<button type="button" class="ro-act__opt" role="radio" data-opt="guided"><span class="ro-act__radio"></span><span class="ro-act__body"><span class="ro-act__head"><img class="ro-act__ic" src="' + R + 'imgTour.svg" alt="">Review Settings</span><span class="ro-act__desc">I want a walk through all the updated settings before I publish the portal to my residents.</span></span></button>' +
      '</div>' +
      '<div class="ro-act__note">' + icon('info') + 'You can switch back to TWA at any point.</div>' +
      '<div class="ro-act__foot"><a class="rmx-btn rmx-btn--primary" href="#" data-act-next data-rmx-component="Button">Next</a></div>' +
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
        if (choice === 'just') { var s = window.RO.get(); s.converted = true; s.activated = true; window.RO.save(s); }
        location.href = choice === 'just' ? 'admin-activated.html' : 'setup-guide.html';
      }
    });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { w.remove(); document.removeEventListener('keydown', esc); } });
  }
  /* After "Save & Don't Activate" the banner CTA becomes a split button: Activate / Finish Guided Setup. */
  function splitUp() {
    var s = window.RO && window.RO.get();
    if (!s || !s.guidedSaved || s.activated) return;
    var b = document.querySelector('[data-ro-activate-open]');
    if (!b) return;
    var w = document.createElement('div');
    w.className = 'ro-split';
    w.innerHTML = '<div class="rmx-split ro-split__btn"><button type="button" class="rmx-split__main" data-ro-activate-open>Get Started</button><button type="button" class="rmx-split__caret" aria-label="More options" aria-haspopup="menu" aria-expanded="false">' + icon('arrow-drop-down') + '</button></div>' +
      '<div class="rmx-menu ro-split__menu" role="menu" hidden><button type="button" data-value="activate" role="menuitem" data-act-go="activate">Activate</button><button type="button" data-value="finish" role="menuitem" data-act-go="finish">Finish Guided Setup</button></div>';
    b.replaceWith(w);
    var caret = w.querySelector('.rmx-split__caret'), menu = w.querySelector('.ro-split__menu');
    caret.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; caret.setAttribute('aria-expanded', String(!menu.hidden)); });
    document.addEventListener('click', function () { menu.hidden = true; caret.setAttribute('aria-expanded', 'false'); });
    w.addEventListener('click', function (e) {
      var g = e.target.closest('[data-act-go]'); if (!g) return;
      if (g.dataset.actGo === 'activate') { var s2 = window.RO.get(); s2.converted = true; s2.activated = true; window.RO.save(s2); location.href = 'admin-activated.html'; }
      else location.href = 'setup-guide.html?step=9';
    });
  }
  document.addEventListener('DOMContentLoaded', splitUp);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-ro-activate-open]')) { e.preventDefault(); choice = 'just'; open(); }
  });
})();
