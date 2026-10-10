# Portfolio site from Markdown

A small portfolio site built from plain Markdown files by a script with no dependencies.

## Run it

    node build.js            # writes the site to dist/
    python3 -m http.server 8765 --directory dist --bind 127.0.0.1
    npm test                 # five automated tests

Edit the files in `content/`, run the build again, and the pages in `dist/` update. To publish, upload `dist/` to any static host.

## Files

- `content/*.md` - the page text
- `build.js` - converts Markdown to HTML
- `style.css` - the look
- `build.test.js` - tests
