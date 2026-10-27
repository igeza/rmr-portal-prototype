/* Review Settings — two lighter versions of the guide (same Publish / Save as Draft behaviour as setup-guide.js).
   screens/setup-guide-single.html  the default guide: one dialog that shows what's where (no steps).
   screens/setup-guide-simple.html  a 3-step version, kept for comparison (?guide=simple).
   Nothing is forced: the cards just open the real pages. Prototype only. */
(function () {
  'use strict';
  var I = '../assets/icons.svg#', R = '../assets/rollout/';
  function ic(id) { return '<svg class="rmx-icon"><use href="' + I + id + '"></use></svg>'; }
  function tile(bg, svg, h, p) { return '<div class="ro-new-item"><span class="ro-new-item__icon" style="background:' + bg + '">' + svg + '</span><div><h5>' + h + '</h5><p>' + p + '</p></div></div>'; }
  function card(img, h, p, where, attr) { return '<a class="sg-card sg-card--link" ' + attr + '>' + (img.charAt(0) === '<' ? img : '<img src="' + R + img + '" alt="">') + '<div><h4>' + h + '</h4><p>' + p + '</p><span class="sg-where">' + where + '</span></div><span class="ro-link">Open</span></a>'; }

  var NEW = '<div class="ro-new-list">' +
    tile('#f9d57b', '<img class="ro-tile-img" src="' + R + 'tour-checklist.svg" alt="">', 'Multiple Profiles', 'A different look and settings for each property type.') +
    tile('#dbe1e5', '<img class="ro-tile-img" src="' + R + 'tour-event.svg" alt="">', 'Modern New Look', 'A refreshed design your residents will notice from day one.') +
    tile('#afcef4', ic('visibility'), 'Portal Preview', 'See what residents will see before anything goes live.') +
    tile('#c9e5c3', '<img class="ro-tile-img" src="' + R + 'tour-setting.svg" alt="">', 'Access Control', 'Keep portal management separate from system settings.') + '</div>';
  var EYE = '<span class="sg-eye">' + ic('visibility') + '</span>';
  var LOOK = '<div class="sg-cards">' +
    card('imgFrame1618873801.svg', 'Portal Profiles', 'Colors, themes, logo, and which pages are on, for each property type.', 'Admin › rmResident Portal › Portal Profiles', 'href="profiles-register.html"') +
    card('imgFrame1618873664.svg', 'Portal Login', 'The sign-in page your residents see.', 'Admin › rmResident Portal › Portal Login', 'href="#" data-pl-open') +
    card('imgMoney.svg', 'Payment Policies', 'Which payment options residents get, for each property.', 'Admin › rmResident Portal › Payment Policies', 'href="payments-register.html"') +
    card(EYE, 'Portal Preview', 'See the portal the way your residents will, anytime.', 'Open a profile › Portal Preview', 'href="#" data-sg-preview') + '</div>';
  var SAFE = '<p class="sg-hint sg-hint--note">' + ic('info') + 'Nothing changes for residents until you publish.</p>';
  var PREVIEW = '<div><button type="button" class="rmx-btn rmx-btn--secondary sg-prevbtn" data-sg-preview><svg class="rmx-icon"><use href="../assets/icons-local.svg#play-arrow"></use></svg>Preview Portal</button></div>';
  var OPTS = '<div class="sg-opt"><b>Save as draft</b><p>Keep exploring. Residents see nothing yet.</p></div><div class="sg-opt"><b>Publish now</b><p>Residents see the new portal right away.</p></div>';

  var STEPS = [
    { n: 'What’s new', t: 'What’s new', h: '<p class="sg-lead">A quick look at what’s new in rmResident Portal.</p>' + NEW },
    { n: 'Take a look', t: 'Take a look', h: '<p class="sg-lead">Optional: open any page to explore. Your TWA settings are already in your Default profile.</p>' + LOOK + SAFE },
    { n: 'Publish', t: 'Ready when you are', h: PREVIEW + '<div class="sg-opts">' + OPTS + '</div>' }
  ];

  var wrap, single, cur = 0;
  var q = /[?&]step=(\d)/.exec(location.search); if (q) cur = Math.min(STEPS.length - 1, Math.max(0, +q[1] - 1));
  function leave(published) {
    var st = window.RO.get(); st.reviewing = true;
    if (published) { st.converted = true; st.activated = true; }
    else {
      st.guidedSaved = true; st.touched = true; st.ready = st.ready || {};
      Object.keys(st.profiles).forEach(function (k) { if (st.profiles[k].active) st.profiles[k].status = 'ready'; });
      st.ready['pay:default'] = true; st.ready['login:default'] = true;
    }
    window.RO.save(st);
    location.href = published ? 'admin-activated.html' : 'admin-get-started.html';
  }
  function finish() { return '<span class="sg-foot__r"><button type="button" class="rmx-btn rmx-btn--primary" data-publish data-ro-final>Publish</button><button type="button" class="rmx-btn rmx-btn--primary" data-save>Save as Draft</button></span>'; }

  function renderStepper() {
    var s = STEPS[cur], last = cur === STEPS.length - 1;
    wrap.querySelector('.sg-nav').innerHTML = STEPS.map(function (x, i) {
      var st = i < cur ? 'done' : i === cur ? 'cur' : 'todo';
      return '<li class="sg-step sg-step--' + st + '"><button type="button" data-go="' + i + '"><span class="sg-dot">' + (st === 'done' ? ic('check') : st === 'cur' ? ic('edit') : i + 1) + '</span>' + x.n + '</button></li>';
    }).join('');
    wrap.querySelector('.sg-main').innerHTML = '<h3 class="sg-title">' + s.t + '</h3><div class="sg-content">' + s.h + '</div>' +
      '<div class="sg-foot">' + (cur ? '<button type="button" class="rmx-btn rmx-btn--secondary" data-back>Back</button>' : '<span></span>') + (last ? finish() : '<button type="button" class="rmx-btn rmx-btn--primary" data-next>Next</button>') + '</div>';
  }
  /* Free-explore guide: not a map of the admin pages, just what isn't obvious on them */
  function tip(icon, h, p, attr, link) { return '<a class="sg-tip" ' + attr + '><span class="sg-tip__ic">' + ic(icon) + '</span><div><b>' + h + '</b><p>' + p + '</p></div><span class="ro-link">' + (link || 'Open') + '</span></a>'; }
  var TIPS = '<div class="sg-tips">' +
    tip('info', 'One profile per property type', 'Anything you don’t assign uses Default, so only add a profile when a property type needs its own look.', 'href="profiles-register.html"') +
    tip('visibility', 'Preview shows your draft', 'Try colors, themes and pages freely. Residents only see changes once they’re published.', 'href="#" data-sg-preview', 'Try it') +
    tip('info', 'Turn pages on or off', 'Pages you turn off disappear from your residents’ menu. Find them under Page Settings in a profile.', 'href="profile-settings.html"') +
    tip('info', 'Hide the portal for some properties', 'Portal Login lets you disable the portal for selected properties and choose what new sign-ups must provide.', 'href="#" data-pl-open') +
    tip('info', 'Payment policies preview as you build', 'Each policy covers its own properties, and the preview shows what residents will be able to pay.', 'href="payments-register.html"') +
    tip('info', 'Give your team access', 'Portal access is its own privilege, separate from system settings. Set it in User Privileges.', 'href="user-privileges.html"') + '</div>';
  var SAFE2 = '<p class="sg-hint sg-hint--note">' + ic('info') + 'Nothing changes for residents until you publish, and you can switch back to TWA at any point.</p>';
  function renderSingle() {
    wrap.querySelector('.sg-main').innerHTML = '<h3 class="sg-title">Explore rmResident Portal</h3><div class="sg-content">' +
      '<p class="sg-lead">Look around whenever you like. A few things that aren’t obvious from the pages:</p>' + TIPS + SAFE2 + '</div>' +
      '<div class="sg-foot"><span></span>' + finish() + '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    wrap = document.querySelector('.sg'); if (!wrap) return;
    single = wrap.dataset.guide === 'single';
    wrap.innerHTML = '<div class="ro-scrim"></div><div class="sg-dialog' + (single ? ' sg-dialog--single' : '') + '" role="dialog" aria-label="Review Settings"><div class="sg-top"><a href="admin-get-started.html" aria-label="Close">' + ic('close') + '</a></div>' +
      '<div class="sg-body">' + (single ? '' : '<aside class="sg-side"><h2>Review Settings</h2><ol class="sg-nav"></ol></aside>') + '<section class="sg-main"></section></div></div>';
    if (single) renderSingle(); else renderStepper();
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-sg-preview]')) { window.PB.preview(); document.getElementById('ov-preview').hidden = false; return; }
      if (t.closest('#ov-preview [data-ro-close]')) { e.preventDefault(); document.getElementById('ov-preview').hidden = true; return; }
      var g = t.closest('[data-go]'); if (g) { cur = +g.dataset.go; return renderStepper(); }
      if (t.closest('[data-next]')) { cur++; return renderStepper(); }
      if (t.closest('[data-back]')) { cur--; return renderStepper(); }
      if (t.closest('[data-save]')) return leave(false);
      if (t.closest('[data-publish]')) return window.ROConfirmActivate(function () { leave(true); });
      if (t.closest('a[href="#"]:not([data-pl-open])')) e.preventDefault();
    });
  });
})();
