---
title: Hello, World — how this blog works
date: 2026-07-10
description: Every post on this site is a markdown file. Pushing it to GitHub is the entire publishing process — here's the pipeline behind that.
tags: meta, ci-cd, github-actions
---

Welcome to the blog. This first post doubles as documentation: it was published exactly the way every future post will be.

## The entire publishing workflow

1. Create a markdown file in the `posts/` folder (or run `npm run new-post -- "Title"`)
2. Write the post
3. Push it:

```bash
git add posts/my-new-post.md
git commit -m "post: my new post"
git push
```

That's it. No admin panel, no database, no build step to remember. A GitHub Actions workflow notices the push, converts the markdown to HTML, rebuilds the blog index and RSS feed, and redeploys the whole site to GitHub Pages — usually in under a minute.

## What a post looks like

Every post starts with a small front matter block that the build script reads:

```yaml
---
title: Hello, World — how this blog works
date: 2026-07-10
description: One sentence shown in the blog list.
tags: meta, ci-cd, github-actions
---
```

Below that, it's plain [GitHub-flavored markdown](https://github.github.com/gfm/). Code blocks get syntax highlighting at build time — zero JavaScript shipped to the reader. Since PowerShell will show up here a lot, a taste:

```powershell
# Find M365 licenses that are assigned but haven't signed in for 90 days
$cutoff = (Get-Date).AddDays(-90)
Get-MgUser -All -Property DisplayName, SignInActivity, AssignedLicenses |
    Where-Object { $_.AssignedLicenses -and $_.SignInActivity.LastSignInDateTime -lt $cutoff } |
    Select-Object DisplayName, @{n = 'LastSignIn'; e = { $_.SignInActivity.LastSignInDateTime } }
```

> The best automation is the kind you never have to think about again — that goes for publishing a blog post, too.

## What I'll write about

Notes from the world of Microsoft 365 administration: Entra ID and identity, Intune, PowerShell automation, backup and recovery, and the occasional lesson learned the hard way. See you in the next post.
