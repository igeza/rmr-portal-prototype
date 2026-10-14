/* Portal branding + page choices made in the Review Settings stepper (window.PB).
   They are saved in the rollout state (brand, pages) and shown in the Default profile: the Branding
   tab's pickers and the Portal Preview. Prototype only. */
(function () {
  'use strict';
  var B = '../assets/rollout/branding/';
  var COLORS = { 'ocean-blue': '#1b64bb', 'forest-green': '#2e7d32', 'sunset-orange': '#e8710a', 'royal-purple': '#6a3fb5', 'crimson-red': '#c62828', 'charcoal-gray': '#455a64' };
  var CUSTOM = '#1a5fb4';
  var PAGE_LABEL = { 'Reservations': 'Amenity Reservations' };
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function slug(t) { t = String(t).trim().toLowerCase().replace(/\s+/g, '-'); return t.indexOf('use-custom') === 0 ? 'custom' : t === 'use-property-udf' ? 'udf' : t; }
  function hue(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  }
  function brand() { return window.RO.get().brand || {}; }
  function pages() { return window.RO.get().pages || {}; }
  function saveBrand(k, v) { var s = window.RO.get(); s.brand = s.brand || {}; s.brand[k] = v; window.RO.save(s); }
  function savePage(l, on) { var s = window.RO.get(); s.pages = s.pages || {}; s.pages[l] = on; window.RO.save(s); }

  /* Portal Preview overlay: colour, theme, logo and which pages are on */
  function preview() {
    var root = document.getElementById('ov-preview'); if (!root) return;
    var b = brand(), pg = pages();
    /* Ocean Blue and the custom colours are the preview's own Figma colours, so nothing is overridden for them */
    var c = b.color && b.color !== 'custom' && b.color !== 'ocean-blue' ? COLORS[b.color] : null;
    var st = document.getElementById('rp-brand');
    if (!st) { st = document.createElement('style'); st.id = 'rp-brand'; document.head.appendChild(st); }
    st.textContent = c ? '.rp-nav-item.is-active .rp-nav-label,.rp-link,.rp-btn-secondary{color:' + c + '}' +
      '.rp-nav-item.is-active .rp-nav-pill{background:color-mix(in srgb,' + c + ' 15%,#fff)}' +
      '.rp-banner{background:color-mix(in srgb,' + c + ' 50%,#0b2447)}.rp-hero-tint{background:color-mix(in srgb,color-mix(in srgb,' + c + ' 75%,#0b2447) 85%,transparent)}' +
      '.rp [fill="#1B64BB"]{fill:' + c + '}.rp [stroke="#1B64BB"]{stroke:' + c + '}' +
      '.rp{background:color-mix(in srgb,' + c + ' 4%,#fff)}.rp-bgart{filter:hue-rotate(' + Math.round(hue(c) - 197) + 'deg)}' +
      '.rp-card-updates{border-color:' + c + '}.rp-blue{background:color-mix(in srgb,' + c + ' 35%,#fff)}' +
      '.rp-btn-secondary{border-color:' + c + '}.rp-btn-primary{background:' + c + '}' : '';
    var heroes = $$('.rp-hero-img', root);
    heroes.forEach(function (im, i) {
      if (!im.dataset.orig) im.dataset.orig = im.getAttribute('src');
      var t = b.theme && b.theme !== 'custom';
      im.setAttribute('src', t && i === 0 ? B + 'theme-' + b.theme + '.jpg' : im.dataset.orig);
      im.style.display = t && i > 0 ? 'none' : '';
    });
    var logo = root.querySelector('.rp-logo');
    if (logo) { if (!logo.dataset.orig) logo.dataset.orig = logo.getAttribute('src'); logo.setAttribute('src', b.logo === 'udf' ? '../assets/rollout/login/logo.png' : logo.dataset.orig); }
    $$('.rp-nav-item', root).forEach(function (a) {
      var l = a.textContent.trim(); l = PAGE_LABEL[l] || l;
      a.style.display = pg[l] === false ? 'none' : '';
    });
    $$('.rp-btn-secondary', root).forEach(function (x) { x.style.display = pg['Make a Payment'] === false ? 'none' : ''; });
  }

  /* Default profile > Branding tab: the pickers show what the stepper chose */
  function form() {
    var b = brand(); if (!b.color && !b.theme && !b.logo) return;
    $$('[data-ro-brand="default"] .ro-branding').forEach(function (root) {
      $$('.ro-h', root).forEach(function (h) {
        var key = { Colors: 'color', Themes: 'theme', Logo: 'logo' }[h.textContent.trim()], box = h.nextElementSibling && h.nextElementSibling.nextElementSibling;
        if (!key || !b[key] || !box || !box.classList.contains('ro-box')) return;
        $$('.ro-radio', box).forEach(function (r) { r.dataset.checked = String(slug(r.textContent) === b[key]); });
      });
    });
  }

  window.PB = { slug: slug, brand: brand, pages: pages, saveBrand: saveBrand, savePage: savePage, preview: preview, form: form };
  document.addEventListener('DOMContentLoaded', function () {
    var p = new URLSearchParams(location.search);
    if (document.body.dataset.roPage && (p.get('new') === '1' || (p.get('p') && p.get('p') !== 'default'))) return;
    form(); preview();
  });
})();
