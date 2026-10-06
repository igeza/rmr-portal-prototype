/* Payment Policy Details overlay — shared by the Payment Policies register and the
   setup checklist. window.PP.open(id, { onPublish }) injects the overlay into the
   current page on first use. Policies are kept on the RO state (window.RO).
   Prototype scaffolding. */
(function () {
  'use strict';
  var RO = window.RO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ICON = function (n) { return '<svg class="rmx-icon"><use href="../assets/icons.svg#' + n + '"></use></svg>'; };
  var today = function () { var d = new Date(); return ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear(); };
  var HTML = "<div class=\"ro-ov ro-ov--top\" id=\"ov-policy\" hidden><div class=\"ro-scrim\"></div><div class=\"ro-dialog pp-dialog\" role=\"dialog\" aria-label=\"Payment Policy Details\">\n  <div class=\"rmx-overlay__header\"><span>Payment Policy Details</span><a href=\"#\" data-pp-close aria-label=\"Close\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#close\"></use></svg></a></div>\n  <div class=\"pp-body\">\n    <section class=\"pp-tile\"><h3>General</h3>\n      <div class=\"pp-tile__b\"><div class=\"pp-general\">\n        <label class=\"pp-lbl pp-lbl--name\">Payment Policy Name *<span class=\"rmx-field__box\"><input id=\"pp-name\" type=\"text\"></span></label>\n        <label class=\"pp-lbl pp-lbl--desc\">Description<span class=\"rmx-field__box\"><input id=\"pp-desc\" type=\"text\"></span></label>\n        <div class=\"pp-assign\"><div class=\"pp-lbl\">Assign to Property<span class=\"rmx-field__box\"><span id=\"pp-props\" class=\"ro-clip\"></span></span></div><button class=\"rmx-btn rmx-btn--primary\" id=\"pp-select\" data-rmx-todo=\"Select Properties\" data-rmx-component=\"Button\">Select Properties</button></div>\n        <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-active\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Active</span></label>\n      </div></div>\n    </section>\n    <section class=\"pp-tile\"><h3>Payment Policy Settings</h3>\n      <div class=\"pp-tile__b\">\n        <p class=\"pp-intro\">These settings determine which payment options are available to your residents in the portal. Changes are reflected live in the preview on the right.</p>\n        <div class=\"pp-settings\">\n          <div class=\"pp-opts\">\n            <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-less\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Pay less than current balance</span></label>\n            <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-future\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Pay future charges early</span></label>\n            <div class=\"pp-over\">\n              <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-over\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Overpay available charges</span></label>\n              <div class=\"pp-radios\" id=\"pp-oversub\">\n                <div class=\"pp-radiorow\"><div class=\"rmx-radio pp-radio\" data-static data-checked=\"false\" id=\"pp-oldest\"><span class=\"rmx-radio__dot\"></span><span>Apply to oldest charges first</span></div><span class=\"pp-info\" aria-label=\"More info\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#info\"></use></svg></span></div>\n                <div class=\"pp-spec\">\n                  <div class=\"rmx-radio pp-radio\" data-static data-checked=\"false\" id=\"pp-specific\"><span class=\"rmx-radio__dot\"></span><span>Preallocate to specific charge type</span></div>\n                  <div class=\"pp-spec__sub\">\n                    <div class=\"pp-dd\" data-rmx-dropdown id=\"pp-dd\"><button class=\"rmx-field__box\" data-rmx-trigger type=\"button\"><span data-rmx-value class=\"pp-dd__v\">Select Charge Type</span><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#keyboard-arrow-down\"></use></svg></button><div class=\"rmx-menu\" data-rmx-menu hidden><button data-value=\"RC\">RC</button><button data-value=\"PET\">PET</button><button data-value=\"PRK\">PRK</button><button data-value=\"LATE\">LATE</button></div></div>\n                    <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-override\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Override with first charge type in property allocation order when one exists</span></label>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-choose\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Choose what charges they want to pay</span></label>\n          </div>\n          <div class=\"pp-preview\" aria-label=\"Portal payment preview\"><div class=\"pp-pv\" id=\"pp-pv\"></div></div>\n        </div>\n      </div>\n    </section>\n    <section class=\"pp-tile\"><h3>Shared Billing Options</h3>\n      <div class=\"pp-tile__b pp-shared\"><label class=\"rmx-check\" data-static data-checked=\"false\" id=\"pp-shared\"><span class=\"rmx-check__box\"><svg class=\"rmx-icon\"><use href=\"../assets/icons.svg#check\"></use></svg></span><span>Display account group charges for each tenant and automatically apply payments to the entire group.</span></label></div>\n    </section>\n  </div>\n  <div class=\"rmx-overlay__footer\"><button class=\"rmx-btn rmx-btn--primary\" id=\"pp-publish\" data-rmx-component=\"Button\">Publish</button><button class=\"rmx-btn rmx-btn--secondary\" data-pp-close data-rmx-component=\"Button\">Cancel</button></div>\n</div></div>";

  var SET = function (o) { return Object.assign({ less: true, future: false, over: false, mode: 'oldest', charge: '', override: false, choose: false, shared: false }, o); };
  function seed() {
    return {
      'default': { id: 'default', name: 'Default Payment Policy', desc: 'Default policy settings', active: true, isDefault: true, by: '', on: '',
        props: ['Flagstone Manufactured Housing', 'Mesa Verde Townhomes'], set: SET({ future: true, over: true, choose: true }) },
      'assoc': { id: 'assoc', name: 'Association Policies', desc: 'Payment policies for all associations.', active: true, isDefault: false, by: 'cward', on: '01/31/2026',
        props: ['Summerlin HOA', 'Desert Ridge HOA'], set: SET({ shared: true }) },
      'riverview': { id: 'riverview', name: 'Riverview Policies', desc: '', active: true, isDefault: false, by: 'cward', on: '02/02/2026',
        props: ['Riverview Apartments'], set: SET({ future: true, over: true, mode: 'specific', charge: 'RC', override: true, choose: true }) }
    };
  }
  function store() { var s = RO.get(); if (!s.policies) { s.policies = seed(); RO.save(s); } return s; }

  var work = null, onPublish = null, wired = false;

  function setCheck(id, on, disabled) { var e = $('#' + id); e.dataset.checked = String(!!on); e.classList.toggle('is-disabled', !!disabled); }
  function paint() {
    var c = work.set;
    $('#pp-props').textContent = work.props.join(', ');
    setCheck('pp-active', work.active, work.isDefault);
    setCheck('pp-less', c.less); setCheck('pp-future', c.future); setCheck('pp-over', c.over);
    setCheck('pp-choose', c.choose); setCheck('pp-shared', c.shared);
    $('#pp-oversub').classList.toggle('is-off', !c.over);
    $('#pp-oldest').dataset.checked = String(c.mode === 'oldest');
    $('#pp-specific').dataset.checked = String(c.mode === 'specific');
    var dd = $('#pp-dd'); dd.classList.toggle('is-disabled', !c.over || c.mode !== 'specific');
    $('.pp-dd__v', dd).textContent = c.charge || 'Select Charge Type';
    $('.pp-dd__v', dd).classList.toggle('is-ph', !c.charge);
    setCheck('pp-override', c.override, !c.over || c.mode !== 'specific');
    preview();
  }
    function preview() {
    var c = work.set, cards = '';
    var card = function (title, sub) { return '<div class="pp-card"><span class="pp-card__r"></span><div class="pp-card__t"><div class="pp-card__h"><b>' + title + '</b><small>' + sub + '</small></div><div class="pp-card__sk"></div></div></div>'; };
    cards += card('My Current Balance', 'as of xx/xx');
    if (c.future) cards += card('My Total Balance', 'Including future charges');
    if (c.less) cards += '<div class="pp-card is-on"><span class="pp-card__r is-on"></span><div class="pp-card__t"><div class="pp-card__h"><b>Other Amount</b><span class="pp-card__sk--w"></span></div><div class="pp-card__in"><u>$</u><i></i></div></div></div>';
    var chk = c.choose, pay = c.choose;
    var cell = function (cls) { return '<div class="c' + (cls ? ' ' + cls : '') + '"><i></i></div>'; };
    var html = '<div class="pp-tbl' + (chk ? ' has-cb' : '') + '">';
    html += (chk ? '<div class="h"></div>' : '') + '<div class="h">Date</div><div class="h">Type</div><div class="h">Details</div><div class="h r">Charge Amount</div>' + (pay ? '<div class="h r">Pay Amount</div>' : '');
    for (var i = 0; i < 3; i++) {
      html += (chk ? '<div class="k"><i>' + ICON('check') + '</i></div>' : '') + cell() + cell() + cell() + cell() + (pay ? '<div class="p"><i></i></div>' : '');
    }
    $('#pp-pv').innerHTML = '<div class="pp-cards">' + cards + '</div>' + html + '</div>';
  }


  function wire() {
    if (wired) return; wired = true;
    var host = document.createElement('div'); host.innerHTML = HTML; document.body.appendChild(host.firstChild);
    var flip = function (id, key) { $('#' + id).addEventListener('click', function () { if (this.classList.contains('is-disabled')) return; work.set[key] = !work.set[key]; paint(); }); };
    flip('pp-less', 'less'); flip('pp-future', 'future'); flip('pp-over', 'over'); flip('pp-choose', 'choose'); flip('pp-shared', 'shared'); flip('pp-override', 'override');
    $('#pp-active').addEventListener('click', function () { if (this.classList.contains('is-disabled')) return; work.active = !work.active; paint(); });
    $('#pp-oldest').addEventListener('click', function () { if (!work.set.over) return; work.set.mode = 'oldest'; paint(); });
    $('#pp-specific').addEventListener('click', function () { if (!work.set.over) return; work.set.mode = 'specific'; paint(); });
    $('#pp-dd').addEventListener('rmx:select', function (e) { work.set.charge = e.detail.value; work.set.mode = 'specific'; paint(); });
    $('#pp-dd [data-rmx-trigger]').addEventListener('click', function (e) { if (!work.set.over || work.set.mode !== 'specific') e.stopImmediatePropagation(); }, true);
    $('#pp-name').addEventListener('input', function () { work.name = this.value; });
    $('#pp-desc').addEventListener('input', function () { work.desc = this.value; });
    $$('[data-pp-close]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); close(); }); });
    var ov = $('#ov-policy');
    var dirty = function () { $('#pp-publish').textContent = 'Save & Publish'; };
    ov.addEventListener('input', dirty);
    ov.addEventListener('click', function (e) { if (e.target.closest('.pp-body .rmx-check, .pp-body .rmx-radio, .pp-body [data-value]')) dirty(); });
    $('#pp-publish').addEventListener('click', function () {
      var s = store(), id = work.id;
      if (id === 'new') { id = 'p' + Date.now(); work.id = id; if (!work.name) work.name = 'New Payment Policy'; if (!work.props.length) work.props = ['No Property Assigned']; }
      work.by = 'igeza'; work.on = today();
      s.policies[id] = work;
      s.ready = s.ready || {}; s.ready['pay:' + id] = true;
      s.touched = true; RO.save(s);
      close();
      if (onPublish) onPublish(id);
    });
  }
  function close() { $('#ov-policy').hidden = true; }

  function open(id, opts) {
    wire();
    onPublish = opts && opts.onPublish;
    var s = store(), p = id ? s.policies[id] : null;
    work = p ? JSON.parse(JSON.stringify(p)) : { id: 'new', name: '', desc: '', active: true, isDefault: false, props: [], set: SET({}) };
    work.set = SET(work.set);
    $('#pp-name').value = work.name; $('#pp-desc').value = work.desc;
    $('#pp-publish').textContent = work.id === 'new' ? 'Save & Publish' : 'Publish';
    paint(); $('#ov-policy').hidden = false;
  }

  window.PP = { open: open, store: store, today: today };
})();
