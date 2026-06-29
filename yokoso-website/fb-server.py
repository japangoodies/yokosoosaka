import json, os, re, sys
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

def scrape_post(url):
    with sync_playwright() as p:
        context = get_context(p)
        page = context.new_page()
        page.goto(url, timeout=60000, wait_until='domcontentloaded')
        page.wait_for_timeout(4000)
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        page.wait_for_timeout(2000)

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

        images = page.evaluate('''() => {
            let seen = {}, results = [];
            document.querySelectorAll('img').forEach(img => {
                let src = img.src || '';
                if (!src || src.includes('emoji')) return;
                if (!src.includes('fbcdn') && !src.includes('scontent')) return;
                if (src.includes('rsrc.php') || src.includes('static.xx') || src.match(/v\\/t39\\.99422/)) return;
                let base = src.split('?')[0];
                if (seen[base]) return;
                seen[base] = true;
                try { if (img.offsetParent !== null || img.complete) results.push(img.src); }
                catch(e) {}
            });
            return results;
        }''')

        context.close()
        return {
            'text': text.strip() if text else '',
            'images': images or [],
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
            result = scrape_post(url)
            self.send_json(200, result)
        except Exception as e:
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
