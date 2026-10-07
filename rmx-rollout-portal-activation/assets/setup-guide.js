/* Setup guide — the guided path (Figma "Stepper"). Replaces the old checklist.
   8 steps in one dialog over Administration. Prototype only: fields are not saved. */
(function () {
  'use strict';
  var I = '../assets/icons.svg#', B = '../assets/rollout/branding/', L = '../assets/rollout/login/';
  function ic(id) { return '<svg class="rmx-icon"><use href="' + I + id + '"></use></svg>'; }
  function chk(label, on, dis) { return '<button type="button" class="sg-check' + (dis ? ' is-dis' : '') + '" role="checkbox" aria-checked="' + (on !== false) + '"><span class="sg-check__box">' + ic('check') + '</span>' + label + '</button>'; }
  function rad(label, on, name) { return '<button type="button" class="sg-radio" role="radio" data-name="' + name + '" aria-checked="' + !!on + '"><span class="sg-radio__dot"></span>' + label + '</button>'; }
  function field(label, val, extra) { return '<label class="sg-field ' + (extra || '') + '"><span>' + label + '</span><span class="rmx-field__box"><input value="' + (val || '') + '"></span></label>'; }
  function rte(h, txt, swap, lists) { var ico = function (n) { return '<img src="../assets/rollout/login/' + n + '.svg" alt="">'; }; return '<div class="sg-rte"><div class="sg-rte__bar">' + ico('link') + (swap ? ico('italic') + ico('bold') : ico('bold') + ico('italic')) + ico('underlined') + ico('clear') + ico('align') + (lists ? '<svg class="rmx-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M3 15.5h2v.5H4v1h1v.5H3v1h3v-4H3v1zM4 6h1V2H3v1h1v3zM3 9.5h1.8L3 11.6V12.5h3v-1H4.2L6 9.4V8.5H3v1zM8 4v2h9V4H8zm0 12h9v-2H8v2zm0-5h9V9H8v2z" transform="translate(0 0.5)"/></svg><svg class="rmx-icon"><use href="' + I + 'list"></use></svg>' : '') + '</div><div class="sg-rte__area" style="height:' + h + 'px">' + (txt || '') + '</div></div>'; }
  var colors = [['Ocean Blue', 'ocean-blue'], ['Forest Green', 'forest-green'], ['Sunset Orange', 'sunset-orange'], ['Royal Purple', 'royal-purple'], ['Crimson Red', 'crimson-red'], ['Charcoal Gray', 'charcoal-gray']];
  function colorGrid(custom) {
    return '<div class="sg-box"><div class="sg-colors">' + colors.map(function (c) { return '<div class="sg-color">' + rad(c[0], false, 'color') + '<img src="' + B + 'color-' + c[1] + '.png" alt=""></div>'; }).join('') + '</div>' +
      (custom ? '<div class="sg-custom">' + rad('Use Custom Colors', true, 'color') + '<div class="sg-sw"><i style="background:#1a5fb4"></i>Main Color</div><div class="sg-sw"><i style="background:#1a5fb4"></i>Button Color</div><div class="sg-sw"><i style="background:#5597e7"></i>Accent Color</div></div>' : '<div class="sg-custom">' + rad('Use Custom Colors', false, 'color') + '<div class="sg-sw"><i style="background:#1a5fb4"></i>Main Color</div><div class="sg-sw"><i style="background:#1a5fb4"></i>Button Color</div></div>') + '</div>';
  }
  function tile(bg, svg, h, p) { return '<div class="ro-new-item"><span class="ro-new-item__icon" style="background:' + bg + '">' + svg + '</span><div><h5>' + h + '</h5><p>' + p + '</p></div></div>'; }
  function sec(h, sub, body) { return '<div class="sg-sec' + (h === 'General' ? ' sg-sec--general' : '') + '"><h4 class="sg-h">' + h + '</h4>' + (sub ? '<p class="sg-sub">' + sub + '</p>' : '') + (body || '') + '</div>'; }
  function lab(l, body) { return '<div class="sg-sec"><p class="sg-label">' + l + '</p>' + body + '</div>'; }
  function drop() { return '<div class="sg-drop"><a class="ro-link" href="#"><img src="' + B + 'icon-cloud-upload-sm.svg" alt="">Upload</a><span class="sg-drop__div"></span><a class="ro-link" href="#"><img src="' + B + 'icon-paste.svg" alt="">Paste</a></div>'; }
  function sel(v) { return '<div class="rmx-field__box sg-select" data-rmx-component="Input Field"><span>' + v + '</span>' + ic('keyboard-arrow-down') + '</div>'; }
  var themes = ['residential-1', 'residential-2', 'commercial-1', 'commercial-2', 'manufactured-housing-1', 'manufactured-housing-2', 'associations-1', 'associations-2'];
  function tbl(cols, rows) { return '<table class="sg-tbl"><thead><tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; }
  function preview(inner) { return '<div class="sg-prev"><div class="sg-prev__bar"></div>' + inner + '</div>'; }
  var chargesPrev = preview('<div class="sg-prev__banner">Charges &amp; Payments</div><div class="sg-prev__cols"><div class="sg-prev__card"><b>Balance Due</b><span class="sg-donut"><i>Remaining</i></span><small>Rent Charge · Utilities · Other Charges</small><a class="ro-link" href="#">Manage Payment Methods</a></div><div class="sg-prev__card sg-prev__card--wide"><div class="sg-tabs"><span class="is-on">Open Charges</span><span>All Activity</span></div>' + tbl(['Date', 'Type', 'Details', 'Reference Number', 'Charge Amount', 'Balance'], [['10/01/2026', 'Rent', 'October Rent', '', '$1,250.00', '$1,250.00'], ['10/01/2026', 'Utilities', 'Water/Sewer', '', '$45.00', '$45.00']]) + '</div></div>');
  var policyPrev = preview('<div class="sg-prev__cols"><div class="sg-prev__card"><b>My Current Balance</b><small>as of xx/xx</small><b>My Total Balance</b><small>Including future charges</small><b>Other Amount</b><span class="sg-select sg-select--sm">$</span></div><div class="sg-prev__card sg-prev__card--wide">' + tbl(['Date', 'Type', 'Details', 'Charge Amount', 'Pay Amount'], [['10/01/2026', 'RC', 'October Rent', '$1,250.00', '$1,250.00'], ['11/01/2026', 'RC', 'November Rent', '$1,250.00', '$0.00']]) + '</div></div>');
  var issuesPrev = '<img class="sg-shot" src="../assets/rollout/stepper/preview-service-issues.png" alt="Service Issues page preview">';

  var STEPS = [
    { n: "What’s new", t: "What’s new", h:
      '<p class="sg-lead">Welcome to rmResident Portal! This is a quick look at what changed and what you can set up, in your own time.</p><div class="ro-new-list">' +
      tile('#f9d57b', '<img class="ro-tile-img" src="../assets/rollout/tour-checklist.svg" alt="">', 'Multiple Profiles', 'Create a unique portal experience for each property type in your portfolio.') +
      tile('#dbe1e5', '<img class="ro-tile-img" src="../assets/rollout/tour-event.svg" alt="">', 'Modern New Look', 'rmResident Portal features a refreshed, modern UI for a better experience for your residents from day one.') +
      tile('#afcef4', ic('visibility'), 'Portal Preview', 'See exactly what your residents will see before a single change goes live.') +
      tile('#c9e5c3', '<img class="ro-tile-img" src="../assets/rollout/tour-setting.svg" alt="">', 'Access Control', 'New privileges keep portal management separate from your system settings, so you can confidently give your team the access they need.') + '</div>' },
    { n: 'Portal Login', t: 'Portal Login', h:
      '<p class="sg-lead">Choose what prospects and tenants see when they sign in.</p>' +
      sec('Logo', 'Replace the rmResident Portal logo with your own to create a more personalized login experience.', '<div class="sg-attach sg-attach--plain">' + drop() + '</div>') +
      sec('Colors', 'Select colors to match your brand.', '<div class="sg-box"><div class="sg-colors sg-colors--login">' + colors.map(function (c) { return '<div class="sg-color">' + rad(c[0], false, 'lcolor') + '<img src="' + L + 'color-' + c[1] + '.png" alt=""></div>'; }).join('') + '</div>' +
        '<div class="sg-custom">' + rad('Use Custom Colors', true, 'lcolor') + '<div class="sg-sw"><i style="background:#86b4ea"></i>Main Color</div><div class="sg-sw"><i style="background:#1a5fb4"></i>Button Color</div></div></div>') +
      sec('Login Page Message', 'Display a custom message under your logo to welcome users or communicate important information.', rte(150, 'Welcome to Riverview Apartments Tenant Portal! Log in to gain access to online payments, maintenance requests, and more.', true)) +
      sec('Property Settings', '', '<p class="sg-label">Disable rmResident Portal for Selected Properties</p><div class="rmx-field__box sg-select sg-select--full">' + ic('keyboard-arrow-down') + '</div>') +
      sec('Signup Settings', '', chk('Allow tenants to sign up for new accounts from the portal') + '<p class="sg-sub sg-sub--ind">Account # is always required to verify a new account. Select more fields for extra security.</p><div class="sg-stack sg-stack--signup">' +
        '<div class="sg-inline">' + chk('Phone Number', false) + '</div><div class="sg-inline">' + chk('Social Security #', false) + chk('Only use last four digits', false, true) + '</div><div class="sg-inline">' + chk('Birth Date', false) + '</div>' +
        [1, 2, 3].map(function () { return '<div class="sg-inline sg-inline--udf">' + chk('User Defined Field', false) + '<div class="rmx-field__box sg-select sg-select--full is-dis">' + ic('keyboard-arrow-down') + '</div></div>'; }).join('') + '</div>') },
    { n: 'Portal Branding', t: 'Portal Branding', h:
      sec('Colors', 'Select colors to match your brand.', colorGrid(true)) +
      sec('Themes', 'Choose a theme to customize the look of your portal.', '<div class="sg-box sg-box--themes"><div class="sg-themes">' + themes.map(function (n, i) { return '<div class="sg-theme">' + rad(n.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }), false, 'theme') + '<img src="' + B + 'theme-' + n + '.jpg" alt=""></div>'; }).join('') + '</div>' +
        '<div class="sg-sep"></div>' + rad('Use Custom Theme Image', true, 'theme') + '<div class="sg-ind"><p class="sg-hint sg-hint--mut">Recommended size: 1920x1080px</p>' +
        '<div class="sg-drop sg-drop--up"><img class="sg-up" src="' + B + 'icon-cloud-upload.svg" alt=""><a class="ro-link" href="#">Click to Upload</a><span>or drop them here</span></div></div></div>') +
      sec('Logo', 'Replace our default logo with your own to create a more personalized experience.', '<div class="sg-box sg-box--themes">' + rad('Use Custom Logo', true, 'logo') + '<div class="sg-ind"><p class="sg-hint sg-hint--mut">Recommended size: 300x100px</p>' +
        '<div class="sg-attach"><img class="sg-logo" src="' + B + 'logo-summit.png" alt="Summit Property Management"><a class="sg-file" href="#">img_4321.jpg <img src="' + B + 'icon-close.svg" alt=""></a>' + drop() + '</div></div>' +
        rad('Use Property UDF', false, 'logo') + '<div class="sg-ind">' + sel('Logo') + '</div></div>') },
    { n: 'Portal Settings', t: 'Portal Settings', h:
      sec('Dashboard Announcement', 'Display an announcement on top of the dashboard to all users.', '<div class="sg-box sg-box--tight"><div class="ro-togglerow"><button type="button" class="ro-toggle" data-checked="true" aria-label="Show Announcement Message"><span>' + ic('check') + '</span></button>Show Announcement Message</div>' +
        '<div class="sg-sec"><p class="sg-label sg-label--link"><span>Tenant Announcement Message</span><a class="ro-link" href="#">Open Script Builder</a></p>' + rte(150, 'Welcome to your new home at [Property.Name]! We’re so excited to have you as part of our community. Please don’t hesitate to reach out if you have any questions.', false, true) + '</div>' +
        '<div class="sg-sec"><p class="sg-label sg-label--link"><span>Prospect Announcement Message</span><a class="ro-link" href="#">Open Script Builder</a></p>' + rte(150, 'Welcome to [Property.Name]!! We’re so excited about your interest. Please complete all actions in order to ensure quick processing of your application.', false, true) + '</div></div>') +
      sec('Site Settings', '', '<div class="sg-box sg-box--tight">' + chk('Use Management Company Name as Property Name') + '<div class="sg-inline">' + chk('Allow Tenants to Purchase Insurance') + '<span class="sg-info">' + ic('info') + '</span></div>' +
        '<div class="sg-inline sg-inline--days0"><span>Past tenants remain active for</span><span class="rmx-field__box sg-num"><input value="60"></span><span>days after move out.</span><span class="sg-info">' + ic('info') + '</span></div>' +
        sec('rmResident User Settings', '', '<div class="sg-box sg-box--tight"><p class="sg-label">How do you want to refer to rmResident Portal users?</p><div class="sg-stack sg-stack--tight">' + rad('Tenant', true, 'ref') + rad('Tenant Entity Name', false, 'ref') + rad('Customize', false, 'ref') + '</div><div class="sg-ind"><span class="rmx-field__box sg-fullbox is-dis"><input></span></div></div>') +
        sec('Email Settings', '', '<div class="sg-box sg-box--tight">' + chk('Allow Tenants to Email Property Manager') + '<div class="sg-ind"><p class="sg-label">Select History / Note Category for Emails</p><div class="rmx-field__box sg-select sg-select--full"><span></span>' + ic('keyboard-arrow-down') + '</div></div>' +
          '<p class="sg-label">Email Signature</p><div class="sg-stack sg-stack--tight">' + rad('Use Property Contact Info', true, 'sig') + rad('Override Property Contact Info', false, 'sig') + '</div>' +
          '<div class="sg-ind">' + field('Name', '', 'sg-field--dis') + field('Email', '', 'sg-field--dis') + '</div></div>') +
        sec('Time Zone', '', '<div class="sg-box sg-box--tight"><p class="sg-label">Time Zone</p><div class="rmx-field__box sg-select sg-select--full sg-select--l"><span>(UTC -5:00 Eastern Time)</span>' + ic('keyboard-arrow-down') + '</div>' + chk('Observe Daylight Savings Time') + '</div>') + '</div>') },
    { n: 'Charges and Payments', t: 'Charges and Payments', h:
      '<div><div class="sg-row">' + field('Menu Title *', 'Charges &amp; Payments') + field('Page Title *', 'Charges &amp; Payments') + '</div>' +
      '<a class="ro-link sg-restore" href="#">' + ic('autorenew') + 'Restore Default</a></div>' +
      lab('Banner Message', rte(167)) + chk('Show all transaction activity') +
      '<img class="sg-shot sg-shot--wide" src="../assets/rollout/stepper/preview-charges.png" alt="Charges &amp; Payments page preview">' +
      sec('Autopay Settings', '', '<div class="sg-box sg-box--tight"><div class="ro-togglerow"><button type="button" class="ro-toggle" data-checked="true" aria-label="Allow tenants to enroll in Autopay"><span>' + ic('check') + '</span></button>Allow tenants to enroll in Autopay</div>' +
        '<h4 class="sg-h sg-h--pad">Payment Frequencies</h4><p class="sg-sub">Select payment frequencies that users can choose from.</p>' +
        '<div class="sg-box sg-box--tight"><div class="sg-inline">' + chk('Weekly', false) + '<span class="sg-info">' + ic('info') + '</span></div>' + chk('Monthly') +
        '<div class="sg-indent sg-inline sg-inline--days"><span>Days that tenant can select</span>' + sel('Any Day') + '</div>' + chk('Quarterly', false) + chk('Semi-annually', false) + chk('Annually', false) + '</div></div>') },
    { n: 'Make a Payment', t: 'Make a Payment', h:
      '<div class="ro-togglerow"><button type="button" class="ro-toggle" data-checked="true" aria-label="Allow tenants to Make a Payment"><span>' + ic('check') + '</span></button>Allow tenants to Make a Payment</div>' +
      lab('Banner Message', rte(167)) + '<div class="sg-stack">' + chk('Exclude from prospects') + chk('Allow tenants to enroll in flexible rent') + '</div>' +
      sec('Payment Disclaimers', '', '<div class="sg-box sg-box--tight">' + chk('Require tenant to acknowledge a disclaimer') + '<div class="rmx-field__box sg-textarea"></div></div>') },
    { n: 'Payment Policy', t: 'Payment Policy', h:
      sec('General', '', '<div class="sg-row sg-row--assign">' + field('Payment Policy Name *', 'Riverview Policies') + '<div class="sg-assign">' + field('Assign to Property', 'Riverview Apartments') + '<button type="button" class="rmx-btn rmx-btn--primary">Select Properties</button></div></div>' + field('Description', '', 'sg-field--full') + chk('Active')) +
      sec('Payment Policy Settings', 'These settings determine which payment options are available to your residents in the portal. Changes are reflected live in the preview on the right.',
        '<div class="sg-stack sg-stack--policy">' + chk('Pay less than current balance') + chk('Pay future charges early') + chk('Overpay available charges') +
        '<div class="sg-indent"><div class="sg-inline">' + rad('Apply to oldest charges first', false, 'over') + '<span class="sg-info">' + ic('info') + '</span></div>' + rad('Preallocate to specific charge type', true, 'over') +
        '<div class="sg-indent">' + sel('RC') + chk('Override with first charge type in property allocation order when one exists') + '</div></div>' + chk('Choose what charges they want to pay') + '</div>' +
        '<img class="sg-shot sg-shot--wide" src="../assets/rollout/stepper/preview-policy.png" alt="Payment options preview">') +
      sec('Shared Billing Options', '', chk('Display account group charges for each tenant and automatically apply payments to the entire group.', false)) },
    { n: 'Service Issues', t: 'Service Issues', h:
      '<div class="sg-sec sg-sec--q"><p class="sg-q">What do you want to call service issues in the portal?</p><div class="sg-stack sg-stack--tight">' +
      rad('Service Issues', true, 'si') + rad('Maintenance Requests', false, 'si') + rad('Work Orders', false, 'si') + rad('Other', false, 'si') + '</div></div>' +
      lab('Banner Message', rte(167) + '<p class="sg-count">0/255</p>') +
      '<div class="sg-sec sg-sec--q"><p class="sg-q">What service issues do you want to display?</p><div class="sg-stack sg-stack--tight">' +
      rad('All issues', true, 'sd') + rad('Issues created by tenant', false, 'sd') + rad('Issues with the selected categories', false, 'sd') + '</div>' + sel('Select categories') + '</div>' +
      chk('Display issues for all tenants in the account group', false) +
      '<div class="sg-sec sg-sec--comm"><h4 class="sg-h sg-h--info">Service Issue Communication<span class="sg-info">' + ic('info') + '</span></h4><p class="sg-sub">Share notes, comments, and updates with tenants on open service issues.</p>' +
        '<div class="ro-togglerow sg-toggle"><button type="button" class="ro-toggle" data-checked="true" aria-label="Enable Communication"><span>' + ic('check') + '</span></button>Enable Communication</div>' +
        '<div class="sg-box sg-box--tight sg-box--comm"><div class="sg-inline sg-inline--wide">' + rad('One-Way', true, 'comm') + rad('Two-Way', false, 'comm') + chk('Share History/Notes', false) + '</div>' +
        '<div class="sg-indent sg-indent--comm"><p class="sg-hint">Send comments to tenants in rmResident. Tenants cannot respond.</p>' + chk('Notify tenant via email') + '</div></div></div>' +
      issuesPrev },
    { n: 'Review & Activate', t: 'Review & Activate', h:
      '<p class="sg-lead">You just reviewed some of the pages and settings available to you with the rmResident Portal.</p>' +
      '<p class="sg-lead">These pages are also enabled and were not changed in this setup guide. They will display when you activate, and you can review their settings anytime in Portal Profiles.</p>' +
      '<ul class="sg-list"><li>Document Center</li><li>Applications</li><li>Notes</li></ul>' +
      '<p class="sg-lead">Choose <b>Activate</b> to make the new portal live for all residents, or <b>Save &amp; Don’t Activate</b> to keep your changes and activate later from Administration.</p>' }
  ];

  var cur = 0, wrap;
  function nav() {
    return STEPS.map(function (s, i) {
      var st = i < cur ? 'done' : i === cur ? 'cur' : 'todo';
      var dot = st === 'done' ? ic('check') : st === 'cur' ? ic('edit') : (i + 1);
      return '<li class="sg-step sg-step--' + st + '"><button type="button" data-go="' + i + '"><span class="sg-dot">' + dot + '</span>' + s.n.replace('&', '&amp;') + '</button></li>';
    }).join('');
  }
  function render() {
    var s = STEPS[cur], last = cur === STEPS.length - 1;
    wrap.querySelector('.sg-nav').innerHTML = nav();
    wrap.querySelector('.sg-main').innerHTML = '<h3 class="sg-title">' + s.t.replace('&', '&amp;') + '</h3><div class="sg-content">' + s.h + '</div>' +
      '<div class="sg-foot">' + (cur ? '<button type="button" class="rmx-btn rmx-btn--secondary" data-back>Back</button>' : '<span></span>') +
      (last ? '<span class="sg-foot__r"><button type="button" class="rmx-btn rmx-btn--primary" data-save>Save &amp; Don’t Activate</button><button type="button" class="rmx-btn ro-btn--green" data-activate>Activate</button></span>'
            : '<button type="button" class="rmx-btn rmx-btn--primary" data-next>Next</button>') + '</div>';
    wrap.querySelector(".sg-content").scrollTop = 0;
  }
  function leave(activated) {
    var st = window.RO.get(); if (activated) { st.converted = true; st.activated = true; } else { st.guidedSaved = true; } window.RO.save(st);
    location.href = activated ? 'admin-activated.html' : 'admin-get-started.html';
  }
  document.addEventListener('DOMContentLoaded', function () {
    wrap = document.querySelector('.sg');
    if (!wrap) return;
    var q = /[?&]step=(\d)/.exec(location.search); if (q) cur = Math.min(STEPS.length - 1, Math.max(0, +q[1] - 1));
    wrap.innerHTML = '<div class="ro-scrim"></div><div class="sg-dialog" role="dialog" aria-label="Setup guide"><div class="sg-top"><a href="admin-get-started.html" aria-label="Close">' + ic('close') + '</a></div>' +
      '<div class="sg-body"><aside class="sg-side"><h2>Setup guide</h2><ol class="sg-nav"></ol></aside><section class="sg-main"></section></div></div>';
    render();
    wrap.addEventListener('click', function (e) {
      var t = e.target;
      var g = t.closest('[data-go]'); if (g) { cur = +g.dataset.go; return render(); }
      if (t.closest('[data-next]')) { cur++; return render(); }
      if (t.closest('[data-back]')) { cur--; return render(); }
      if (t.closest('[data-save]')) return leave(false);
      if (t.closest('[data-activate]')) return leave(true);
      var c = t.closest('.sg-check'); if (c) return c.setAttribute('aria-checked', String(c.getAttribute('aria-checked') !== 'true'));
      var r = t.closest('.sg-radio'); if (r) { [].forEach.call(wrap.querySelectorAll('.sg-radio[data-name="' + r.dataset.name + '"]'), function (x) { x.setAttribute('aria-checked', String(x === r)); }); return; }
      var tg = t.closest('.ro-toggle'); if (tg) tg.dataset.checked = String(tg.dataset.checked !== 'true');
      if (t.closest('a[href="#"]')) e.preventDefault();
    });
  });
})();
