// Cloudflare Worker — Firestore stock proxy
// Deploy via Cloudflare Dashboard > Workers & Pages > Create Worker
// or use: npx wrangler deploy (after `npm create cloudflare`)

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/japan-goodies/databases/(default)/documents';
const API_KEY = 'AIzaSyCR8jcz2JeDr3VYztZm2KYdns4uPUajtqQ';

async function firestoreGet(path) {
  const resp = await fetch(`${FIRESTORE_BASE}/${path}?key=${API_KEY}`);
  if (!resp.ok) return null;
  return resp.json();
}

async function firestorePatch(path, fields) {
  const keys = Object.keys(fields).join(',');
  const resp = await fetch(`${FIRESTORE_BASE}/${path}?key=${API_KEY}&updateMask.fieldPaths=${keys}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, { integerValue: String(v) }])
      )
    })
  });
  if (resp.ok) return true;
  // If 404, doc doesn't exist yet — create it
  if (resp.status === 404) return null; // signal to caller to create
  return false;
}

async function firestoreUpsert(docId, fields) {
  // Try PATCH first (update existing)
  const patchResult = await firestorePatch(`stocks/${docId}`, fields);
  if (patchResult === true) return true;
  // Doc doesn't exist — create with specific ID
  const body = {
    fields: Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, { integerValue: String(v) }])
    )
  };
  const resp = await fetch(`${FIRESTORE_BASE}/stocks?key=${API_KEY}&documentId=${docId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return resp.ok;
}

function parseStockDoc(doc) {
  if (!doc || !doc.fields || !doc.fields.quantity) return null;
  const match = doc.name.match(/\/stocks\/([^/]+)$/);
  return {
    id: match ? match[1] : null,
    quantity: parseInt(doc.fields.quantity.integerValue || doc.fields.quantity.stringValue, 10)
  };
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/+/, '');
  const parts = path.split('/').filter(Boolean);
  const origin = request.headers.get('Origin') || '*';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  try {
    if (request.method === 'GET' && parts.length === 1 && parts[0] === 'stocks') {
      const data = await firestoreGet('stocks');
      const docs = (data && data.documents) ? data.documents.map(parseStockDoc).filter(Boolean) : [];
      return new Response(JSON.stringify(docs), { headers: corsHeaders(origin) });
    }

    if (request.method === 'GET' && parts.length === 2 && parts[0] === 'stocks') {
      const data = await firestoreGet(`stocks/${parts[1]}`);
      const parsed = parseStockDoc(data);
      if (!parsed) return new Response(JSON.stringify({ quantity: null }), { headers: corsHeaders(origin) });
      return new Response(JSON.stringify(parsed), { headers: corsHeaders(origin) });
    }

    if (request.method === 'PUT' && parts.length === 2 && parts[0] === 'stocks') {
      const body = await request.json();
      const qty = parseInt(body.quantity, 10);
      if (isNaN(qty)) return new Response(JSON.stringify({ error: 'invalid quantity' }), { status: 400, headers: corsHeaders(origin) });
      await firestoreUpsert(parts[1], { quantity: qty });
      return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders(origin) });
    }

    if (request.method === 'POST' && parts.length === 3 && parts[0] === 'stocks' && parts[2] === 'decrement') {
      const body = await request.json().catch(() => ({}));
      const amount = parseInt(body.amount, 10) || 1;
      const data = await firestoreGet(`stocks/${parts[1]}`);
      let currentQty;
      if (data && data.fields && data.fields.quantity) {
        currentQty = parseInt(data.fields.quantity.integerValue || data.fields.quantity.stringValue, 10);
      }
      if (currentQty === undefined) {
        const initial = Math.max(0, 5 - amount);
        await firestoreUpsert(parts[1], { quantity: initial });
        return new Response(JSON.stringify({ quantity: initial }), { headers: corsHeaders(origin) });
      }
      currentQty = Math.max(0, currentQty - amount);
      await firestoreUpsert(parts[1], { quantity: currentQty });
      return new Response(JSON.stringify({ quantity: currentQty }), { headers: corsHeaders(origin) });
    }

    if (request.method === 'POST' && parts.length === 3 && parts[0] === 'stocks' && parts[2] === 'increment') {
      const body = await request.json().catch(() => ({}));
      const amount = parseInt(body.amount, 10) || 1;
      const data = await firestoreGet(`stocks/${parts[1]}`);
      let currentQty;
      if (data && data.fields && data.fields.quantity) {
        currentQty = parseInt(data.fields.quantity.integerValue || data.fields.quantity.stringValue, 10);
      }
      if (currentQty === undefined) {
        await firestoreUpsert(parts[1], { quantity: amount });
        return new Response(JSON.stringify({ quantity: amount }), { headers: corsHeaders(origin) });
      }
      currentQty += amount;
      await firestoreUpsert(parts[1], { quantity: currentQty });
      return new Response(JSON.stringify({ quantity: currentQty }), { headers: corsHeaders(origin) });
    }

    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: corsHeaders(origin) });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders(origin) });
  }
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
