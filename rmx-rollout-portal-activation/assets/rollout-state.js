/* Rollout prototype state — what has been marked Ready, and the portal profiles.
   Kept in sessionStorage so the walkthrough survives page loads but starts fresh
   in a new tab. Opening index.html or the dashboard resets it. Prototype only. */
(function () {
  'use strict';
  var KEY = 'roState';
  var TYPES = ['No Property Type Assigned', 'Apartment', 'Association', 'Commercial', 'Duplex',
               'Manufactured Housing', 'RV/Campground', 'Short Term Rental', 'Single Family'];

  function fresh() {
    return {
      touched: false,
      profiles: {
        'default': { id: 'default', name: 'Default', desc: 'Standard portal for all or unassigned property types',
          active: true, isDefault: true, status: 'unpublished', by: '', on: '',
          types: ['No Property Type Assigned', 'Apartment', 'Commercial', 'Duplex', 'Manufactured Housing', 'RV/Campground', 'Short Term Rental', 'Single Family'] }
      },
      ready: {}
    };
  }
  function get() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.profiles) return s; } catch (e) {}
    return fresh();
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }

  /* ---- readiness ---- */
  function isReady(s, key) {
    if (key.indexOf('prof:') === 0) {
      var p = s.profiles[key.slice(5)];
      return !!p && p.status === 'ready';
    }
    return !!s.ready[key];
  }

  var GROUPS = { prof: ['prof:default'], pay: ['pay:default'], login: ['login:default'] };
  function pctFromState(s) {
    var ids = Object.keys(GROUPS), done = 0;
    ids.forEach(function (g) { if (GROUPS[g].every(function (k) { return isReady(s, k); })) done++; });
    return Math.round(100 * done / ids.length);
  }

  /* ---- checklist hydration: only once the user has acted; otherwise the page
     shows the state exactly as designed in Figma ---- */
  function summary(s) {
    var groups = {}, total = 0, done = 0;
    document.querySelectorAll('.ro-row[data-key]:not([data-optional])').forEach(function (row) {
      var g = row.closest('details.ro-sub');
      var id = g ? g.dataset.group : 'x';
      groups[id] = groups[id] === undefined ? true : groups[id];
      if (!isReady(s, row.dataset.key)) groups[id] = false;
    });
    Object.keys(groups).forEach(function (id) { total++; if (groups[id]) done++; });
    return { groups: groups, total: total, done: done, pct: total ? Math.round(100 * done / total) : 0 };
  }

  function typesLabel(p) {
    var t = p.types || [];
    return t.length ? t[0] : 'No Property Type Assigned';
  }

  function setRing(el, pct) {
    var ring = el.querySelector('.ro-ring');
    if (ring) ring.style.setProperty('--pct', pct);
    var txt = el.querySelector('span');
    if (txt) txt.textContent = pct + '%';
  }

  function hydrate() {
    var s = get();
    var checklist = document.querySelector('[data-ro-checklist]');
    if (checklist && s.touched) {
      checklist.querySelectorAll('.ro-row[data-key]').forEach(function (row) {
        var key = row.dataset.key;
        row.dataset.ready = String(isReady(s, key));
        if (key.indexOf('prof:') === 0) {
          var p = s.profiles[key.slice(5)];
          var small = row.querySelector('small');
          if (p && small) {
            var extra = (p.types.length > 1) ? '<span class="rmx-pill">+' + (p.types.length - 1) + '<svg class="rmx-icon"><use href="../assets/icons.svg#arrow-drop-down"></use></svg></span>' : '';
            small.innerHTML = typesLabel(p) + extra;
          }
        }
      });
      var sum = summary(s);
      checklist.querySelectorAll('details.ro-sub').forEach(function (g) {
        var ok = sum.groups[g.dataset.group];
        var lz = g.querySelector('summary .rmx-lozenge');
        if (lz) {
          lz.className = 'rmx-lozenge ' + (ok ? 'rmx-lozenge--success' : 'rmx-lozenge--caution');
          lz.textContent = ok ? 'Ready' : 'Not Ready';
        }
      });
      setRing(checklist.querySelector('.ro-review-head .ro-ringwrap'), sum.pct);
      var fill = checklist.querySelector('.ro-bar__fill');
      if (fill) { fill.style.setProperty('--pct', sum.pct); checklist.querySelector('.ro-bar__pct').textContent = sum.pct + '%'; }
      var banner = checklist.querySelector('[data-ro-golive]');
      if (banner) banner.hidden = sum.pct < 100;
      var close = checklist.querySelector('[data-ro-close-link]');
      if (close) close.setAttribute('href', sum.pct >= 100 ? 'admin-ready-to-activate.html' : 'admin-conversion-started.html');
    }
    /* the setup banner on the Administration page, and behind the overlay */
    var br = document.querySelector('.ro-banner--progress .ro-ringwrap');
    if (br && s.touched) {
      var pct = pctFromState(s);
      setRing(br, pct);
      if (pct >= 100 && document.body.hasAttribute('data-ro-banner')) location.replace('admin-ready-to-activate.html');
    }
  }

  /* checklist rows: the whole row is the control. A row with a mock opens it;
     the rows without one yet (payments, login) toggle Ready on click. */
  function rowActivate(row) {
    if (row.dataset.pl && window.PL) { window.PL.open({ onPublish: hydrate }); return; }
    if (row.dataset.pp && window.PP) { window.PP.open(row.dataset.pp, { onPublish: hydrate }); return; }
    if (row.dataset.href) { location.href = row.dataset.href; return; }
    if (!row.dataset.toggleKey) return;
    var s = get(), k = row.dataset.toggleKey;
    s.ready[k] = !s.ready[k]; s.touched = true; save(s); hydrate();
  }
  document.addEventListener('click', function (e) {
    var r = e.target.closest('.ro-row[data-href], .ro-row[data-toggle-key], .ro-row[data-pp], .ro-row[data-pl]');
    if (r) rowActivate(r);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var r = e.target.closest && e.target.closest('.ro-row[data-href], .ro-row[data-toggle-key], .ro-row[data-pp], .ro-row[data-pl]');
    if (r) { e.preventDefault(); rowActivate(r); }
  });

  /* Once conversion has started the Administration page remembers it: opening
     the portal section again lands on the matching state (setup, ready, activated). */
  (function () {
    var file = location.pathname.split('/').pop();
    var st = get();
    if (file === 'admin-activated.html' && !/[?&]reset=1/.test(location.search)) { st.converted = true; st.activated = true; save(st); }
    if ((file === 'admin-get-started.html' || file === 'admin-menu.html') && !/[?&]reset=1/.test(location.search)) {
      var q = file === 'admin-menu.html' ? '?top=1' : '';
      if (st.activated) location.replace('admin-activated.html' + q);
      else if (st.converted) location.replace((pctFromState(st) >= 100 ? 'admin-ready-to-activate.html' : 'admin-conversion-started.html') + q);
    }
    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-ro-convert], [data-ro-activate]');
      if (!c) return;
      var s2 = get();
      s2.converted = true; if (c.hasAttribute('data-ro-activate')) s2.activated = true;
      save(s2);
    }, true);
  })();


  /* "What's new?" and "Notify your residents": once collapsed (or opened) they stay that way every time the checklist opens. */
  function persistCards() {
    var cards = [].slice.call(document.querySelectorAll('[data-ro-checklist] details.ro-card, details.ro-card'))
      .filter(function (d) { return d.querySelector(':scope > summary') && !d.classList.contains('ro-loc'); });
    var keyOf = function (d) { return d.querySelector(':scope > summary').firstChild.textContent.trim().replace(/[^\w]+/g, '-').toLowerCase(); };
    var s = get(); s.cards = s.cards || {};
    cards.forEach(function (d) { var k = keyOf(d); if (k in s.cards) d.open = !!s.cards[k]; });
    cards.forEach(function (d) {
      d.addEventListener('toggle', function () { var st = get(); st.cards = st.cards || {}; st.cards[keyOf(d)] = d.open; save(st); });
    });
  }

  window.RO = { get: get, save: save, reset: reset, fresh: fresh, TYPES: TYPES, hydrate: hydrate, typesLabel: typesLabel, summary: summary, isReady: isReady };

  document.addEventListener('DOMContentLoaded', function () {
    if (/[?&]reset=1/.test(location.search)) reset();
    hydrate();
    persistCards();
  });
})();
