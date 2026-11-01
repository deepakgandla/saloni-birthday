# Saloni's birthday garden

A static site (plain HTML/CSS/JS, no build step) in `site/` — a warm, flower-filled birthday page for a close friend.

```
site/
  index.html
  css/style.css
  js/config.js      <- edit everything here
  js/flowers.js     SVG flower library (roses, tulips, blossoms, daisies, wildflowers, vines)
  js/effects.js     fireflies, petals, butterflies
  js/main.js        page logic
  assets/music/     background music
  assets/photos/    put your photos here
```

## Editing content (all in `site/js/config.js`)

| What | Key |
|---|---|
| Her name (every greeting) | `name` |
| Browser tab title | `pageTitle` |
| Opening subtitle / button | `intro.subtitle`, `intro.button` |
| Main message | `message` |
| Memory cards | `story[]`: `title`, `text`, `date` (optional), `photo` |
| Final message | `final.lines[]`, `final.signoff` |
| Music file / volume | `music.src`, `music.volume`, `music.startOnOpen` |

### Photos
1. Copy the images into `site/assets/photos/` (JPG/WebP, about 1200px wide and under 400 KB each so pages load fast on mobile).
2. Set the path on the matching card, e.g. `photo: "assets/photos/first-day.jpg"`.
3. Leave `photo: ""` to keep the flower illustration. Photos are cropped to 4:3.

### Music
Swap `site/assets/music/placeholder.m4a` for your song (MP3 or M4A), then update `music.src` if you changed the file name. Music never plays on page load. With `startOnOpen: true` it fades in when she taps "Open Your Surprise", and the "music" button at the top right toggles it anytime.

## Preview locally
```
cd site && python3 -m http.server 8000
# open http://localhost:8000
```

## Host it free on GitHub Pages

The repo includes `.github/workflows/deploy.yml`, which publishes the `site/` folder to GitHub Pages on every push to `main`.

1. Create a repo under your personal GitHub account (e.g. `saloni-birthday`) and push this project to it.
2. In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` (or re-run the workflow). The Action builds and deploys automatically.
4. The site goes live at `https://<your-username>.github.io/<repo>/`.

The page already asks search engines not to index it (`<meta name="robots" content="noindex, nofollow">`), but note that files in a public repo and a Pages site are viewable by anyone who has the link.
