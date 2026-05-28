# JapanGoodies Project Status

## Repo
`japangoodies/yokosoosaka` → GitHub Pages: `japangoodies.github.io/yokosoosaka/yokoso-website/`
Pushed by user `noobita019`

## Firebase
Project: `japan-goodies` (Firestore), collection `yokoso`, doc `products`
Ad blocker blocks `firestore.googleapis.com` — Firebase writes silently fail
Now using committed `data/products.json` as primary source instead

## Data Flow (as of latest deploy)
**Priority**: `data/products.json` (file) → `localStorage` (only if `yokoso_pending_sync === 'true'`) → Firebase (fallback if available)

- `loadProducts()`: Fetches file via `fetch('data/products.json?_=' + Date.now())` → checks localStorage for `yokoso_pending_sync` flag → uses localStorage only if pending edits exist → falls back to defaults
- `loadCategories()`: Same pattern with `data/categories.json`
- `saveProducts()`: Saves to localStorage, sets `yokoso_pending_sync = 'true'`, tries Firebase, triggers `syncToGitHub()` if auto-sync enabled
- `syncToGitHub()`: PUTs `data/products.json` to repo via GitHub API, on success clears `yokoso_pending_sync = 'false'`
- Admin panel on login auto-detects unsynced localStorage data and migrates it

## GitHub Auto Sync
Requires user to create a Personal Access Token (classic, `repo` scope) from github.com/settings/tokens
Paste in admin → Auto Sync panel, check "Auto-sync on save"
CDN takes ~1-2 min to propagate after each sync

## Images
- Uploaded via admin panel → resized to 800px JPEG (quality 0.8) → stored as base64 data URLs in product data
- Stored inline in `data/products.json` → committed to repo via auto-sync
- Each image ~80-150KB as base64; repo stays under limits for typical pasabuy scale

## Recent Architecture Changes
- **Dynamic fullscreen viewer**: Created in JS at click-time (no static HTML), bypasses ad-blocker CSS rules
- **File-based data**: Products/categories in `data/*.json` (committed to repo), replaces Firebase as source of truth
- **GitHub API auto-sync**: Commits `data/products.json` directly on save (if token configured)
- **Cache busting**: Meta tags prevent HTML caching, `?_=timestamp` on data fetches

## Fullscreen Viewer (`#liveFullscreen`)
- Dynamic element created in `openFullscreen()`
- Vertical swipe (up/down) to navigate images
- X button with `touchstart` handler (bypasses swipe gesture)
- `history.pushState({fullscreen: true}, '', '#fullscreen')` for swipe-back → closes fullscreen, returns to modal
- `touch-action: none` on root and `overscroll-behavior: none` on body prevent browser edge-swipe-back
- `document.documentElement.style.touchAction = 'none'` during fullscreen
- `z-index: 99999`

## Modal
- Dynamic modal created in `openModal()` at click-time
- Image carousel with dots, prev/next buttons (`‹` `›`)
- `img#modalMainImg` created in HTML string, click handler sets `currentModalImages` + `currentImageIndex` then calls `openFullscreen()` directly

## Mobile CSS
- Compact filter bar: reduced padding (0.8rem), smaller buttons (0.3rem/0.75rem), tighter gaps
- Search input smaller (0.55rem/1rem, font 0.85rem)

## Known Files
- `yokoso-website/js/app.js` — All logic (~1428 lines)
- `yokoso-website/index.html` — Page structure
- `yokoso-website/css/style.css` — Styles
- `yokoso-website/data/products.json` — Committed product data
- `yokoso-website/data/categories.json` — Committed category config
- `yokoso-website/maintenance.js` — Maintenance mode toggle (`MAINTENANCE_MODE = false`)
- `yokoso-website/maintenance.json` — Maintenance settings

## Test Files (can be cleaned up)
- `yokoso-website/test-*.html` — Various test files created during debugging

## Credentials
- Admin password: `amped2016`
- Firebase API key: `AIzaSyCR8jcz2JeDr3VYztZm2KYdns4uPUajtqQ`
- GitHub: `japangoodies` org, `yokosoosaka` repo
