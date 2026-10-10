import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build, toHtml } from './build.js';

test('headings, paragraphs and lists', () => {
  const html = toHtml('# Title\n\nHello there.\n\n- one\n- two\n');
  assert.equal(html, '<h1>Title</h1>\n<p>Hello there.</p>\n<ul>\n<li>one</li>\n<li>two</li>\n</ul>');
});

test('bold, italic and links', () => {
  assert.equal(
    toHtml('**bold** and *soft* and [home](index.html)'),
    '<p><strong>bold</strong> and <em>soft</em> and <a href="index.html">home</a></p>',
  );
});

test('raw HTML in the text is escaped, not run', () => {
  assert.equal(toHtml('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});

test('unsafe link addresses are not turned into links', () => {
  assert.ok(!toHtml('[click](javascript:alert(1))').includes('<a '));
});

test('build writes one page per Markdown file, with the current page marked', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
  const src = path.join(dir, 'content');
  fs.mkdirSync(src);
  fs.writeFileSync(path.join(src, 'index.md'), '# Welcome\n');
  fs.writeFileSync(path.join(src, 'about.md'), '# About us\n');
  assert.equal(build(src, path.join(dir, 'dist')), 2);
  const about = fs.readFileSync(path.join(dir, 'dist', 'about.html'), 'utf8');
  assert.ok(about.includes('<title>About us</title>'));
  assert.ok(about.includes('<a href="about.html" aria-current="page">About</a>'));
});
