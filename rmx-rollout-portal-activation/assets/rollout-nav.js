/* Rollout prototype: wires two Mega Menu header tabs to this prototype's own screens.
   The Mega Menu itself is the skill's and is left untouched; this only intercepts
   clicks on its Workspace and Administration tabs. */
document.addEventListener('click', function (e) {
  var tab = e.target.closest('.megamenu__tab');
  if (!tab) return;
  var label = tab.textContent.trim();
  var target = label === 'Administration' ? 'admin-menu.html'
             : label === 'Workspace' ? 'dashboard.html' : null;
  if (!target) return;
  e.preventDefault();
  e.stopPropagation();
  location.href = target;
}, true);

/* Clicking the Rent Manager logo in the app bar resets the walkthrough and returns to the start. */
document.addEventListener('click', function (e) {
  var logo = e.target.closest('.rmx-appbar__leading');
  if (!logo) return;
  e.preventDefault();
  try { localStorage.removeItem('roState'); sessionStorage.removeItem('roPtourReturn'); } catch (x) {}
  location.href = 'admin-get-started.html';
}, true);

/* Administration pages: the left menu follows the section at the top of the scroll area, and clicking an item scrolls to it.
   Arriving from the Mega Menu (admin-menu.html / ?top=1) starts at the top; every other arrival lands on rmResident Portal. */
(function () {
  var main = document.querySelector('.ro-admin__main'), nav = document.querySelector('.ro-nav');
  if (!main || !nav) return;
  var items = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var secs = items.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function spy() {
    var y = main.getBoundingClientRect().top + 24, cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= y) cur = i; });
    items.forEach(function (a, i) {
      var on = i === cur;
      a.classList.toggle('megamenu__sidebar-item--active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var s = secs[i]; if (s) main.scrollTo({ top: s.offsetTop - main.offsetTop - 16 + (main.scrollTop - main.scrollTop), behavior: 'smooth' });
    });
  });
  /* white space after the last section so rmResident Portal can be scrolled up to the top */
  var gap = document.createElement('div'); gap.setAttribute('aria-hidden', 'true'); gap.style.cssText = 'flex:none;width:1px;';
  main.appendChild(gap);
  function size() { var p = document.getElementById('rmresident-portal'); gap.style.height = p ? Math.max(0, main.clientHeight - p.offsetHeight - 48) + 'px' : '0'; }
  size(); window.addEventListener('resize', size);
  main.addEventListener('scroll', spy, { passive: true });
  var top = /[?&]top=1/.test(location.search) || location.pathname.split('/').pop() === 'admin-menu.html';
  var portal = document.getElementById('rmresident-portal');
  if (!top && portal) { main.style.scrollBehavior = 'auto'; main.scrollTop = portal.offsetTop - main.offsetTop - 16; main.style.scrollBehavior = 'smooth'; }
  spy();
})();
