/* Review Settings stepper — lives inline on Administration → rmResident Portal (Figma "Stepper"), no overlay.
   Replaces the Get Started banner once "Review Settings" is chosen. The current step follows what has been
   marked Ready to Publish (profile → login → payment policy); the last step publishes.
   Also shows the "rmResident Portal is now live!" dialog on the Activated page. Prototype only. */
(function () {
  'use strict';
  var RO = window.RO;
  if (!RO) return;
  var file = location.pathname.split('/').pop();
  var icon = function (id) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + id + '"></use></svg>'; };

  var STEPS = [
    { n: 'Portal Profiles', key: 'prof:default', text: 'You can create separate portals for different property types, each with its own look and page settings. To continue, review the Default profile and mark it Ready to Publish.' },
    { n: 'Portal Login', key: 'login:default', text: 'Your login page is the same for every resident, no matter which portal profile their property uses. To continue, review it and mark it Ready to Publish.' },
    { n: 'Payment Policies', key: 'pay:default', text: 'Set up different payment policies for each property. To continue, review the Default policy and mark it Ready to Publish.' },
    { n: 'Publish', text: 'You’ve now reviewed everything. Publish now to make rmResident Portal available to your residents.' }
  ];
  function current() {
    var s = RO.get();
    for (var i = 0; i < 3; i++) if (!RO.isReady(s, STEPS[i].key)) return i;
    return 3;
  }
  function goLive() {
    var s = RO.get(); s.converted = true; s.activated = true; s.justLive = true; RO.save(s);
    location.href = 'admin-activated.html';
  }
  /* only Skip & Publish All asks for confirmation; Publish Now on the last step goes straight through */
  function publish(kind) { if (kind === 'final') goLive(); else window.ROConfirmActivate(goLive, kind); }
  function review(i) {
    if (i === 0) location.href = 'profiles-register.html';
    else if (i === 1) { if (window.PL) window.PL.open({ onPublish: render }); }
    else location.href = 'payments-register.html';
  }

  function render() {
    var st = RO.get(), sec = document.getElementById('rmresident-portal');
    if (!sec || !st.reviewing || st.activated) return;
    var banner = sec.querySelector('.ro-banner--start'), host = sec.querySelector('.ro-stepper');
    if (!host) {
      host = document.createElement('div'); host.className = 'ro-stepper';
      if (banner) banner.parentNode.replaceChild(host, banner); else sec.appendChild(host);
      host.addEventListener('click', function (e) {
        var b = e.target.closest('[data-step-act]');
        if (!b) return;
        e.preventDefault();
        var a = b.dataset.stepAct, i = current();
        if (a === 'review') review(i);
        else publish(a === 'publish' ? 'final' : 'skip');
      });
    }
    var cur = current(), s = STEPS[cur];
    host.innerHTML = '<div class="ro-stepper__main"><ol class="ro-stepper__steps">' + STEPS.map(function (x, i) {
      var cls = i < cur ? 'is-done' : i === cur ? 'is-cur' : '';
      return (i ? '<li class="ro-stepper__line" aria-hidden="true"></li>' : '') +
        '<li class="ro-stepper__step ' + cls + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="ro-stepper__dot">' + (i < cur ? icon('check') : i + 1) + '</span>' + x.n + '</li>';
    }).join('') + '</ol><p class="ro-stepper__text">' + s.text + '</p></div>' +
      '<div class="ro-stepper__btns">' + (cur < 3
        ? '<button type="button" class="rmx-btn rmx-btn--secondary" data-step-act="skip" data-ro-final>Skip &amp; Publish All</button><button type="button" class="rmx-btn rmx-btn--primary" data-step-act="review">Review</button>'
        : '<button type="button" class="rmx-btn rmx-btn--primary" data-step-act="publish" data-ro-final>Publish Now</button>') + '</div>';
    var items = sec.querySelector('.ro-items');
    if (items) {
      items.classList.add('ro-items--stepper'); items.hidden = false;
      [].forEach.call(items.querySelectorAll('.ro-item'), function (it, i) { it.classList.toggle('is-current', i === cur); });
    }
  }

  window.ROStepper = render;

  /* the Portal Login tile opens its overlay here too, and the stepper moves on once it is marked Ready */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pl-open]');
    if (!t || !window.PL) return;
    e.preventDefault(); e.stopImmediatePropagation();
    window.PL.open({ onPublish: render });
  }, true);

  /* "rmResident Portal is now live!" — shown on the Activated page right after publishing */
  function live() {
    var s = RO.get();
    if (file !== 'admin-activated.html' || !s.justLive) return;
    s.justLive = false; RO.save(s);
    var w = document.createElement('div'); w.className = 'ro-act ro-live';
    w.innerHTML = '<div class="ro-scrim"></div><div class="ro-act__dialog ro-live__dialog" role="dialog" aria-label="rmResident Portal is now live">' +
      '<div class="ro-act__icons"><button type="button" data-live-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<h2 class="ro-act__title">rmResident Portal is now live!</h2>' +
      '<p class="ro-act__lead">All your residents are now using rmResident Portal. To help them get started, download resident-ready guides from the Online Template Library. If you need to switch back to Tenant Web Access (TWA), you can do that anytime in Web Preferences.</p>' +
      '<div class="ro-live__docs"><img src="../assets/rollout/live/doc-app.png" alt="Download the New rmResident App"><img src="../assets/rollout/live/doc-faq.png" alt="Frequently Asked Questions"><img src="../assets/rollout/live/doc-email.png" alt="Introducing the New Online Resident Portal email"></div>' +
      '<div class="ro-live__foot"><button type="button" class="rmx-btn rmx-btn--primary" data-live-close data-ro-final>Download Documents</button></div></div>';
    w.addEventListener('click', function (e) {
      if (e.target.closest('[data-live-close]') || e.target.classList.contains('ro-scrim')) w.remove();
    });
    document.body.appendChild(w);
  }

  document.addEventListener('DOMContentLoaded', function () {
    render(); live();
    var a = RO.get(); if (a.autoOpen === 'login' && window.PL) { a.autoOpen = ''; RO.save(a); window.PL.open({ onPublish: render }); }
  });
})();
