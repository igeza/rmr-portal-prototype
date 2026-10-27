/* "Ready to Publish" success overlay during Review Settings: confirms the step that was just checked, previews the next
   one, and offers Stay on this page / Review next step. window.ROReadySuccess(key). Prototype only. */
(function () {
  'use strict';
  var RO = window.RO;
  if (!RO) return;
  var icon = function (id) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + id + '"></use></svg>'; };
  var STEPS = {
    'prof:default': { done: 'Portal Profiles', what: 'The Default profile is marked Ready to Publish.', next: 'Portal Login', text: 'Your login page is the same for every resident, no matter which portal profile their property uses. Review it and mark it Ready to Publish.', go: 'login' },
    'login:default': { done: 'Portal Login', what: 'The login page is marked Ready to Publish.', next: 'Payment Policies', text: 'Set up different payment policies for each property. Review the Default policy and mark it Ready to Publish.', go: 'payments-register.html' },
    'pay:default': { done: 'Payment Policies', what: 'The Default payment policy is marked Ready to Publish.', next: 'Publish', text: 'You’ve now reviewed everything. Publish to make rmResident Portal available to your residents.', go: 'admin-get-started.html' }
  };

  window.ROReadySuccess = function (key) {
    var s = RO.get(), st = STEPS[key];
    if (!st || !s.reviewing || s.activated || document.querySelector('.ro-rs')) return;
    var w = document.createElement('div'); w.className = 'ro-act ro-rs';
    w.innerHTML = '<div class="ro-scrim" style="z-index:1190"></div><div class="ro-act__dialog ro-rs__dialog" role="dialog" aria-label="' + st.done + ' checked" style="z-index:1200">' +
      '<div class="ro-rs__ok">' + icon('check-circle-filled') + '</div>' +
      '<h2 class="ro-act__title">' + st.done + ' checked</h2>' +
      '<p class="ro-rs__what">' + st.what + '</p>' +
      '<div class="ro-rs__next"><b>Next step: ' + st.next + '</b><span>' + st.text + '</span></div>' +
      '<div class="ro-rs__foot"><button type="button" class="rmx-btn rmx-btn--secondary" data-rs-stay>Stay on This Page</button><button type="button" class="rmx-btn rmx-btn--primary" data-rs-next>Review Next Step</button></div></div>';
    w.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-rs-stay]')) { e.preventDefault(); w.remove(); }
      else if (e.target.closest('[data-rs-next]')) {
        e.preventDefault(); w.remove();
        if (st.go === 'login') { var t = RO.get(); t.autoOpen = 'login'; RO.save(t); location.href = 'admin-get-started.html'; }
        else location.href = st.go;
      }
    });
    document.body.appendChild(w);
  };
})();
