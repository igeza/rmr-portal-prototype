#!/usr/bin/env python3
"""Bundle the whole rollout prototype into ONE self-contained file: rollout.html.

Every screen, stylesheet, script, image and font is embedded. A tiny router in the
page swaps screens inside an iframe and keeps the walkthrough state in memory, so the
file works from email, Slack, a drive or a double-click, with no server.

Run:  python3 tools/build-rollout.py        (re-run after any change to screens/ or assets/)
"""
import base64, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENS = os.path.join(ROOT, 'screens')
START = 'admin-get-started.html'
OUT = os.path.join(ROOT, 'rollout.html')
MIME = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp'}


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


assets = {}      # 'assets/x.png' -> data URI
css, js = {}, {}  # 'assets/x.css' -> text


def norm(p):
    p = p.split('#')[0].split('?')[0]
    while p.startswith('../'):
        p = p[3:]
    return p


def asset(path):
    path = norm(path)
    if path not in assets:
        full = os.path.join(ROOT, path)
        ext = path.rsplit('.', 1)[-1].lower()
        with open(full, 'rb') as f:
            assets[path] = 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(f.read()).decode())
    return path


IMG = re.compile(r'(?:\.\./)?(assets/[A-Za-z0-9_./%-]+?\.(?:png|jpe?g|gif|svg|webp))(?![A-Za-z0-9_#])')


def tokenise_assets(text):
    def sub(m):
        if not os.path.exists(os.path.join(ROOT, m.group(1))):
            return m.group(0)
        asset(m.group(1))
        return '@@A:%s@@' % m.group(1)
    return IMG.sub(sub, text)


def fix_js(text):
    """Make a script safe inside the bundle: virtual location, in-memory storage, in-page icons."""
    text = text.replace('../assets/icons.svg#', '#').replace('../assets/icons-local.svg#', '#')
    text = re.sub(r'location\.href\s*=\s*([^;\n}]+)', r'__go(\1)', text)
    text = re.sub(r'location\.replace\(', '__go(', text)
    text = text.replace('location.pathname', '__loc.pathname').replace('location.search', '__loc.search')
    text = re.sub(r'\blocalStorage\b', '__ls', text)
    text = re.sub(r'\bsessionStorage\b', '__ss', text)
    return tokenise_assets(text)


def load_css(path):
    path = norm(path)
    if path not in css:
        css[path] = tokenise_assets(read(os.path.join(ROOT, path)))
    return path


def load_js(path):
    path = norm(path)
    if path not in js:
        js[path] = fix_js(read(os.path.join(ROOT, path)))
    return path


# ---- icon sheets ----
local_sprite = ''
m = re.search(r'<svg[^>]*>(.*)</svg>', read(os.path.join(ROOT, 'assets/icons-local.svg')), re.S)
if m:
    local_sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">%s</svg>' % m.group(1)

# ---- screens ----
screens = {}
for name in sorted(os.listdir(SCREENS)):
    if not name.endswith('.html'):
        continue
    html = read(os.path.join(SCREENS, name))
    html = re.sub(r'<link href="https://fonts\.googleapis\.com[^>]*>', '', html)
    html = re.sub(r'<link rel="stylesheet" href="([^"]+\.css)">', lambda m: '@@CSS:%s@@' % load_css(m.group(1)), html)
    html = re.sub(r'<script src="([^"]+\.js)"></script>', lambda m: '@@JS:%s@@' % load_js(m.group(1)), html)

    def inline_script(m):
        return m.group(1) + fix_js(m.group(2)) + m.group(3)
    html = re.sub(r'(<script>)(.*?)(</script>)', inline_script, html, flags=re.S)
    html = html.replace('../assets/icons.svg#', '#').replace('../assets/icons-local.svg#', '#')
    html = tokenise_assets(html)
    if 'icons-local' in read(os.path.join(SCREENS, name)) or '#play-arrow' in html:
        html = html.replace('</body>', local_sprite + '</body>')
    screens[name] = html

# ---- fonts (Latin subset, embedded) ----
fonts_css = ''
try:
    req = urllib.request.Request(
        'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap',
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36'})
    sheet = urllib.request.urlopen(req, timeout=30).read().decode()
    for block in re.findall(r'/\* latin \*/\s*(@font-face \{.*?\})', sheet, re.S):
        url = re.search(r'url\((https://[^)]+)\)', block).group(1)
        data = base64.b64encode(urllib.request.urlopen(url, timeout=30).read()).decode()
        fonts_css += block.replace(url, 'data:font/woff2;base64,' + data) + '\n'
except Exception as e:  # offline build: fall back to system fonts
    print('fonts not embedded (%s)' % e, file=sys.stderr)


def js_literal(obj):
    s = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return s.replace('</', '<\\/').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


SHELL = r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>rmResident Portal Rollout</title>
<style>html,body{margin:0;height:100%;background:#fff}iframe{border:0;width:100%;height:100%;display:block}</style></head>
<body><iframe id="f" title="rmResident Portal Rollout"></iframe>
<script>
(function () {
  var SCREENS = __SCREENS__, A = __ASSETS__, CSS = __CSS__, JS = __JS__, FONTS = __FONTS__, START = __START__;
  /* walkthrough state lives in memory: every open of this file starts fresh */
  function store() { var m = {}; return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } }; }
  window.__ls = store(); window.__ss = store();
  var f = document.getElementById('f'), cur = null;
  var BOOT = '<script>(function(){var P=parent;window.__loc={pathname:"/screens/"+P.__cur.name,search:P.__cur.search,hash:"",href:"/screens/"+P.__cur.name+P.__cur.search};' +
    'window.__go=function(u){P.__rgo(String(u))};window.__ls=P.__ls;window.__ss=P.__ss;' +
    'document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");' +
    'if(/^[\\w-]+\\.html/.test(h)||/^(\\.\\.\\/)?screens\\/[\\w-]+\\.html/.test(h)){e.preventDefault();P.__rgo(h);}},true);' +
    'var fix=function(n){if(n.nodeType!==1)return;var l=n.matches&&n.matches("img[src]")?[n]:[].slice.call(n.querySelectorAll?n.querySelectorAll("img[src]"):[]);l.forEach(function(i){var s=i.getAttribute("src");' +
    'var k=s&&s.replace(/^(\\.\\.\\/)+/,"");if(k&&P.__A[k]&&s.indexOf("data:")!==0)i.setAttribute("src",P.__A[k]);});};' +
    'new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")fix(m.target);else m.addedNodes.forEach(fix);});}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:["src"]});})();<\/script>';
  window.__A = A;
  function build(c) {
    var html = SCREENS[c.name];
    html = html.replace(/@@CSS:([^@]+)@@/g, function (m, p) { return '<style>' + CSS[p] + '</style>'; });
    html = html.replace(/@@JS:([^@]+)@@/g, function (m, p) { return '<script>' + JS[p].replace(/<\/script/gi, '<\\/script') + '<\/script>'; });
    html = html.replace(/@@A:([^@]+)@@/g, function (m, p) { return A[p] || ''; });
    return html.replace('<head>', function () { return '<head><style>' + FONTS + '</style>' + BOOT; });
  }
  window.__rgo = function (u) {
    var m = String(u).match(/([\w-]+\.html)(\?[^#]*)?/);
    if (!m || !SCREENS[m[1]]) return;
    cur = window.__cur = { name: m[1], search: m[2] || '' };
    f.srcdoc = build(cur);
  };
  window.__rgo(START);
})();
</script></body></html>
'''

out = (SHELL.replace('__SCREENS__', js_literal(screens)).replace('__ASSETS__', js_literal(assets))
       .replace('__CSS__', js_literal(css)).replace('__JS__', js_literal(js))
       .replace('__FONTS__', js_literal(fonts_css)).replace('__START__', js_literal(START)))
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(out)
print('wrote %s  (%.1f MB, %d screens, %d images)' % (OUT, len(out.encode()) / 1e6, len(screens), len(assets)))
