# Agility Walk — GitHub + mobile install guide

This folder is a complete, installable app. Push it to GitHub, turn on
GitHub Pages, and open the link on your phone — it installs like a real
app icon and updates itself whenever you push new files.

## 1. Put it on GitHub

1. Create a new repository on GitHub (public repos get free Pages hosting).
2. Upload every file in this folder to the **root** of that repo:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
3. Commit / push.

## 2. Turn on GitHub Pages

1. In the repo: **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Branch: `main` (or whichever you used), Folder: `/ (root)`.
4. Save. GitHub gives you a URL like:
   `https://yourusername.github.io/your-repo-name/`
   (takes 1-2 minutes to go live the first time.)

## 3. Install it on your phone

- **Android (Chrome):** open the link → tap the **⋮** menu → **Add to
  Home screen** / **Install app**.
- **iPhone (Safari):** open the link → tap the **Share** icon → **Add to
  Home Screen**.

It now behaves like an installed app: its own icon, full-screen (no
browser bar), and it works offline once loaded.

## 4. Turning this into a real Android app (.apk)

I can't compile an Android APK myself — that needs the Android SDK and
build tools, which don't run in this environment. But once this is live
on GitHub Pages (step 2), turning it into a real installable Android app
takes about 5 minutes using a free tool, and **the same auto-update
system below still works inside it**, because the Android app is just a
thin wrapper that displays your live GitHub Pages URL:

1. Go to **https://www.pwabuilder.com**
2. Paste your GitHub Pages URL (`https://yourusername.github.io/your-repo-name/`)
3. Click **Package for stores → Android**
4. Download the generated `.apk` (or `.aab` for the Play Store) and
   install it on your phone (enable "install from unknown sources" if
   prompted), or upload it to the Play Store if you want to publish it
   properly.

Because that Android app just loads your GitHub Pages site, every time
you push new files and bump `CACHE_VERSION` in `sw.js` (see below), the
installed Android app will show the same **"Update available"** banner
and update itself — you never need to rebuild or resubmit the APK for
normal content/gameplay updates, only if you change the app's icon,
name, or permissions.

## 5. How the auto-update system works

`sw.js` is a service worker that saves the app to your phone so it opens
instantly and works offline. Every time you (or Claude) push changed
files to GitHub:

1. Next time you open the app, your phone quietly checks GitHub Pages
   for a new `sw.js`. Since its content changed, the browser downloads
   the new version of everything in the background — your current
   session keeps running on the old version, nothing interrupts you.
2. Once the new version is fully downloaded, a gold **"A new version of
   Agility Walk is ready"** banner appears at the top with an **Update**
   button.
3. Tap **Update** → the app activates the new version and reloads
   automatically. You're now on the latest build.

**Important:** the update banner only appears when `sw.js` itself is
different from what's cached, byte-for-byte. If you (or Claude) only
change `index.html` and forget to touch `sw.js`, phones that already
installed the app might not notice right away. To guarantee the banner
shows up, bump the version number at the top of `sw.js` every time you
push a new build:

```js
const CACHE_VERSION = "v2"; // bump this on every release
```

Each time Claude gives you an updated `index.html` (or any other file),
just also change that one line before you push, and every phone that
has the app installed will get the update prompt next time they open it.

## Notes

- **If GPS/walking doesn't work:** this almost always means the app is
  being opened as a local file instead of through your `https://` GitHub
  Pages link. Phones only allow GPS access on a secure (https) address —
  opening `index.html` directly from downloads/files will show a
  "GPS needs HTTPS" message and the character won't move. Make sure
  you completed step 2 (GitHub Pages) and are opening the
  `https://yourusername.github.io/...` link, not a local file. Also make
  sure you tapped "Allow" when your phone asked for location permission;
  the status pill under the top stats is tappable and will tell you the
  specific reason (permission denied, no fix yet, etc.) if it's red —
  tap it to retry after fixing.
- This app needs a real GPS signal outdoors — indoor/desktop GPS is
  usually too inaccurate to walk the character.
- Leaderboard, chat and friends currently store data locally on each
  device (a demo of the systems). Making those genuinely shared across
  everyone who installs the app needs a real backend server — ask
  Claude if you want help building that next.
