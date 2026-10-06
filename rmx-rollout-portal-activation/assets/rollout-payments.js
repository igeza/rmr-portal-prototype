/* Payment Policies — the register and the Payment Policy Details overlay.
   Opened from Administration. The details overlay itself lives in payments-overlay.js. State lives in rollout-state.js
   (window.RO); policies are kept on the same state object. Prototype scaffolding. */
(function () {
  'use strict';
  var RO = window.RO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var q = new URLSearchParams(location.search);
  var ICON = function (n) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + n + '"></use></svg>'; };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var today = function () { var d = new Date(); return ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear(); };

  var store = PP.store, today = PP.today;

  var showInactive = false, pendingId = null;

  /* ---------- register ---------- */
  function pill(p) {
    if (p.props.length < 2) return esc(p.props[0] || '');
    return esc(p.props[0]) + ' <span class="ro-pill" data-pp-proplist="' + p.id + '" tabindex="0">+' + (p.props.length - 1) + ICON('arrow-drop-down') + '</span>';
  }
  function render() {
    var s = store(), all = Object.keys(s.policies).map(function (k) { return s.policies[k]; });
    var term = ($('#pf-search input').value || '').toLowerCase();
    var rows = all.filter(function (p) { return (showInactive || p.active) && (!term || p.name.toLowerCase().indexOf(term) > -1); });
    $('#pf-body').innerHTML = rows.map(function (p) {
      return '<tr data-id="' + p.id + '" tabindex="0">' +
        '<td class="ro-c">' + (p.active ? '<svg class="rmx-icon ro-ok"><use href="../assets/icons.svg#check-circle-filled"></use></svg>' : '') + '</td>' +
        '<td>' + esc(p.name) + '</td><td>' + esc(p.desc) + '</td>' +
        '<td class="ro-c">' + (p.isDefault ? '<svg class="rmx-icon ro-ok"><use href="../assets/icons.svg#check-circle-filled"></use></svg>' : '') + '</td>' +
        '<td>' + pill(p) + '</td><td>' + esc(p.by) + '</td><td>' + esc(p.on) + '</td>' +
        '<td class="ro-c"><button class="ro-kebab" data-pp-kebab="' + p.id + '" aria-label="Actions">' + ICON('more-vert') + '</button></td></tr>';
    }).join('');
    $('#pf-count').textContent = rows.length + ' of ' + all.length + ' Policies';
  }

  function openPolicy(id) { PP.open(id, { onPublish: function () { render(); if (window.RMX && RMX.toast) RMX.toast('Payment policy published', 'success'); } }); }
  function openOv(id) { var e = document.getElementById(id); if (e) e.hidden = false; }
  function closeOv(el) { var o = el.closest('.ro-ov'); if (o) o.hidden = true; }


  document.addEventListener('click', function (e) {
    var rc = e.target.closest('[data-ro-close]'); if (rc) { e.preventDefault(); closeOv(rc); return; }
    /* floating menus */
    var pl = e.target.closest('[data-pp-proplist]');
    $$('.ro-pop').forEach(function (p) { p.remove(); });
    if (pl) {
      e.stopPropagation();
      var list = store().policies[pl.dataset.ppProplist].props.slice(1);
      var pop = document.createElement('div'); pop.className = 'ro-pop';
      pop.innerHTML = list.map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('');
      document.body.appendChild(pop);
      var r = pl.getBoundingClientRect(); pop.style.left = r.left + 'px'; pop.style.top = (r.bottom + 4) + 'px';
      return;
    }
    var k = e.target.closest('[data-pp-kebab]');
    if (k) {
      e.stopPropagation();
      var p = store().policies[k.dataset.ppKebab], items = [];
      if (p.active && !p.isDefault) { items.push(['Make Default', 'default']); items.push(['Make Inactive', 'inactive']); }
      if (!p.active) items.push(['Make Active', 'active']);
      if (!items.length) items.push(['No actions available', null]);
      var m = document.createElement('div'); m.className = 'ro-pop ro-pop--menu';
      m.innerHTML = items.map(function (i) { return '<button' + (i[1] ? ' data-pp-act="' + i[1] + '" data-id="' + p.id + '"' : ' disabled') + '>' + i[0] + '</button>'; }).join('');
      document.body.appendChild(m);
      var rr = k.getBoundingClientRect(); m.style.left = (rr.right - 160) + 'px'; m.style.top = (rr.bottom + 4) + 'px';
      return;
    }
    var a = e.target.closest('[data-pp-act]');
    if (a) {
      pendingId = a.dataset.id;
      var s = store(), pp = s.policies[pendingId], act = a.dataset.ppAct;
      if (act === 'default') { $('#df-name').textContent = pp.name; $('#df-name2').textContent = pp.name; openOv('ov-default'); }
      if (act === 'inactive') openOv('ov-inactive');
      if (act === 'active') { pp.active = true; pp.by = 'igeza'; pp.on = today(); s.touched = true; RO.save(s); render(); }
      return;
    }
    var tr = e.target.closest('#pf-body tr[data-id]');
    if (tr) openPolicy(tr.dataset.id);
  });
  $('#pf-body').addEventListener('keydown', function (e) { if (e.key !== 'Enter') return; var tr = e.target.closest('tr[data-id]'); if (tr) openPolicy(tr.dataset.id); });

  $('#pf-search input').addEventListener('input', render);
  $('#pp-inactive').addEventListener('click', function () { var el = $('#pp-inactive'); el.dataset.checked = String(el.dataset.checked !== 'true'); showInactive = el.dataset.checked === 'true'; render(); });
  $('#pp-add').addEventListener('click', function () { openPolicy(null); });

  $('#df-ok').addEventListener('click', function () {
    var s = store();
    Object.keys(s.policies).forEach(function (k) { s.policies[k].isDefault = (k === pendingId); });
    s.touched = true; RO.save(s); closeOv($('#df-ok')); render();
  });
  $('#in-ok').addEventListener('click', function () {
    var s = store(), p = s.policies[pendingId];
    p.active = false; p.by = 'igeza'; p.on = today();
    s.touched = true; RO.save(s); closeOv($('#in-ok')); render();
  });

  render();
})();
