import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, href) =>
    /^(https?:\/\/|\/|#|[\w.-]+\.html$)/.test(href)
      ? `<a href="${href}">${label}</a>`
      : whole,
  );
  return out;
}

export function toHtml(markdown) {
  const html = [];
  let paragraph = [];
  let inList = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const item = line.match(/^-\s+(.*)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (item) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inline(item[1])}</li>`);
    } else if (line.trim() === '') {
      flushParagraph();
      closeList();
    } else {
      closeList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  closeList();
  return html.join('\n');
}

export function page({ title, body, pages, current }) {
  const nav = pages
    .map((p) => `<a href="${p.file}"${p.file === current ? ' aria-current="page"' : ''}>${escapeHtml(p.label)}</a>`)
    .join('\n    ');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    ${nav}
  </nav>
  <main>
${body}
  </main>
  <footer>Built from Markdown files.</footer>
</body>
</html>
`;
}

export function build(source = 'content', out = 'dist') {
  fs.mkdirSync(out, { recursive: true });
  const files = fs
    .readdirSync(source)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => (a === 'index.md' ? -1 : b === 'index.md' ? 1 : a.localeCompare(b)));
  const pages = files.map((f) => {
    const name = f.replace(/\.md$/, '');
    return {
      file: `${name}.html`,
      label: name === 'index' ? 'Home' : name[0].toUpperCase() + name.slice(1),
      markdown: fs.readFileSync(path.join(source, f), 'utf8'),
    };
  });
  for (const p of pages) {
    const title = p.markdown.match(/^#\s+(.*)$/m)?.[1] ?? p.label;
    const html = page({ title, body: toHtml(p.markdown), pages, current: p.file });
    fs.writeFileSync(path.join(out, p.file), html);
  }
  fs.copyFileSync('style.css', path.join(out, 'style.css'));
  return pages.length;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Built ${build()} pages into dist/`);
}
