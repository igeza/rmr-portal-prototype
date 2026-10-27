/* Drag a header divider to resize that column of the register (Portal Profiles, Payment Policies). Prototype only. */
(function () {
  'use strict';
  function init(table) {
    var ths = [].slice.call(table.querySelectorAll('thead th'));
    var cols = [].slice.call(table.querySelectorAll('colgroup col'));
    ths.forEach(function (th, i) {
      if (i === ths.length - 1) return;
      var h = document.createElement('span'); h.className = 'ro-colgrip'; h.setAttribute('aria-hidden', 'true');
      th.appendChild(h);
      h.addEventListener('mousedown', function (e) {
        e.preventDefault(); e.stopPropagation();
        var w = ths.map(function (t) { return t.getBoundingClientRect().width; });
        table.style.tableLayout = 'fixed';
        table.style.width = w.reduce(function (a, b) { return a + b; }, 0) + 'px';
        ths.forEach(function (t, j) { t.style.width = w[j] + 'px'; if (cols[j]) cols[j].style.width = w[j] + 'px'; });
        var x0 = e.clientX, w0 = w[i], total = w.reduce(function (a, b) { return a + b; }, 0);
        document.body.classList.add('ro-colresizing');
        function move(ev) {
          var nw = Math.max(40, w0 + ev.clientX - x0);
          th.style.width = nw + 'px'; if (cols[i]) cols[i].style.width = nw + 'px';
          table.style.width = (total - w0 + nw) + 'px';
        }
        function up() { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.classList.remove('ro-colresizing'); }
        document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
      });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.querySelectorAll('.ro-pftable .rmx-register'), init);
  });
})();
