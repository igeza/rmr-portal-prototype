/* Portal Login Settings overlay — opened from the setup checklist (Portal Login Settings → Review)
   and from Administration → rmResident Portal → Portal Login. window.PL.open({ onPublish }).
   Injected into whichever page needs it. Prototype scaffolding. */
(function () {
  'use strict';
  var RO = window.RO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IC = function (n) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + n + '"></use></svg>'; };
  var A = '../assets/rollout/login/';
  var CHK = function (id, label, extra) { return '<label class="rmx-check" data-static data-checked="false" id="' + id + '"' + (extra || '') + '><span class="rmx-check__box">' + IC('check') + '</span><span>' + label + '</span></label>'; };
  var COLORS = [['ocean-blue', 'Ocean Blue'], ['forest-green', 'Forest Green'], ['sunset-orange', 'Sunset Orange'], ['royal-purple', 'Royal Purple'], ['crimson-red', 'Crimson Red'], ['charcoal-gray', 'Charcoal Gray']];
  var UDF = function (n) { return '<div class="pl-row">' + CHK('pl-udf' + n, 'User Defined Field') + '<div class="pl-dd" data-rmx-dropdown id="pl-udfdd' + n + '"><button class="rmx-field__box" data-rmx-trigger type="button"><span data-rmx-value class="pl-dd__v"></span>' + IC('keyboard-arrow-down') + '</button><div class="rmx-menu" data-rmx-menu hidden><button data-value="Pet Count">Pet Count</button><button data-value="Parking Spot">Parking Spot</button><button data-value="Move-in Source">Move-in Source</button></div></div></div>'; };
  var HTML = '<div class="ro-ov ro-ov--top" id="ov-login" hidden><div class="ro-scrim"></div><div class="ro-dialog pp-dialog pl-dialog" role="dialog" aria-label="Portal Login">' +
    '<div class="rmx-overlay__header"><span>Portal Login</span><span class="pl-hdr"><a class="pl-prev" href="#" data-rmx-todo="Portal Login preview"><img src="' + A + 'play-arrow.svg" alt="">Preview</a><a href="#" data-pl-close aria-label="Close">' + IC('close') + '</a></span></div>' +
    '<div class="pp-body">' +
    '<section class="pp-tile"><h3>Logo</h3><div class="pp-tile__b"><p class="pp-intro">Replace the rmResident Portal logo with your own to create a more personalized login experience.</p>' +
      '<div class="pl-attach"><div class="pl-attach__img" id="pl-logo"><div class="pl-thumb"><img src="' + A + 'logo.png" alt="" class="pl-thumb__img"><div class="pl-cap"><span>img_4321.jpg</span><button type="button" id="pl-logo-x" aria-label="Remove logo"><img src="' + A + 'close-16.svg" alt=""></button></div></div></div>' +
      '<div class="pl-upload"><span class="pl-upload__b" data-rmx-todo="Upload"><img src="' + A + 'cloud-upload.svg" alt="">Upload</span><img src="' + A + 'divider.svg" alt=""><span class="pl-upload__b" data-rmx-todo="Paste"><img src="' + A + 'paste.svg" alt="">Paste</span></div></div>' +
      '<p class="pl-hint">Recommended size: 300x100px</p></div></section>' +
    '<section class="pp-tile"><h3>Colors</h3><div class="pp-tile__b"><p class="pp-intro">Select colors to match your brand.</p><div class="pl-colors">' +
      COLORS.map(function (c) { return '<div class="pl-color"><div class="rmx-radio pp-radio pl-radio" data-static data-checked="false" data-color="' + c[0] + '"><span class="rmx-radio__dot"></span><span>' + c[1] + '</span></div><img src="' + A + 'color-' + c[0] + '.png" alt="" data-color="' + c[0] + '"></div>'; }).join('') +
      '</div><hr class="pl-hr"><div class="pl-custom"><div class="rmx-radio pp-radio pl-radio" data-static data-checked="true" data-color="custom"><span class="rmx-radio__dot"></span><span>Use Custom Colors</span></div><div class="pl-sw" id="pl-sw"><div><span style="background:#82b3ed"></span>Main Color</div><div><span style="background:#1a64bc"></span>Button Color</div></div></div></div></section>' +
    '<section class="pp-tile"><h3>Login Page Message</h3><div class="pp-tile__b"><p class="pp-intro">Display a custom message under your logo to welcome users or communicate important information.</p>' +
      '<div class="pl-editor"><div class="pl-editor__bar">' + ['link', 'italic', 'bold', 'underlined', 'align', 'clear'].map(function (n) { return '<img src="' + A + n + '.svg" alt="">'; }).join('') + '</div><div class="pl-editor__body" id="pl-msg" contenteditable="true" spellcheck="false"></div></div></div></section>' +
    '<section class="pp-tile"><h3>Property Settings</h3><div class="pp-tile__b"><div class="pp-lbl">Disable rmResident Portal for Selected Properties<div class="pl-dd pl-dd--full" data-rmx-dropdown id="pl-prop"><button class="rmx-field__box" data-rmx-trigger type="button"><span data-rmx-value class="pl-dd__v"></span>' + IC('keyboard-arrow-down') + '</button><div class="rmx-menu" data-rmx-menu hidden><button data-value="Riverview Apartments">Riverview Apartments</button><button data-value="Summerlin HOA">Summerlin HOA</button><button data-value="Flagstone Manufactured Housing">Flagstone Manufactured Housing</button></div></div></div></div></section>' +
    '<section class="pp-tile"><h3>Signup Settings</h3><div class="pp-tile__b"><div class="pl-signup">' + CHK('pl-allow', 'Allow tenants to sign up for new accounts from the portal') +
      '<p class="pl-note">Account # is always required to verify a new account. Select more fields for extra security.</p>' +
      '<div class="pl-fields">' + '<div class="pl-row pl-row--s">' + CHK('pl-phone', 'Phone Number') + '</div>' +
      '<div class="pl-row">' + CHK('pl-ssn', 'Social Security #') + CHK('pl-ssn4', 'Only use last four digits') + '</div>' +
      '<div class="pl-row">' + CHK('pl-birth', 'Birth Date') + '</div>' + UDF(1) + UDF(2) + UDF(3) + '</div></div></div></section>' +
    '</div><div class="rmx-overlay__footer"><button class="rmx-btn rmx-btn--primary" id="pl-publish">Publish</button><button class="rmx-btn rmx-btn--secondary" data-pl-close>Cancel</button></div></div></div>';

  var cfg = null, onPublish = null, wired = false;
  var DEF = function () { return { logo: true, color: 'custom', msg: 'Welcome to Riverview Apartments Tenant Portal! Log in to gain access to online payments, maintenance requests, and more.', prop: '', allow: true, phone: false, ssn: false, ssn4: false, birth: false, udf: [false, false, false], udfv: ['', '', ''] }; };
  function setC(id, on, dis) { var e = $('#' + id); e.dataset.checked = String(!!on); e.classList.toggle('is-disabled', !!dis); }
  function paint() {
    $('#pl-logo').style.display = cfg.logo ? '' : 'none';
    $$('.pl-radio').forEach(function (r) { r.dataset.checked = String(r.dataset.color === cfg.color); });
    $('#pl-sw').hidden = cfg.color !== 'custom';
    $('#pl-prop .pl-dd__v').textContent = cfg.prop;
    var al = cfg.allow;
    setC('pl-allow', al);
    setC('pl-phone', cfg.phone, !al); setC('pl-ssn', cfg.ssn, !al); setC('pl-birth', cfg.birth, !al);
    setC('pl-ssn4', cfg.ssn4, !al || !cfg.ssn);
    [1, 2, 3].forEach(function (n) {
      setC('pl-udf' + n, cfg.udf[n - 1], !al);
      var dd = $('#pl-udfdd' + n); dd.classList.toggle('is-disabled', !al || !cfg.udf[n - 1]);
      $('.pl-dd__v', dd).textContent = cfg.udfv[n - 1];
    });
  }
  function wire() {
    if (wired) return; wired = true;
    var h = document.createElement('div'); h.innerHTML = HTML; document.body.appendChild(h.firstChild);
    $('#pl-logo-x').addEventListener('click', function () { cfg.logo = false; paint(); });
    $$('.pl-color img, .pl-radio').forEach(function (n) { n.addEventListener('click', function () { cfg.color = n.dataset.color; paint(); }); });
    var flip = function (id, key, needs) { $('#' + id).addEventListener('click', function () { if (this.classList.contains('is-disabled')) return; cfg[key] = !cfg[key]; if (key === 'ssn' && !cfg.ssn) cfg.ssn4 = false; paint(); }); };
    flip('pl-allow', 'allow'); flip('pl-phone', 'phone'); flip('pl-ssn', 'ssn'); flip('pl-ssn4', 'ssn4'); flip('pl-birth', 'birth');
    [1, 2, 3].forEach(function (n) {
      $('#pl-udf' + n).addEventListener('click', function () { if (this.classList.contains('is-disabled')) return; cfg.udf[n - 1] = !cfg.udf[n - 1]; if (!cfg.udf[n - 1]) cfg.udfv[n - 1] = ''; paint(); });
      var dd = $('#pl-udfdd' + n);
      $('[data-rmx-trigger]', dd).addEventListener('click', function (e) { if (dd.classList.contains('is-disabled')) e.stopImmediatePropagation(); }, true);
      dd.addEventListener('rmx:select', function (e) { cfg.udfv[n - 1] = e.detail.value; paint(); });
    });
    $('#pl-prop').addEventListener('rmx:select', function (e) { cfg.prop = e.detail.value; paint(); });
    $('#pl-msg').addEventListener('input', function () { cfg.msg = this.innerText; });
    $$('[data-pl-close]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); $('#ov-login').hidden = true; }); });
    var dirty = function () { $('#pl-publish').textContent = 'Save & Publish'; };
    $('#ov-login').addEventListener('input', dirty);
    $('#ov-login').addEventListener('click', function (e) { if (e.target.closest('.rmx-check, .rmx-radio, .ro-toggle, [data-value]')) dirty(); });
    $('#pl-publish').addEventListener('click', function () {
      var s = RO.get(); s.loginCfg = cfg; s.ready = s.ready || {}; s.ready['login:default'] = true; s.touched = true; RO.save(s);
      $('#ov-login').hidden = true;
      if (onPublish) onPublish();
    });
  }
  function open(opts) {
    wire(); onPublish = opts && opts.onPublish;
    var s = RO.get(); cfg = JSON.parse(JSON.stringify(s.loginCfg || DEF()));
    $('#pl-publish').textContent = 'Publish'; $('#pl-msg').textContent = cfg.msg; paint(); $('#ov-login').hidden = false;
  }
  document.addEventListener('click', function (e) { var o = e.target.closest('[data-pl-open]'); if (o) { e.preventDefault(); open(); } });
  window.PL = { open: open };
})();
