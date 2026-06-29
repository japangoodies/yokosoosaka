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

    raw_images = page.evaluate('''() => {
        let seen = {}, results = [];
        let article = document.querySelector('[role="article"]');
        if (!article) return results;
        // First: get images from photo album links (most reliable for product posts)
        article.querySelectorAll('a[href*="photo"]').forEach(a => {
            let img = a.querySelector('img');
            if (!img) return;
            let src = img.src || '';
            if (!src || src.includes('emoji')) return;
            if (!src.includes('fbcdn') && !src.includes('scontent')) return;
            // Skip small images (profile pics, reaction face thumbnails)
            if (img.naturalWidth < 300 && img.naturalHeight < 300) return;
            let base = src.split('?')[0];
            if (seen[base]) return;
            seen[base] = true;
            results.push(img.src);
        });
        // Fallback: any article image with meaningful size
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

    return {
        'url': url,
        'text': text.strip() if text else '',
        'images': raw_images or [],
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
