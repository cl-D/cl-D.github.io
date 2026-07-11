# cl-d.github.io — portfolio & blog

Personal portfolio and blog for **Sal L**, live at **<https://cl-d.github.io>**.

Plain HTML/CSS/JS with a Gruvbox Dark terminal theme (JetBrains Mono). Blog posts are
markdown files — pushing one to `main` publishes it automatically via GitHub Actions.

---

## Publish a blog post (the short version)

```bash
npm run new-post -- "My Post Title"   # creates posts/my-post-title.md with valid front matter
# ... write the post ...
git add posts/my-post-title.md
git commit -m "post: My Post Title"
git push
```

About a minute later the post is live at `https://cl-d.github.io/blog/my-post-title.html`.
Watch progress under the repo's **Actions** tab.

### Front matter reference

Every post must start with this block:

```yaml
---
title: My Post Title                  # required
date: 2026-07-10                      # required, YYYY-MM-DD — controls sort order
description: One-line summary.        # required — shown in the blog list & RSS
tags: m365, powershell                # optional, comma-separated
---
```

If a required field is missing, the build fails with a clear error (check the Actions
log) and the site keeps its previous version — a broken post can't take the site down.

The post's URL comes from its filename: `posts/my-post-title.md` → `/blog/my-post-title.html`.
Markdown supports full GitHub flavor: headings, lists, tables, quotes, images, and
fenced code blocks with syntax highlighting (```powershell, ```bash, ```yaml, ...).

---

## Preview locally

```bash
npm install        # first time only
npm run dev        # builds, then serves at http://localhost:8080
```

## How this repo works

```
├── src/                    # static site source — edit resume content here
│   ├── index.html          #   the Root page (about, experience, projects, skills…)
│   ├── 404.html            #   not-found page
│   ├── css/style.css       #   Gruvbox Dark terminal theme
│   ├── js/main.js          #   typing animation (progressive enhancement)
│   ├── fonts/              #   JetBrains Mono (self-hosted)
│   └── templates/          #   HTML shells for blog pages ({{placeholders}})
├── posts/                  #   blog posts — one markdown file each
├── build.js                # markdown → HTML, blog index, RSS feed
├── new-post.js             # scaffolds a post (npm run new-post)
├── serve.js                # local preview server (npm run serve)
├── .github/workflows/
│   └── deploy.yml          # CI/CD: push to main → build → deploy to Pages
└── dist/                   # build output (generated — never edit, not committed)
```

**CI/CD pipeline:** every push to `main` triggers `deploy.yml`, which installs
dependencies, runs `build.js` (converts `posts/*.md`, copies `src/`, generates the
blog index and `feed.xml`), and deploys `dist/` to GitHub Pages.

## Common edits

| I want to… | Edit… |
|---|---|
| Update resume content (jobs, skills, certs) | `src/index.html` |
| Replace the placeholder projects | `src/index.html` → `<section id="projects">` |
| Change colors / fonts / layout | `src/css/style.css` |
| Change the blog page shells | `src/templates/*.html` |
| Write a post | `posts/*.md` |

> **Note:** personal source documents (resume PDFs, `Master-Profile.md`) are
> intentionally excluded from this repo via `.gitignore` because they contain
> private details.
