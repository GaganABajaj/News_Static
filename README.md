# 10 Minute News static portal

A small, database-free news portal built with plain HTML, CSS, and JavaScript. It can be hosted directly from an AWS S3 bucket configured for static website hosting.

## Structure

- `index.html` is the daily homepage and edition index.
- `articles/` contains one standalone HTML file per story.
- `archive.html` is generated from the dated article files and supports year, month, and date filters.
- `articles.csv` is the active homepage lineup and controls story order.
- `styles.css` is shared by the homepage and article pages.
- `app.js` adds optional menu and homepage search behavior.
- `article_editor.py` provides a local Tkinter GUI for creating article HTML from pasted content.
- `json_article_editor.py` provides a Tkinter GUI for extracting article fields from pasted JSON.
- `json_to_html.py` creates a standalone article page from a JSON object.
- `build_index.py` rebuilds the homepage story cards from `articles.csv`.
- `generate_archive.py` rebuilds the archive from article filenames and metadata.

## Publish a new story

1. Copy an existing file in `articles/` and rename it with an ISO date and slug, for example `2026-09-26-city-budget.html`.
2. Replace the title, metadata, body, and any links back to the homepage.
3. Add or update a row in `articles.csv`. Set `active` to `true` to show it on the homepage, `false` to keep it archived only, and use `order` to control the homepage position.
4. Run `python build_index.py` from the project folder. The script validates each active link and rewrites the marked article block in `index.html`.
5. Run `python generate_archive.py` to refresh `archive.html` from every dated article file.
6. Upload the changed files while preserving the folder structure.

The archive reads the article title, category, and summary from each article's existing HTML metadata. It does not require a database or third-party Python package. Do not edit `archive.html` manually because the next generator run replaces it.

The homepage header date is rendered in the browser using Indian Standard Time (`Asia/Kolkata`) and is labeled `IST`.

## Create an article with the GUI

Run:

```powershell
python article_editor.py
```

Complete the metadata fields and paste the article body. Separate paragraphs with a blank line. The editor also supports:

- `## Section heading` for an article subheading
- `Quote: text` for a block quote

The editor escapes pasted HTML, creates a unique dated file in `articles/`, and appends an active row to `articles.csv`. After saving, run `python build_index.py` and `python generate_archive.py`.

## Create an article from pasted JSON in the GUI

Run:

```powershell
python json_article_editor.py
```

Paste the JSON object and select **Extract Fields** to fill the headline, category, short summary, read time, detail summary, image prompt, and slug. Review or edit the populated fields, then select **Submit Article**. The GUI creates a dated article page and appends it to `articles.csv`; run `python build_index.py` and `python generate_archive.py` to refresh the site listings.

## Create an article from JSON

Run `python json_to_html.py article.json` to create a dated HTML page in `articles/`. The JSON object must include `Title`, `Category`, `Short Summary`, `Read Time`, `Detail Summary`, and `Image Generation Prompt`. The detail summary supports paragraphs and numbered or bulleted lists. The image-generation prompt is retained as HTML metadata; pass `--image path-or-url` to include an image in the page.

You can also pipe JSON through standard input with `python json_to_html.py - --output articles/story.html`. Use `--output -` to write the HTML to standard output. This utility writes only the HTML page; add its metadata to `articles.csv` and run the index and archive generators if it should appear in those listings.

Relative paths are intentional: the same files work locally, on S3 static hosting, or behind CloudFront without a build step.

## S3 deployment notes

- Enable **Static website hosting** on the bucket.
- Set `index.html` as the index document.
- Set a custom error document if desired.
- If using CloudFront, point the distribution origin at the S3 bucket and set the default root object to `index.html`.
- Add a bucket CORS policy only if you later load content from another origin.

Example sync command:

```bash
aws s3 sync . s3://YOUR-BUCKET-NAME --exclude ".git/*" --exclude "README.md" --delete
```

For production, add cache-control headers: use a short cache for `index.html` and long immutable caching for versioned assets.
