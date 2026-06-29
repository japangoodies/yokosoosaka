import sys, json, os, re, urllib.request
from playwright.sync_api import sync_playwright

PROFILE_DIR = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Default')
CUSTOM_PROFILE = os.path.join(os.path.dirname(__file__), '.fb-scraper-profile')
OUT_DIR = os.path.join(os.path.dirname(__file__), 'fb-scraped')
SITE_URL = 'https://japangoodies.pages.dev'

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
        print('Using a fresh profile. Log in to Facebook and the admin panel, then press Enter.')
        input()
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

    viewer_urls = []
    entered = page.evaluate('''() => {
        let link = document.querySelector('a[href*="photo"][href*="set=pcb"]');
        if (link) { link.click(); return true; }
        return false;
    }''')
    if entered:
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
        'url': url,
        'text': text.strip() if text else '',
        'images': merged or [],
    }

def inject_to_admin(page, data):
    page.goto(SITE_URL, timeout=30000, wait_until='domcontentloaded')
    page.wait_for_timeout(2000)

    page.evaluate('''(d) => {
        localStorage.setItem('yokoso_import_caption', d.text);
        localStorage.setItem('yokoso_import_images', JSON.stringify(d.images));
        localStorage.setItem('yokoso_import_url', d.url);
        localStorage.setItem('yokoso_import_ready', '1');
    }''', data)

    page.goto(SITE_URL, timeout=30000, wait_until='domcontentloaded')

    print(f'\nAdmin panel ready at {SITE_URL} with import data loaded.')
    print('Log in with your admin account -> Import tab opens automatically.')

def download_images(images, folder):
    os.makedirs(folder, exist_ok=True)
    paths = []
    for i, url in enumerate(images):
        ext = '.jpg'
        m = re.search(r'\.(jpg|jpeg|png|webp)', url)
        if m: ext = '.' + m.group(1)
        fname = f'img_{i+1}{ext}'
        fpath = os.path.join(folder, fname)
        try:
            urllib.request.urlretrieve(url, fpath)
            paths.append(fpath)
            print(f'  Downloaded: {fname}')
        except Exception as e:
            print(f'  Failed {fname}: {e}')
    return paths

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else input('Facebook post URL: ')

    with sync_playwright() as p:
        context = get_context(p)
        page = context.new_page()

        data = scrape_post(page, url)

        json_path = os.path.join(OUT_DIR, 'post.json')
        os.makedirs(OUT_DIR, exist_ok=True)
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        img_folder = os.path.join(OUT_DIR, 'images')
        download_images(data['images'], img_folder)

        print(f'\nSaved to: {OUT_DIR}/')
        print(f'  Text: {len(data["text"])} chars')
        print(f'  Images: {len(data["images"])}')

        inject_to_admin(page, data)

        context.close()
