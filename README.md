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

## Notes

- Built and tested on Node.js v22.23.3 and Python 3.10.12 (other versions are untested). The commands are for a macOS or Linux terminal (on Windows, use WSL).
- The studio, projects and text are made up. Educational example, no warranty. Use at your own risk.
- Code is MIT licensed (see LICENSE). Node.js and Python are separate projects with their own licenses; this repository does not include them.
- The commands that build this project, with the real output recorded from a real run, are in the companion practice page: https://faiz12321.github.io/ai-tools-that-work/build-session-04-portfolio-site.html . Nothing in it runs on your device.
