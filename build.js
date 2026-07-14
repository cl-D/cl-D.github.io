// Static site builder.
//
// - Copies everything in src/ (except src/templates/) to dist/
// - Converts posts/*.md into dist/blog/<slug>.html
// - Generates dist/blog/index.html (post list) and dist/feed.xml (RSS)
//
// Run with: npm run build

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const POSTS_DIR = path.join(ROOT, "posts");
const DIST = path.join(ROOT, "dist");

const SITE_URL = "https://cl-d.github.io";
const SITE_TITLE = "Sal L · Blog";
const SITE_DESCRIPTION = "Notes on Microsoft 365 administration, PowerShell automation, identity, and IT operations.";

function fail(message) {
  console.error(`\nBUILD FAILED: ${message}\n`);
  process.exit(1);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ---------------------------------------------------------------------------
// Markdown renderer (GitHub-flavored, with build-time syntax highlighting)
// ---------------------------------------------------------------------------
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return escapeHtml(code);
    },
  }),
  { gfm: true }
);

// ---------------------------------------------------------------------------
// Front matter
// ---------------------------------------------------------------------------
// Expected shape at the top of every post:
//
//   ---
//   title: My Post Title
//   date: 2026-07-10
//   description: One sentence shown in the post list and search results.
//   tags: m365, powershell        (optional)
//   ---
//
function parsePost(filename) {
  const raw = readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    fail(`posts/${filename}: missing front matter. Start the file with a "---" block containing title, date, and description.`);
  }

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) fail(`posts/${filename}: cannot parse front matter line "${line}" (expected "key: value").`);
    meta[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
  }

  for (const required of ["title", "date", "description"]) {
    if (!meta[required]) fail(`posts/${filename}: front matter is missing "${required}".`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) {
    fail(`posts/${filename}: date "${meta.date}" must be a valid YYYY-MM-DD date.`);
  }

  const body = raw.slice(match[0].length);
  const slug = filename
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) fail(`posts/${filename}: filename produces an empty URL slug.`);

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    filename,
    title: meta.title,
    date: meta.date,
    description: meta.description,
    tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    readingTime: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body),
  };
}

function renderTemplate(templateName, vars) {
  const template = readFileSync(path.join(SRC, "templates", templateName), "utf8");
  return template.replace(/\{\{(\w+)\}\}/g, (whole, key) => {
    if (!(key in vars)) fail(`templates/${templateName}: no value provided for ${whole}`);
    return vars[key];
  });
}

function tagsHtml(tags) {
  if (tags.length === 0) return "";
  const spans = tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join(" ");
  return `<span>· ${spans}</span>`;
}

// ---------------------------------------------------------------------------
// 1. Reset dist/ and copy static files
// ---------------------------------------------------------------------------
rmSync(DIST, { recursive: true, force: true });
cpSync(SRC, DIST, {
  recursive: true,
  filter: (source) => {
    const rel = path.relative(SRC, source);
    return rel !== "templates" && !rel.startsWith("templates" + path.sep);
  },
});

// Syntax highlighting theme lives in src/css/hljs.css (custom, matches the
// site palette) and is copied to dist with the rest of the static files.

// ---------------------------------------------------------------------------
// 2. Build blog posts
// ---------------------------------------------------------------------------
mkdirSync(path.join(DIST, "blog"), { recursive: true });

const postFiles = existsSync(POSTS_DIR)
  ? readdirSync(POSTS_DIR).filter((f) => f.toLowerCase().endsWith(".md"))
  : [];

const posts = postFiles.map(parsePost);

const seen = new Map();
for (const post of posts) {
  if (seen.has(post.slug)) {
    fail(`posts/${post.filename} and posts/${seen.get(post.slug)} both produce the URL slug "${post.slug}" — rename one.`);
  }
  seen.set(post.slug, post.filename);
}

// newest first; title as a stable tie-breaker
posts.sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));

for (const post of posts) {
  const page = renderTemplate("post.html", {
    title: escapeHtml(post.title),
    description: escapeHtml(post.description),
    slug: post.slug,
    date: post.date,
    readingTime: String(post.readingTime),
    tags: tagsHtml(post.tags),
    content: post.html,
  });
  writeFileSync(path.join(DIST, "blog", `${post.slug}.html`), page);
}

// ---------------------------------------------------------------------------
// 3. Blog index
// ---------------------------------------------------------------------------
const postList =
  posts.length === 0
    ? `<p class="empty-blog">ls: no posts yet — add a markdown file to posts/ and push.</p>`
    : posts
        .map(
          (post) => `<article class="post-card">
  <a class="post-title" href="${post.slug}.html">${escapeHtml(post.title)}</a>
  <div class="post-meta">
    <time datetime="${post.date}">${post.date}</time>
    <span>· ${post.readingTime} min read</span>
    ${tagsHtml(post.tags)}
  </div>
  <p class="post-desc">${escapeHtml(post.description)}</p>
</article>`
        )
        .join("\n");

writeFileSync(path.join(DIST, "blog", "index.html"), renderTemplate("blog-index.html", { posts: postList }));

// ---------------------------------------------------------------------------
// 4. RSS feed
// ---------------------------------------------------------------------------
const items = posts
  .map(
    (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}.html</link>
      <guid>${SITE_URL}/blog/${post.slug}.html</guid>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.description)}</description>
    </item>`
  )
  .join("\n");

writeFileSync(
  path.join(DIST, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog/</link>
    <description>${escapeHtml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
);

console.log(`✓ built ${posts.length} post(s) → dist/`);
for (const post of posts) console.log(`  · ${post.date}  /blog/${post.slug}.html  "${post.title}"`);
