# Factorized Koopman Distillation — Anonymous Project Page

Static site for double-blind review (IEEE RA-L).

- No author names, affiliations, or identifying assets on the page.
- No identifying metadata in image EXIF / PDF fields.
- Keep commit author configured neutrally (see below).

## Local preview

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish to GitHub Pages (fdkoopman.github.io)

Assumes you created a new, anonymous GitHub account `fdkoopman` with a fresh email
and have removed real name / photo / bio / location / company from its profile,
and created an empty public repo **`fdkoopman/fdkoopman.github.io`**.

From this `website/` folder:

```bash
# 1) configure a neutral local git identity for this site only
git init -b main
git config user.name  "Anonymous"
git config user.email "fdkoopman@users.noreply.github.com"

# 2) stage and commit
git add .
git commit -m "anonymous project page"

# 3) push
git remote add origin https://github.com/fdkoopman/fdkoopman.github.io.git
git push -u origin main
```

Then in the GitHub repo UI:
`Settings` → `Pages` → `Source: Deploy from a branch` → `Branch: main / (root)` → `Save`.

Site will be live at: <https://fdkoopman.github.io> (usually within 1–2 minutes).

## Double-blind checklist

- [ ] No real name in GitHub profile.
- [ ] No avatar photo identifying you.
- [ ] No starred repos or follows that reveal identity.
- [ ] Commit author is `Anonymous <fdkoopman@users.noreply.github.com>`.
- [ ] No absolute links to personal websites, lab pages, or socials.
- [ ] PDFs and images stripped of author metadata (`exiftool -all= file.png`).
- [ ] Page title / meta / BibTeX use only "Anonymous".
