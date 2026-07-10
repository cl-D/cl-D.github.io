// Scaffold a new blog post with valid front matter.
// Run with: npm run new-post -- "My Post Title"
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const POSTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "posts");

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post -- "My Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const now = new Date();
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");

const file = path.join(POSTS_DIR, `${slug}.md`);
if (existsSync(file)) {
  console.error(`Refusing to overwrite existing post: posts/${slug}.md`);
  process.exit(1);
}

mkdirSync(POSTS_DIR, { recursive: true });
writeFileSync(
  file,
  `---
title: ${title}
date: ${date}
description: One sentence about this post (shown in the blog list).
tags: tag-one, tag-two
---

Write your post here in **markdown**.

## A heading

- Lists, [links](https://example.com), \`inline code\`, tables, quotes — all supported.

\`\`\`powershell
# Code blocks get Gruvbox syntax highlighting
Get-MgUser -Filter "accountEnabled eq true" | Select-Object DisplayName
\`\`\`
`
);

console.log(`Created posts/${slug}.md`);
console.log("Next steps:");
console.log(`  1. Edit the file (fill in description/tags, write the post)`);
console.log(`  2. Preview locally:  npm run dev`);
console.log(`  3. Publish:          git add posts/${slug}.md && git commit -m "post: ${title}" && git push`);
