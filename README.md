# A Little World for Thirandee ❤️
Made with love by Janaka. Pure HTML + CSS + vanilla JavaScript. No frameworks, no backend, no tracking.

## Folder structure
```
love-for-thirandee/
  index.html          all screens
  css/style.css       layout, colours, glassmorphism
  css/animations.css  hearts, sparkles, hug, transitions
  js/main.js          shared core: state/localStorage, navigation, home, sound, modal, welcome
  js/memory.js        Love Memory Challenge (card matching)
  js/quiz.js          How Well Do You Know Us?
  js/heart-game.js    Catch the Hearts (canvas)
  js/garden.js        Our Little Garden (unlocks as she plays)
  js/surprises.js     Mystery Gifts, Secret Letters, Virtual Hug, Distance map, Gallery, Daily Surprise, Final Letter
  assets/images/      photo1.jpg ... photo4.jpg (your photos)
  assets/sounds/      (empty; sounds are generated in code, nothing to add)
```

## 1. Run it locally
- Quick look: double-click `index.html`.
- Better (acts like a real website): in the folder run `python3 -m http.server 8000`, then open `http://localhost:8000`. To test on your phone, use your computer's local IP (same Wi-Fi), e.g. `http://192.168.1.20:8000`.

## 2. Publish free on GitHub Pages
1. Create a GitHub account and a **new repository** (e.g. `love-for-thirandee`). Public is required for free Pages.
2. Upload everything *inside* this folder (so `index.html` is at the top level of the repo): "Add file → Upload files", drag all, commit.
3. Repo **Settings → Pages**. Under *Build and deployment*, Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**, Save.
4. After ~1 minute your link appears: `https://YOUR-USERNAME.github.io/love-for-thirandee/`
5. Send her the link. On Android Chrome: menu ⋮ → **Add to Home screen** gives her an app-style icon.
Tip: if the repo name/username is guessable, anyone can find the page. Pick a less obvious repo name if you want it more private.

## 3. Customise
All text lives in plain arrays near the top of each file, clearly commented. Search for `EDIT HERE` or `CUSTOMISE`.
- **Letters, gifts, final letter, daily messages, map messages, hug lines:** `js/surprises.js`
- **Quiz questions and her personalised replies:** `js/quiz.js`
- **Memory-game win message:** `js/memory.js`
- **Catch the Hearts messages and goal score:** `js/heart-game.js`
- **Garden flower meanings:** `js/garden.js`
- **Welcome lines / her name:** `TEXT` at the top of `js/main.js`

### Adding your photos
- **Easiest:** replace `assets/images/photo1.jpg` to `photo4.jpg` with your own pictures (keep the names). Change the captions in the `PHOTOS` list in `js/surprises.js`. Add more by copying a line (`photo5.jpg`, ...).
- **On her phone:** the "Add a photo" button in Our Memories lets her add pictures herself. They are saved only on her phone (resized, in localStorage) and never uploaded.
- Keep photos around 900px wide / under 200KB each so it loads fast.

### Resetting progress (for testing)
Open the page, then in the browser console run `localStorage.removeItem('lw_thirandee_v1')` and reload.
