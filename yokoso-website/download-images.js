const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUT_DIR = path.join(__dirname, 'downloaded-images');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
let total = 0;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('data:')) {
      const match = url.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) { resolve(false); return; }
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      fs.writeFileSync(dest + '.' + ext, Buffer.from(match[2], 'base64'));
      resolve(true);
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const client = url.startsWith('https') ? https : http;
      client.get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) { resolve(false); return; }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const ext = path.extname(url) || '.jpg';
          fs.writeFileSync(dest + ext, Buffer.concat(chunks));
          resolve(true);
        });
      }).on('error', () => resolve(false));
      return;
    }
    const localPath = path.join(__dirname, url);
    if (fs.existsSync(localPath)) {
      const ext = path.extname(url) || '';
      fs.copyFileSync(localPath, dest + ext);
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

(async () => {
  for (const p of products) {
    const name = p.name.replace(/[^a-zA-Z0-9 \-_]/g, '').trim().slice(0, 40);
    if (!p.images || !p.images.length) continue;
    for (let i = 0; i < p.images.length; i++) {
      const url = p.images[i];
      const dest = path.join(OUT_DIR, `${p.id}_${name}_${i + 1}`);
      const ok = await download(url, dest);
      if (ok) total++;
    }
  }
  console.log('Done. Downloaded ' + total + ' images to ' + OUT_DIR);
})();
