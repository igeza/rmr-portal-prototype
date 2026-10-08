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
  /* Crisp vector stand-ins for the Figma preview screenshots (no raster, so they stay sharp on retina) */
  var PV_DEFS = '<defs><linearGradient id="pvbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf1fb"/><stop offset="1" stop-color="#dde8f6"/></linearGradient><linearGradient id="pvbn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b5f98"/><stop offset="1" stop-color="#456aa3"/></linearGradient></defs>';
  var F = ' font-family="Roboto,sans-serif"';
  function pvT(x, y, s, txt, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + s + '" fill="' + (fill || '#6b7a8c') + '"' + F + (extra || '') + '>' + txt + '</text>'; }
  function pvChrome(title) {
    return '<rect width="496" height="242" rx="3" fill="url(#pvbg)"/><path d="M300 242 L360 205 L496 235 V242Z M0 190 Q120 175 250 242 H0Z" fill="#fff" opacity=".35"/>' +
      '<rect x="2" y="2" width="492" height="10.5" rx="1.5" fill="#fff"/><rect x="4" y="4" width="5" height="6.4" rx="1" fill="#2f6bb8"/><text x="11" y="9.4" font-size="4.6" fill="#13314c"' + F + '>rm<tspan fill="#7a90ad">Resident</tspan></text>' +
      '<circle cx="410" cy="7.2" r="2.6" fill="#2f6bb8"/><circle cx="419" cy="7.2" r="2.2" fill="#2f6bb8"/><line x1="426" y1="3.5" x2="426" y2="10.9" stroke="#cfd8e3" stroke-width=".6"/><circle cx="433" cy="7.2" r="2.8" fill="#5b3b2e"/><rect x="439" y="4.6" width="46" height="5.2" rx="2.6" fill="#e9eef4"/><path d="M488 6.4 l1.6 1.8 l1.6-1.8z" fill="#7a90ad"/>' +
      '<rect x="8" y="20" width="480" height="17" rx="2" fill="url(#pvbn)"/>' + pvT(14, 30.6, 6.4, title, '#fff', ' font-weight="500" letter-spacing=".2"');
  }
  function bars(x, y, widths, n, gap, h) { var s = ''; for (var r = 0; r < n; r++) { var cx = x; widths.forEach(function (w) { s += '<rect x="' + cx + '" y="' + (y + r * gap) + '" width="' + (w - 3) + '" height="' + h + '" rx="1.6" fill="#eef2f7"/>'; cx += w; }); } return s; }
  var issuesPrev = '<svg class="sg-pv" viewBox="0 0 496 242" role="img" aria-label="Service Issues page preview" xmlns="http://www.w3.org/2000/svg">' + PV_DEFS + pvChrome('Service Issues') +
    '<rect x="67" y="41" width="361" height="10.5" rx="1.5" fill="#fff"/><rect x="67" y="41" width="1.6" height="10.5" fill="#4a90e2"/><circle cx="74" cy="46.2" r="2.1" fill="none" stroke="#4a90e2" stroke-width=".7"/><rect x="80" y="44" width="340" height="4.4" rx="2.2" fill="#eef2f7"/>' +
    '<rect x="68" y="56" width="360" height="178" rx="2" fill="#fff"/>' + pvT(74.5, 66.6, 3.5, 'Date Range') + '<rect x="74.5" y="70" width="24" height="6.4" rx="1.4" fill="#eef2f7"/><rect x="101" y="70" width="24" height="6.4" rx="1.4" fill="#eef2f7"/><rect x="127.5" y="71.2" width="4" height="4" rx=".6" fill="none" stroke="#13314c" stroke-width=".7"/>' +
    '<rect x="378" y="65" width="43" height="9.2" rx="1.6" fill="#2f5fb8"/>' + pvT(383, 71.1, 3.4, '+ Add Service Issue', '#fff') +
    pvT(76, 91, 3.6, 'Open Issues', '#13314c') + pvT(107, 91, 3.6, 'Closed Issues') + '<line x1="74" y1="94" x2="428" y2="94" stroke="#e1e8f0" stroke-width=".6"/><line x1="74" y1="94" x2="102" y2="94" stroke="#2f6bb8" stroke-width="1"/>' +
    pvT(76, 102, 3.2, '#') + pvT(106, 102, 3.2, 'Created') + pvT(166, 102, 3.2, 'Issue') + pvT(396, 102, 3.2, 'Status') + '<line x1="74" y1="104" x2="424" y2="104" stroke="#e1e8f0" stroke-width=".6"/>' +
    bars(74.5, 108, [32, 60, 232, 30], 5, 11, 6.6) + pvT(424, 226, 3, 'Showing 2 of 2 Open Issues', '#6b7a8c', ' text-anchor="end"') + '</svg>';
  var chargesPrev = '<svg class="sg-pv" viewBox="0 0 496 242" role="img" aria-label="Charges &amp; Payments page preview" xmlns="http://www.w3.org/2000/svg">' + PV_DEFS + pvChrome('Charges &amp; Payments') +
    '<rect x="8" y="41" width="480" height="10.5" rx="1.5" fill="#fff"/><rect x="8" y="41" width="1.6" height="10.5" fill="#4a90e2"/><rect x="20" y="44" width="460" height="4.4" rx="2.2" fill="#eef2f7"/>' +
    '<rect x="8" y="56" width="119" height="104" rx="2" fill="#fff"/>' + pvT(14, 66, 4.2, 'Balance Due', '#13314c', ' font-weight="500"') + '<rect x="92" y="62" width="28" height="5" rx="1.6" fill="#eef2f7"/>' +
    '<circle cx="46" cy="104" r="24" fill="none" stroke="#143a70" stroke-width="7"/><circle cx="46" cy="104" r="24" fill="none" stroke="#4a90e2" stroke-width="7" stroke-dasharray="34 117" stroke-dashoffset="-70"/><circle cx="46" cy="104" r="24" fill="none" stroke="#a9c8ef" stroke-width="7" stroke-dasharray="18 133" stroke-dashoffset="-104"/>' + pvT(46, 103, 3.8, 'Remaining', '#13314c', ' text-anchor="middle" font-weight="500"') + '<rect x="38" y="106" width="16" height="5" rx="1.6" fill="#eef2f7"/>' +
    [['#143a70', 'Rent Charge', 90], ['#4a90e2', 'Utilities', 106], ['#a9c8ef', 'Other Charges', 122]].map(function (l) { return '<circle cx="84" cy="' + l[2] + '" r="1.6" fill="' + l[0] + '"/>' + pvT(88, l[2] + 1.3, 3.2, l[1], '#13314c') + '<rect x="88" y="' + (l[2] + 4) + '" width="24" height="4" rx="1.4" fill="#eef2f7"/>'; }).join('') +
    '<rect x="14" y="138" width="107" height="8" rx="1.6" fill="#1e63b5"/><rect x="40" y="150" width="55" height="4" rx="2" fill="#2a76c4"/>' +
    '<rect x="8" y="165" width="119" height="22" rx="2" fill="#fff"/><rect x="8" y="165" width="1.6" height="22" fill="#4a90e2"/><rect x="18" y="170" width="38" height="3.6" rx="1.4" fill="#eef2f7"/><rect x="18" y="176" width="50" height="3.6" rx="1.4" fill="#eef2f7"/><rect x="93" y="172" width="26" height="8" rx="1.8" fill="none" stroke="#2f6bb8" stroke-width=".7"/>' +
    '<rect x="133" y="56" width="355" height="176" rx="2" fill="#fff"/><rect x="138" y="62" width="30" height="8" rx="1.4" fill="#fff" stroke="#cfd8e3" stroke-width=".6"/>' + pvT(153, 67.3, 3.3, 'Open Charges', '#13314c', ' text-anchor="middle"') + pvT(176, 67.3, 3.3, 'All Activity') +
    pvT(152, 86, 3.2, 'Date') + pvT(178, 86, 3.2, 'Type') + pvT(228, 86, 3.2, 'Details') + pvT(285, 86, 3.2, 'Reference Number') + pvT(413, 86, 3.2, 'Charge Amount') + pvT(458, 86, 3.2, 'Balance') + '<line x1="138" y1="89" x2="482" y2="89" stroke="#e1e8f0" stroke-width=".6"/>' +
    [0, 1, 2, 3, 4].map(function (r) { var c = ['#143a70', '#143a70', '#2f6bb8', '#143a70', '#a9c8ef'][r], y = 93 + r * 11; return '<circle cx="142" cy="' + (y + 3.3) + '" r="1.8" fill="' + c + '"/><line x1="138" y1="' + (y + 9) + '" x2="482" y2="' + (y + 9) + '" stroke="#eef2f7" stroke-width=".6"/>'; }).join('') +
    bars(149, 93, [26, 50, 55, 122, 40, 40], 5, 11, 6.6) + pvT(480, 226, 3, '5 Total Charges', '#6b7a8c', ' text-anchor="end"') + '</svg>';
  var policyPrev = '<svg class="sg-pv sg-pv--policy" viewBox="0 0 460 216" role="img" aria-label="Payment options preview" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="216" rx="4" fill="#f1f3f5" stroke="#d3dbe4"/><rect x="10" y="10" width="440" height="196" rx="3" fill="#fff"/>' +
    [['My Current Balance', 'as of xx/xx', 0], ['My Total Balance', 'Including future charges', 1], ['Other Amount', '', 2]].map(function (c) { var x = 18 + c[2] * 141, sel = c[2] === 2; return '<rect x="' + x + '" y="20" width="133" height="68" rx="4" fill="' + (sel ? '#f4f8fd' : '#fff') + '" stroke="' + (sel ? '#5b9bde' : '#d3dbe4') + '"/><circle cx="' + (x + 14) + '" cy="56" r="5" fill="' + (sel ? '#fff' : '#f1f3f5') + '" stroke="' + (sel ? '#1e63b5' : '#c5cdd8') + '" stroke-width="1.4"/>' + (sel ? '<circle cx="' + (x + 14) + '" cy="56" r="2.4" fill="#1e63b5"/>' : '') + pvT(x + 28, 40, 8.2, c[0], '#13314c') + (c[1] ? pvT(x + 28, 49, 5, c[1], '#4b5b6d') + '<rect x="' + (x + 28) + '" y="55" width="96" height="21" rx="3" fill="#eef2f7"/>' : '<rect x="' + (x + 28) + '" y="45" width="40" height="7" rx="3" fill="#eef2f7"/>' + pvT(x + 28, 68, 8, '$', '#13314c', ' font-weight="600"') + '<rect x="' + (x + 38) + '" y="58" width="86" height="16" rx="3" fill="#fff" stroke="#d3dbe4"/>'); }).join('') +
    pvT(48, 108, 7.6, 'Date', '#4b5b6d') + pvT(94, 108, 7.6, 'Type', '#4b5b6d') + pvT(190, 108, 7.6, 'Details', '#4b5b6d') + pvT(288, 108, 7.6, 'Charge Amount', '#4b5b6d') + pvT(364, 108, 7.6, 'Pay Amount', '#4b5b6d') + '<line x1="18" y1="113" x2="442" y2="113" stroke="#d3dbe4"/>' +
    [0, 1, 2].map(function (r) { var y = 118 + r * 25; return '<rect x="20" y="' + (y + 4) + '" width="11" height="11" rx="2" fill="#1e63b5"/><path d="M22.6 ' + (y + 9.6) + ' l2.6 2.6 l4.2-4.8" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="40" y="' + (y + 4) + '" width="38" height="12" rx="3" fill="#eef2f7"/><rect x="86" y="' + (y + 4) + '" width="96" height="12" rx="3" fill="#eef2f7"/><rect x="190" y="' + (y + 4) + '" width="86" height="12" rx="3" fill="#eef2f7"/><rect x="284" y="' + (y + 4) + '" width="58" height="12" rx="3" fill="#eef2f7"/><rect x="358" y="' + (y + 1) + '" width="76" height="18" rx="4" fill="#fff" stroke="#d3dbe4"/><line x1="18" y1="' + (y + 24) + '" x2="442" y2="' + (y + 24) + '" stroke="#e1e8f0"/>'; }).join('') + '</svg>';

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
      '<div class="sg-pvbox">' + chargesPrev + '</div>' +
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
        policyPrev) +
      sec('Shared Billing Options', '', chk('Display account group charges for each tenant and automatically apply payments to the entire group.', false)) },
    { n: 'Service Issues', t: 'Service Issues', h:
      '<div class="sg-sec sg-sec--q"><p class="sg-q">What do you want to call service issues in the portal?</p><div class="sg-stack sg-stack--tight">' +
      rad('Service Issues', true, 'si') + rad('Maintenance Requests', false, 'si') + rad('Work Orders', false, 'si') + rad('Other', false, 'si') + '</div></div>' +
      lab('Banner Message', rte(167) + '<p class="sg-count">0/255</p>') +
      '<div class="sg-sec sg-sec--q"><p class="sg-q">What service issues do you want to display?</p><div class="sg-stack sg-stack--tight">' +
      rad('All issues', true, 'sd') + rad('Issues created by tenant', false, 'sd') + rad('Issues with the selected categories', false, 'sd') + '</div>' + sel('Select categories') + '</div>' +
      chk('Display issues for all tenants in the account group', false) +
      '<div class="sg-pvbox">' + issuesPrev + '</div>' +
      '<div class="sg-sec sg-sec--comm"><h4 class="sg-h sg-h--info">Service Issue Communication<span class="sg-info">' + ic('info') + '</span></h4><p class="sg-sub">Share notes, comments, and updates with tenants on open service issues.</p>' +
        '<div class="ro-togglerow sg-toggle"><button type="button" class="ro-toggle" data-checked="true" aria-label="Enable Communication"><span>' + ic('check') + '</span></button>Enable Communication</div>' +
        '<div class="sg-box sg-box--tight sg-box--comm"><div class="sg-inline sg-inline--wide">' + rad('One-Way', true, 'comm') + rad('Two-Way', false, 'comm') + chk('Share History/Notes', false) + '</div>' +
        '<div class="sg-indent sg-indent--comm"><p class="sg-hint">Send comments to tenants in rmResident. Tenants cannot respond.</p>' + chk('Notify tenant via email') + '</div></div></div>' +
      '' },
    { n: 'Review & Activate', t: 'Review & Activate', h:
      '<p class="sg-lead">Additional pages are also enabled and were not changed in this setup guide. They will display when you activate, and you can review their settings anytime in Portal Profiles:</p>' +
      '<ul class="sg-list"><li>Document Center</li><li>Applications</li><li>Notes</li></ul>' +
      '<p class="sg-lead">Explore Portal Profiles for more pages and features that can make your and your residents’ experience even better.</p>' +
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
      (last ? '<span class="sg-foot__r"><button type="button" class="rmx-btn rmx-btn--primary" data-save>Save &amp; Don’t Activate</button><button type="button" class="rmx-btn rmx-btn--primary" data-activate>Activate</button></span>'
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
