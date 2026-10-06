/* Portal Profiles — the register and the Profile Details pages.
   Behaviour only; every visual is in rollout.css and the screens' markup.
   State lives in rollout-state.js (window.RO). Prototype scaffolding. */
(function () {
  'use strict';
  var RO = window.RO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var q = new URLSearchParams(location.search);
  var page = document.body.dataset.roPage;
  var ICON = function (n) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + n + '"></use></svg>'; };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  /* ---------- shared helpers ---------- */
  function others(s, id) { return Object.keys(s.profiles).map(function (k) { return s.profiles[k]; }).filter(function (p) { return p.id !== id; }); }
  function ownerOf(s, id, type) {
    var o = others(s, id).filter(function (p) { return p.active && p.types.indexOf(type) > -1; });
    return o.length ? o[0] : null;
  }
  function statusOf(p) { return p.active ? p.status : 'inactive'; }
  var LABELS = { unsaved: ['rmx-lozenge--error', 'Unsaved Changes'], unpublished: ['rmx-lozenge--caution', 'Unpublished Changes'],
                 ready: ['rmx-lozenge--success', 'Ready to Publish'], published: ['rmx-lozenge--success', 'Published'], inactive: ['ro-lozenge--disabled', 'Inactive'] };
  function lozenge(st) { var l = LABELS[st] || LABELS.unpublished; return '<span class="rmx-lozenge ' + l[0] + '">' + l[1] + '</span>'; }
  function today() { var d = new Date(); return ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear(); }
  function setIn(el, html) { el.innerHTML = html; }
  function openOv(id) { var e = document.getElementById(id); if (e) e.hidden = false; }
  function closeOv(el) { var o = el.closest ? el.closest('.ro-ov') : el; if (o) o.hidden = true; }
  function typePill(types, id) {
    var n = types.length;
    var first = types.length ? types[0] : 'No Property Type Assigned';
    if (n < 2) return esc(first);
    return esc(first) + ' <span class="ro-pill" data-ro-typelist="' + id + '" tabindex="0">+' + (n - 1) + ICON('arrow-drop-down') + '</span>';
  }

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-ro-open]');
    if (o) { e.preventDefault(); openOv(o.dataset.roOpen); return; }
    var c = e.target.closest('[data-ro-close]');
    if (c) { e.preventDefault(); closeOv(c); return; }
    /* floating menus */
    var pill = e.target.closest('[data-ro-typelist]');
    $$('.ro-pop').forEach(function (p) { p.remove(); });
    if (pill) {
      e.stopPropagation();
      var s = RO.get(), pr = s.profiles[pill.dataset.roTypelist] || (window.ROWORK || {});
      var list = (pill.dataset.roTypelist === 'work' ? window.ROWORK : pr).types.slice(1);
      var pop = document.createElement('div'); pop.className = 'ro-pop';
      pop.innerHTML = list.map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('');
      document.body.appendChild(pop);
      var r = pill.getBoundingClientRect(); pop.style.left = r.left + 'px'; pop.style.top = (r.bottom + 4) + 'px';
      return;
    }
    var k = e.target.closest('[data-ro-kebab]');
    if (k) {
      e.stopPropagation();
      var st = RO.get(), p = st.profiles[k.dataset.roKebab];
      var items = [];
      if (p.active && !p.isDefault) items.push(['Make Default', 'default']);
      if (p.active && !p.isDefault) items.push(['Make Inactive', 'inactive']);
      if (!p.active) items.push(['Make Active', 'active']);
      if (!items.length) items.push(['No actions available', null]);
      var m = document.createElement('div'); m.className = 'ro-pop ro-pop--menu';
      m.innerHTML = items.map(function (i) { return '<button' + (i[1] ? ' data-ro-act-reg="' + i[1] + '" data-id="' + p.id + '"' : ' disabled') + '>' + i[0] + '</button>'; }).join('');
      document.body.appendChild(m);
      var rr = k.getBoundingClientRect(); m.style.left = (rr.right - 160) + 'px'; m.style.top = (rr.bottom + 4) + 'px';
      return;
    }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('.ro-toggle');
    if (t) { var on = t.dataset.checked !== 'true'; t.dataset.checked = String(on); t.setAttribute('aria-checked', String(on)); }
    var sg = e.target.closest('[data-ro-seg]');
    if (sg) { $$('[data-ro-seg]', sg.parentNode).forEach(function (b) { b.classList.toggle('on', b === sg); }); }
  });

  /* clicking a colour or theme image selects its radio */
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.ro-opt');
    if (!opt || e.target.closest('.rmx-radio')) return;
    var r = opt.querySelector('.rmx-radio');
    if (r) r.click();
  });

  /* "Use Custom Colors" shows the three colour squares while it is selected */
  function syncSwatches() {
    $$('.ro-custom').forEach(function (c) {
      var r = c.querySelector('.rmx-radio'), sw = c.querySelector('[data-ro-reveal]');
      if (r && sw) sw.hidden = r.dataset.checked !== 'true';
    });
  }
  document.addEventListener('click', function () { setTimeout(syncSwatches, 0); });
  syncSwatches();

  /* ================= REGISTER ================= */
  if (page === 'register') {
    var pendingId = null;
    var render = function () {
      var s = RO.get();
      var term = ($('#pf-search input').value || '').toLowerCase();
      var rows = Object.keys(s.profiles).map(function (k) { return s.profiles[k]; })
        .filter(function (p) { return !term || p.name.toLowerCase().indexOf(term) > -1; });
      $('#pf-body').innerHTML = rows.map(function (p) {
        return '<tr data-href="profile-branding.html?p=' + p.id + '" tabindex="0">' +
          '<td class="ro-c">' + (p.active ? '<svg class="rmx-icon ro-ok"><use href="../assets/icons.svg#check-circle-filled"></use></svg>' : '') + '</td>' +
          '<td>' + esc(p.name) + '</td>' +
          '<td>' + esc(p.desc) + '</td>' +
          '<td class="ro-c">' + (p.isDefault ? '<svg class="rmx-icon ro-ok"><use href="../assets/icons.svg#check-circle-filled"></use></svg>' : '') + '</td>' +
          '<td>' + typePill(p.types, p.id) + '</td>' +
          '<td>' + lozenge(statusOf(p)) + '</td>' +
          '<td>' + esc(p.by) + '</td><td>' + esc(p.on) + '</td>' +
          '<td class="ro-c"><button class="ro-kebab" data-ro-kebab="' + p.id + '" aria-label="Actions">' + ICON('more-vert') + '</button></td></tr>';
      }).join('');
      $('#pf-count').textContent = rows.length + ' of ' + Object.keys(s.profiles).length + ' Customizations';
    };
    render();
    $('#pf-search input').addEventListener('input', render);
    $('#pf-body').addEventListener('click', function (e) {
      if (e.target.closest('[data-ro-kebab], [data-ro-typelist]')) return;
      var tr = e.target.closest('tr[data-href]'); if (tr) location.href = tr.dataset.href;
    });
    $('#pf-body').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var tr = e.target.closest('tr[data-href]'); if (tr) location.href = tr.dataset.href;
    });

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ro-act-reg]');
      if (!b) return;
      $$('.ro-pop').forEach(function (p) { p.remove(); });
      pendingId = b.dataset.id;
      var s = RO.get(), p = s.profiles[pendingId], act = b.dataset.roActReg;
      if (act === 'default') { $('#df-name').textContent = p.name; openOv('ov-default'); }
      if (act === 'inactive') openOv('ov-inactive');
      if (act === 'active') {
        var cf = conflictsFor(s, p);
        if (!cf.length) { activate(s, p, []); }
        else { $('#wr-list').innerHTML = cf.map(function (c) { return '<li><strong>' + esc(c.type) + '</strong> (' + esc(c.owner) + ')</li>'; }).join(''); openOv('ov-warn-react'); window._cf = cf; }
      }
    });
    function conflictsFor(s, p) {
      var out = [];
      p.types.forEach(function (t) { var o = ownerOf(s, p.id, t); if (o) out.push({ type: t, owner: o.name }); });
      return out;
    }
    function activate(s, p, steal) {
      p.active = true; p.status = 'unpublished'; p.by = 'igeza'; p.on = today();
      steal.forEach(function (t) { others(s, p.id).forEach(function (o) { o.types = o.types.filter(function (x) { return x !== t; }); }); });
      s.touched = true; RO.save(s); render();
    }
    $('#df-ok').addEventListener('click', function () {
      var s = RO.get();
      Object.keys(s.profiles).forEach(function (k) { s.profiles[k].isDefault = (k === pendingId); });
      s.touched = true; RO.save(s); closeOv($('#df-ok')); render();
    });
    $('#in-ok').addEventListener('click', function () {
      var s = RO.get(), p = s.profiles[pendingId];
      p.active = false; p.status = 'inactive'; p.by = 'igeza'; p.on = today();
      s.touched = true; RO.save(s); closeOv($('#in-ok')); render();
    });
    $('#wr-reassign').addEventListener('click', function () {
      var s = RO.get(), p = s.profiles[pendingId];
      activate(s, p, window._cf.map(function (c) { return c.type; })); closeOv($('#wr-reassign'));
    });
    $('#wr-keep').addEventListener('click', function () {
      var s = RO.get(), p = s.profiles[pendingId];
      p.types = p.types.filter(function (t) { return !window._cf.some(function (c) { return c.type === t; }); });
      activate(s, p, []); closeOv($('#wr-keep'));
    });
  }

  /* ================= PROFILE DETAILS ================= */
  if (page === 'details') {
    var s0 = RO.get();
    /* the customization tour opens the first time Profile Details is entered; the context bar button reopens it */
    var dFile = location.pathname.split('/').pop();
    var tourStore = RO.get();
    var rememberReturn = function () { try { sessionStorage.setItem('roPtourReturn', location.pathname.split('/').pop() + location.search); } catch (e) {} };
    if ((dFile === 'profile-branding.html' || dFile === 'profile-settings.html') && !tourStore.tourSeen) {
      tourStore.tourSeen = true; RO.save(tourStore); rememberReturn(); location.replace('ptour-welcome.html'); return;
    }
    if (dFile.indexOf('ptour-') === 0 && !tourStore.tourSeen) { tourStore.tourSeen = true; RO.save(tourStore); }
    document.addEventListener('click', function (e) { if (e.target.closest('[data-ro-ptour]')) rememberReturn(); }, true);
    var isNew = q.get('new') === '1';
    var id = isNew ? 'new' : (q.get('p') || 'default');
    var from = q.get('from');
    var work = isNew
      ? { id: 'new', name: 'Default Copy', desc: '', active: true, isDefault: false, status: 'unpublished', by: '', on: '', types: [] }
      : JSON.parse(JSON.stringify(s0.profiles[id] || s0.profiles['default']));
    if (isNew) { document.body.dataset.roInline = '1'; var h = document.querySelector('.ro-contextbar__title, .rmx-contextbar__title'); if (h) h.textContent = 'rmResident Portal Customization Details'; }
    /* Default and new profiles show the default branding choices; Residential has its own */
    var brand = (isNew || id === 'default') ? 'default' : 'custom';
    $$('[data-ro-brand]').forEach(function (n) { n.hidden = n.dataset.roBrand !== brand; });
    window.ROWORK = work;
    work._steal = [];
    var dirty = isNew;
    var back = from === 'checklist' ? 'checklist-whats-new.html' : 'profiles-register.html';

    var typeText = function (t) { return t.length ? (t.length === RO.TYPES.length ? 'All Property Types, ' : '') + t.join(', ') : 'No Property Type Assigned'; };
    var paint = function () {
      document.body.classList.toggle('ro-readonly', !work.active && !isNew);
      if (isNew) {
        var ni = $('#pd-name-in'); if (document.activeElement !== ni) ni.value = work.name;
        var di = $('#pd-desc-in'); if (document.activeElement !== di) di.value = work.desc;
        $('#pd-types-in').textContent = typeText(work.types);
        $('#pd-active-in').dataset.checked = String(work.active);
      }
      $('#pd-name').textContent = work.name;
      $('#pd-desc').textContent = work.desc || '';
      setIn($('#pd-types'), typePill(work.types, 'work'));
      var st = dirty ? 'unsaved' : statusOf(work);
      setIn($('#pd-status'), lozenge(st));
      $$('[data-ro-status]').forEach(function (n) { setIn(n, lozenge(st)); });
      $$('[data-ro-act="publish"]').forEach(function (b) { b.textContent = dirty ? 'Save & Publish' : 'Publish'; });
    };
    paint();
    $$('[data-ro-keep]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href') + (location.search || '')); });

    var touch = function () { dirty = true; paint(); };
    if (isNew) {
      $('#pd-name-in').addEventListener('input', function () { work.name = this.value; touch(); });
      $('#pd-desc-in').addEventListener('input', function () { work.desc = this.value; touch(); });
      $('#pd-active-in').addEventListener('click', function () { setTimeout(function () { work.active = $('#pd-active-in').dataset.checked === 'true'; touch(); }, 0); });
      $('#pd-select').addEventListener('click', function () { pend = { name: work.name, desc: work.desc, types: work.types.slice(), active: work.active, steal: work._steal.slice() }; sel = pend.types.slice(); original = pend.types.slice(); $('#as-search input').value = ''; renderAssign(); inlineAssign = true; openOv('ov-assign'); });
    }
    document.addEventListener('input', function (e) { if (e.target.closest('.ro-settings')) touch(); });
    document.addEventListener('rmx:change', function (e) { if (e.target.closest('.ro-settings')) touch(); });
    document.addEventListener('click', function (e) {
      if (e.target.closest('.ro-settings .rmx-radio, .ro-settings .ro-toggle, .ro-colors .rmx-radio, .ro-themes .rmx-radio, .ro-logo .rmx-radio')) touch();
    });

    /* ----- Edit Profile ----- */
    var pend = null, inlineAssign = false;
    var fillEdit = function () {
      $('#ed-name').value = pend.name; $('#ed-desc').value = pend.desc;
      $('#ed-types').textContent = pend.types.join(', ');
      var act = $('#ed-active'); act.dataset.checked = String(pend.active);
      if (work.isDefault) act.setAttribute('data-static', ''); else act.removeAttribute('data-static');
    };
    $('#pd-edit').addEventListener('click', function () {
      pend = { name: work.name, desc: work.desc, types: work.types.slice(), active: work.active, steal: work._steal.slice() };
      fillEdit(); openOv('ov-edit');
    });
    $('#ed-name').addEventListener('input', function () { pend.name = this.value; });
    $('#ed-desc').addEventListener('input', function () { pend.desc = this.value; });
    $('#ed-active').addEventListener('click', function () { setTimeout(function () { pend.active = $('#ed-active').dataset.checked === 'true'; }, 0); });

    var applyEdit = function () {
      work.name = pend.name || work.name; work.desc = pend.desc; work.types = pend.types; work.active = pend.active; work._steal = pend.steal;
      if (!work.active) work.status = 'inactive'; else if (work.status === 'inactive') work.status = 'unpublished';
      closeOv($('#ed-save')); touch();
    };
    $('#ed-save').addEventListener('click', function () {
      var s = RO.get();
      if (pend.active && !work.active) {
        var cf = [];
        pend.types.forEach(function (t) { var o = ownerOf(s, work.id, t); if (o && pend.steal.indexOf(t) < 0) cf.push({ type: t, owner: o.name }); });
        if (cf.length) {
          window._cf = cf;
          $('#wr-list').innerHTML = cf.map(function (c) { return '<li><strong>' + esc(c.type) + '</strong> (' + esc(c.owner) + ')</li>'; }).join('');
          openOv('ov-warn-react'); return;
        }
      }
      applyEdit();
    });
    $('#wr-reassign').addEventListener('click', function () {
      window._cf.forEach(function (c) { if (pend.steal.indexOf(c.type) < 0) pend.steal.push(c.type); });
      closeOv($('#wr-reassign')); applyEdit();
    });
    $('#wr-keep').addEventListener('click', function () {
      pend.types = pend.types.filter(function (t) { return !window._cf.some(function (c) { return c.type === t; }); });
      closeOv($('#wr-keep')); applyEdit();
    });

    /* ----- Assign to Property Type ----- */
    var sel = [];
    var original = [];
    var renderAssign = function () {
      var s = RO.get();
      var term = ($('#as-search input').value || '').toLowerCase();
      $('#as-list').innerHTML = RO.TYPES.filter(function (t) { return !term || t.toLowerCase().indexOf(term) > -1; }).map(function (t) {
        var o = ownerOf(s, work.id, t);
        var on = sel.indexOf(t) > -1;
        return '<label class="rmx-check" data-static data-checked="' + on + '" data-type="' + esc(t) + '"><span class="rmx-check__box">' + ICON('check') + '</span><span class="ro-as__t">' + esc(t) + (o ? '*' : '') + (o ? '<small>' + esc(o.name) + '</small>' : '') + '</span></label>';
      }).join('');
      $('#as-all').dataset.checked = String(sel.length === RO.TYPES.length);
      $('#as-count').textContent = sel.length;
      $('#as-sel').innerHTML = sel.map(function (t) { return '<span class="ro-chip">' + esc(t) + '<button data-ro-unsel="' + esc(t) + '" aria-label="Remove">' + ICON('close') + '</button></span>'; }).join('');
    };
    $('#ed-select').addEventListener('click', function () { sel = pend.types.slice(); original = pend.types.slice(); $('#as-search input').value = ''; renderAssign(); openOv('ov-assign'); });
    $('#as-search input').addEventListener('input', renderAssign);
    $('#as-list').addEventListener('click', function (e) {
      var l = e.target.closest('[data-type]'); if (!l) return;
      var t = l.dataset.type, i = sel.indexOf(t);
      if (i > -1) sel.splice(i, 1); else sel.push(t);
      renderAssign();
    });
    $('#as-all').addEventListener('click', function () { sel = (sel.length === RO.TYPES.length) ? [] : RO.TYPES.slice(); renderAssign(); });
    $('#as-clear').addEventListener('click', function (e) { e.preventDefault(); sel = []; renderAssign(); });
    $('#as-sel').addEventListener('click', function (e) { var b = e.target.closest('[data-ro-unsel]'); if (!b) return; sel.splice(sel.indexOf(b.dataset.roUnsel), 1); renderAssign(); });
    var assignCommit = function (steal) {
      pend.types = RO.TYPES.filter(function (t) { return sel.indexOf(t) > -1; });
      steal.forEach(function (t) { if (pend.steal.indexOf(t) < 0) pend.steal.push(t); });
      $('#ed-types').textContent = pend.types.join(', ');
      if (inlineAssign) { work.types = pend.types; work._steal = pend.steal; inlineAssign = false; touch(); }
      closeOv($('#as-ok'));
    };
    $('#as-ok').addEventListener('click', function () {
      var s = RO.get(), cf = [];
      sel.forEach(function (t) { var o = ownerOf(s, work.id, t); if (o && original.indexOf(t) < 0) cf.push({ type: t, owner: o.name }); });
      if (!cf.length) { assignCommit([]); return; }
      window._acf = cf;
      $('#wa-list').innerHTML = cf.map(function (c) { return '<li><strong>' + esc(c.type) + '</strong> (' + esc(c.owner) + ')</li>'; }).join('');
      openOv('ov-warn-assign');
    });
    $('#wa-ok').addEventListener('click', function () { closeOv($('#wa-ok')); assignCommit(window._acf.map(function (c) { return c.type; })); });

    /* ----- footer actions ----- */
    var commit = function (status) {
      var s = RO.get();
      if (isNew && work.id === 'new') { work.id = 'p' + Date.now(); s.profiles[work.id] = { id: work.id, name: work.name, desc: work.desc, active: work.active, isDefault: false, status: status, by: '', on: '', types: work.types.slice() }; isNew = false; }
      var p = s.profiles[work.id];
      p.name = work.name; p.desc = work.desc; p.types = work.types; p.active = work.active;
      p.status = work.active ? status : 'inactive'; p.by = 'igeza'; p.on = today();
      work._steal.forEach(function (t) { others(s, p.id).forEach(function (o) { if (p.active) o.types = o.types.filter(function (x) { return x !== t; }); }); });
      work._steal = [];
      s.touched = true; RO.save(s);
      work.status = p.status; dirty = false; paint();
    };
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-ro-act]');
      if (!a) return;
      e.preventDefault();
      var act = a.dataset.roAct;
      if (act === 'save') { commit('unpublished'); $$('.ro-ov').forEach(function (o) { if (o.id === 'ov-preview') o.hidden = true; }); }
      if (act === 'publish') {
        commit('ready');
        $$('.ro-ov').forEach(function (o) { o.hidden = true; });
        if (!work.isDefault) openOv('ov-ready');
      }
      if (act === 'cancel') location.href = back;
    });
    $('#rd-ok').addEventListener('click', function () { closeOv($('#rd-ok')); });
  }
})();
