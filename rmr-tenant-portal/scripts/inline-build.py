#!/usr/bin/env python3
"""Builds MVP.html and Full-Product.html as fully self-contained files.

MVP.html and Full-Product.html (at the repo root) are the deliverable: they
must have zero external dependencies (no <link rel="stylesheet">, <script
src>, or <img src="assets/...">) so they still render correctly if shared or
opened outside this repo's folder structure. They are GENERATED — don't
hand-edit them.

The actual editable sources are:
  - templates/MVP.html, templates/Full-Product.html — normal HTML with
    plain <link>/<script src>/<img src="assets/..."> references. Edit page
    markup here.
  - assets/rmr.css, assets/proto.css, assets/app.js, assets/icons/,
    assets/images/ — edit CSS/JS/icons/images here, same as before.

After editing either, re-run this script (from rmr-tenant-portal/) to
regenerate both root HTML files. Safe/idempotent to re-run any time.
"""
import re
import os
import base64
import mimetypes

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'assets')
TEMPLATES = os.path.join(ROOT, 'templates')

MIME_OVERRIDES = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
}

_cache = {}


def data_uri_for(rel_path):
    """rel_path like 'assets/icons/foo.svg', relative to ROOT."""
    if rel_path in _cache:
        return _cache[rel_path]
    abs_path = os.path.join(ROOT, rel_path)
    with open(abs_path, 'rb') as f:
        raw = f.read()
    ext = os.path.splitext(abs_path)[1].lower()
    mime = MIME_OVERRIDES.get(ext) or mimetypes.guess_type(abs_path)[0] or 'application/octet-stream'
    b64 = base64.b64encode(raw).decode('ascii')
    uri = 'data:' + mime + ';base64,' + b64
    _cache[rel_path] = uri
    return uri


def inline_css_urls(css_text):
    def repl(m):
        path = m.group(2)
        if path.startswith('http') or path.startswith('data:'):
            return m.group(0)
        uri = data_uri_for('assets/' + path)
        return 'url("' + uri + '")'
    return re.sub(r'''url\((['"]?)([^'")]+)\1\)''', repl, css_text)


def inline_js_paths(js_text):
    def repl(m):
        quote = m.group(1)
        path = m.group(2)
        return quote + data_uri_for(path) + quote
    return re.sub(r'''(['"])(assets/[^'"]+)\1''', repl, js_text)


def build_shared_blocks():
    proto_css = open(os.path.join(ASSETS, 'proto.css'), encoding='utf-8').read()
    rmr_css = inline_css_urls(open(os.path.join(ASSETS, 'rmr.css'), encoding='utf-8').read())
    app_js = inline_js_paths(open(os.path.join(ASSETS, 'app.js'), encoding='utf-8').read())

    style = (
        '<style>\n'
        '/* ---- inlined from assets/proto.css ---- */\n'
        + proto_css.strip() + '\n'
        '/* ---- inlined from assets/rmr.css ---- */\n'
        + rmr_css.strip() + '\n'
        '</style>'
    )
    script = '<script>\n' + app_js.strip() + '\n</script>'
    return style, script


def process_html(template_path, combined_style, combined_script):
    html = open(template_path, encoding='utf-8').read()

    def favicon_repl(m):
        uri = data_uri_for('assets/icons/favicon.svg')
        return '<link rel="icon" type="image/svg+xml" href="' + uri + '" />'
    html = re.sub(r'<link rel="icon"[^>]*href="assets/icons/favicon\.svg"[^>]*/>', favicon_repl, html, count=1)

    html = re.sub(
        r'<link rel="stylesheet" href="assets/rmr\.css(?:\?v=\d+)?" />\s*\n<link rel="stylesheet" href="assets/proto\.css(?:\?v=\d+)?" />',
        lambda m: combined_style,
        html,
        count=1,
    )
    html = re.sub(
        r'<script src="assets/app\.js(?:\?v=\d+)?"></script>',
        lambda m: combined_script,
        html,
        count=1,
    )

    def asset_repl(m):
        attr, path = m.group(1), m.group(2)
        return attr + '="' + data_uri_for(path) + '"'
    html = re.sub(r'(src|href)="(assets/[^"?]+)(?:\?[^"]*)?"', asset_repl, html)

    # Custom data-* attributes that JS reads and assigns directly to img.src
    # (currently just data-vio-image on the Violations register).
    def data_attr_repl(m):
        attr, path = m.group(1), m.group(2)
        return attr + '="' + data_uri_for(path) + '"'
    html = re.sub(r'(data-vio-image)="(assets/[^"?]+)(?:\?[^"]*)?"', data_attr_repl, html)

    remaining = re.findall(r'(?:src|href)="assets/[^"]*"', html)
    return html, remaining


def main():
    combined_style, combined_script = build_shared_blocks()
    for fn in ['MVP.html', 'Full-Product.html']:
        template_path = os.path.join(TEMPLATES, fn)
        out_path = os.path.join(ROOT, fn)
        out, remaining = process_html(template_path, combined_style, combined_script)
        if remaining:
            print(fn + ': WARNING remaining assets refs: ' + str(remaining[:10]))
        else:
            print(fn + ': OK, ' + str(round(len(out) / 1024)) + ' KB')
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(out)


if __name__ == '__main__':
    main()
