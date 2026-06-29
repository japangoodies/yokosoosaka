import json, os, re, sys, base64, io, urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
from playwright.sync_api import sync_playwright

PROFILE_DIR = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Default')
CUSTOM_PROFILE = os.path.join(os.path.dirname(__file__), '.fb-scraper-profile')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8899

def get_context(p):
    try:
        return p.chromium.launch_persistent_context(
            PROFILE_DIR,
            headless=False,
            channel='chrome',
            args=['--disable-blink-features=AutomationControlled'],
            viewport={'width': 1280, 'height': 900},
        )
    except Exception:
        os.makedirs(CUSTOM_PROFILE, exist_ok=True)
        ctx = p.chromium.launch_persistent_context(
            CUSTOM_PROFILE,
            headless=False,
            args=['--disable-blink-features=AutomationControlled'],
            viewport={'width': 1280, 'height': 900},
        )
        print('Using fresh profile. Log into Facebook in the browser window.')
        input('Press Enter after logging in...')
        return ctx

def scrape_post(page, url):
    page.goto(url, timeout=60000, wait_until='domcontentloaded')
    page.wait_for_timeout(5000)
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    page.wait_for_timeout(3000)

    text = page.evaluate('''() => {
        let parts = [];
        document.querySelectorAll('[data-ad-preview="message"] *, [role="article"] [dir="auto"]')
            .forEach(el => {
                let t = (el.textContent || '').trim();
                if (t.length > 15) parts.push(t);
            });
        if (parts.length === 0) {
            let article = document.querySelector('[role="article"]');
            if (article) {
                article.querySelectorAll('p, span').forEach(el => {
                    let t = (el.textContent || '').trim();
                    if (t.length > 20) parts.push(t);
                });
            }
        }
        let unique = [...new Set(parts)];
        let filtered = unique.filter(t => !t.includes("'s Post") && !t.includes("'s Photo"));
        return filtered.join('\\n').substring(0, 5000);
    }''')

    # Extract images visible in the article
    article_images = page.evaluate('''() => {
        let seen = {}, results = [];
        let article = document.querySelector('[role="article"]');
        if (!article) return results;
        article.querySelectorAll('a[href*="photo"]').forEach(a => {
            let img = a.querySelector('img');
            if (!img) return;
            let src = img.src || '';
            if (!src || src.includes('emoji')) return;
            if (!src.includes('fbcdn') && !src.includes('scontent')) return;
            if (img.naturalWidth < 300 && img.naturalHeight < 300) return;
            let base = src.split('?')[0];
            if (seen[base]) return;
            seen[base] = true;
            results.push(img.src);
        });
        if (results.length === 0) {
            article.querySelectorAll('img').forEach(img => {
                let src = img.src || '';
                if (!src || src.includes('emoji')) return;
                if (!src.includes('fbcdn') && !src.includes('scontent')) return;
                if (src.includes('rsrc.php') || src.includes('static.xx')) return;
                if (img.naturalWidth < 150 || img.naturalHeight < 150) return;
                let base = src.split('?')[0];
                if (seen[base]) return;
                seen[base] = true;
                results.push(img.src);
            });
        }
        return results;
    }''')

    # Check if post has hidden photos (look for "+N" overlay in the article)
    has_hidden = page.evaluate('''() => {
        let article = document.querySelector('[role="article"]');
        if (!article) return false;
        let els = article.querySelectorAll('a, span, div');
        for (let el of els) {
            if (/^\\+\\d+$/.test(el.textContent.trim()) && el.offsetParent !== null) return true;
        }
        return false;
    }''')
    # Only enter the photo viewer if there are hidden photos behind the "+N" overlay
    viewer_urls = []
    if has_hidden:
        page.evaluate('''() => {
            let link = document.querySelector('a[href*="photo"][href*="set=pcb"]');
            if (link) link.click();
        }''')
        page.wait_for_timeout(3000)
        seen_bases = set()
        for _ in range(20):
            img_url = page.evaluate('''() => {
                let best = null;
                document.querySelectorAll('img').forEach(img => {
                    let src = img.src || '';
                    if (!src.includes('fbcdn') && !src.includes('scontent')) return;
                    if (src.includes('emoji') || src.includes('rsrc.php') || src.includes('static.xx')) return;
                    if (img.naturalWidth < 300 && img.naturalHeight < 300) return;
                    if (!best || img.naturalWidth > best['w']) best = { src: src, w: img.naturalWidth };
                });
                return best ? best['src'] : null;
            }''')
            if img_url:
                base = img_url.split('?')[0]
                if base not in seen_bases:
                    seen_bases.add(base)
                    viewer_urls.append(img_url)
            has_next = page.evaluate('''() => {
                let btn = document.querySelector('[aria-label="Next photo"]');
                if (btn && btn.offsetParent !== null) { btn.click(); return true; }
                return false;
            }''')
            if not has_next:
                break
            page.wait_for_timeout(2000)

    # Merge: article images first, then viewer images (deduplicated by base URL)
    all_seen = set()
    merged = []
    for url in article_images:
        base = url.split('?')[0]
        if base not in all_seen:
            all_seen.add(base)
            merged.append(url)
    for url in viewer_urls:
        base = url.split('?')[0]
        if base not in all_seen:
            all_seen.add(base)
            merged.append(url)

    return {
        'text': text.strip() if text else '',
        'raw_images': merged or [],
    }

def download_as_base64(url):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.facebook.com/',
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            ext = 'jpeg'
            ct = resp.headers.get('Content-Type', '')
            if 'png' in ct: ext = 'png'
            elif 'webp' in ct: ext = 'webp'
            elif 'gif' in ct: ext = 'gif'
            b64 = base64.b64encode(data).decode('ascii')
            return f'data:image/{ext};base64,{b64}'
    except Exception as e:
        print(f'  Image download failed: {e}')
        return None

def do_scrape(url):
    with sync_playwright() as p:
        context = get_context(p)
        page = context.new_page()
        result = scrape_post(page, url)
        context.close()

    urls = result['raw_images']
    print(f'Scraped {len(urls)} images. Downloading...')
    b64_images = []
    for u in urls:
        data = download_as_base64(u)
        if data:
            b64_images.append(data)
            print(f'  Downloaded & converted ({len(data)} chars)')

    return {
        'text': result['text'],
        'images': b64_images,
    }

class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path != '/scrape':
            self.send_json(404, {'error': 'Not found'})
            return
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length))
        url = body.get('url', '')
        if not url:
            self.send_json(400, {'error': 'Missing url'})
            return
        try:
            result = do_scrape(url)
            self.send_json(200, result)
        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_json(500, {'error': str(e)})

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())

    def log_message(self, format, *args):
        print(f'[fb-server] {args[0]} {args[1]}')

if __name__ == '__main__':
    print(f'Facebook Scraper Server running on http://localhost:{PORT}')
    print('Keep this window open. Start scraping from the admin panel.')
    HTTPServer(('localhost', PORT), Handler).serve_forever()
