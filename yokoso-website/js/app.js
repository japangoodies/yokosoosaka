const DEFAULT_PRODUCTS = [
  { id: 1, name: "Nike Air Force 1 Low (Japan Exclusive)", category: "Shoes", price: "₱5,200", description: "Authentic Nike Air Force 1 Low from Japan. Limited Japan-exclusive colorway. Leather upper with Air-Sole cushioning. Sizes 7-12 US.", image: "images/products/placeholder.jpg" },
  { id: 2, name: "Nike Dunk Low Retro", category: "Shoes", price: "₱4,800", description: "Classic Nike Dunk Low in premium leather. Japan release. Available in multiple colors. Sizes 7-11 US.", image: "images/products/placeholder.jpg" },
  { id: 3, name: "Nike Air Max 90 (Japan Pack)", category: "Shoes", price: "₱5,500", description: "Nike Air Max 90 from the Japan-exclusive pack. Visible Air cushioning. Iconic silhouette. Sizes 7-12 US.", image: "images/products/placeholder.jpg" },
  { id: 4, name: "GU Fluffy Knit Sweater", category: "Clothing", price: "₱850", description: "Soft fluffy knit sweater from GU. Available in multiple colors. Perfect for cold season. Oversized relaxed fit.", image: "images/products/placeholder.jpg" },
  { id: 5, name: "Uniqlo Airism Oversized T-Shirt", category: "Clothing", price: "₱650", description: "Authentic Uniqlo Airism oversized t-shirt. Ultra-lightweight and breathable. Moisture-wicking fabric. Perfect for everyday use.", image: "images/products/placeholder.jpg" },
  { id: 6, name: "GU Wide Leg Pants", category: "Clothing", price: "₱950", description: "GU wide-leg pants. Comfortable and stylish. Premium cotton blend. Available in black, beige, and navy.", image: "images/products/placeholder.jpg" },
  { id: 7, name: "Uniqlo Light Down Jacket", category: "Clothing", price: "₱2,200", description: "Lightweight Uniqlo down jacket. Packable design. 750 fill power. Warm without being bulky. Water-repellent.", image: "images/products/placeholder.jpg" },
  { id: 8, name: "Japanese Biore UV Aqua Rich SPF50+", category: "Cosmetics", price: "₱550", description: "Biore UV Aqua Rich watery essence sunscreen. SPF50+ PA++++. Lightweight, non-sticky, refreshing finish. 80g.", image: "images/products/placeholder.jpg" },
  { id: 9, name: "Japanese Sheet Mask Variety Pack (10pcs)", category: "Cosmetics", price: "₱380", description: "Assorted Japanese facial sheet masks. Infused with collagen, hyaluronic acid, and vitamin C. 10-piece pack.", image: "images/products/placeholder.jpg" },
  { id: 10, name: "Heroine Make Waterproof Eyeliner", category: "Cosmetics", price: "₱480", description: "Japanese Heroine Make waterproof liquid eyeliner. Ultra-fine 0.1mm tip. Smudge-proof and long-lasting. Black.", image: "images/products/placeholder.jpg" },
  { id: 11, name: "Onitsuka Tiger Mexico 66", category: "Shoes", price: "₱3,800", description: "Classic Onitsuka Tiger Mexico 66 sneakers. Japan-exclusive colorway. Iconic design. Comfortable sole. Sizes 6-10 US.", image: "images/products/placeholder.jpg" },
  { id: 12, name: "GU Knit Cardigan", category: "Clothing", price: "₱1,100", description: "GU open-front knit cardigan. Soft acrylic blend. Oversized fit. Perfect layering piece for any outfit.", image: "images/products/placeholder.jpg" }
];

let products = [];
let editingId = null;
let currentCategory = 'all';
let currentSearch = '';
let selectedImageData = null;

function loadProducts() {
  try {
    const saved = localStorage.getItem('yokoso_products');
    if (saved) {
      products = JSON.parse(saved);
      return;
    }
  } catch {}
  products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  saveProducts();
}

function saveProducts() {
  localStorage.setItem('yokoso_products', JSON.stringify(products));
}

function getCategories() {
  return [...new Set(products.map(p => p.category))].sort();
}

function renderFilters() {
  const container = document.getElementById('filterContainer');
  const categories = getCategories();
  container.innerHTML = '<button class="filter-btn active" data-category="all">All</button>';
  categories.forEach(cat => {
    container.innerHTML += `<button class="filter-btn" data-category="${cat}">${cat}</button>`;
  });
}

document.getElementById('filterContainer').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = btn.dataset.category;
  renderProducts();
});

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  let filtered = products;
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/><text fill=%22%23999%22 font-size=%2216%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>'">
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}</div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const product = products.find(p => p.id === id);
      if (product) openModal(product);
    });
  });
}

function openModal(product) {
  document.getElementById('modalImage').src = product.image;
  document.getElementById('modalImage').onerror = function() {
    this.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/><text fill=%22%23999%22 font-size=%2216%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>";
  };
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalPrice').textContent = product.price;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalDesc').textContent = product.description;
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.querySelector('#productModal .modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.getElementById('searchInput').addEventListener('input', e => {
  currentSearch = e.target.value;
  renderProducts();
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('open');
});

// ---- ADMIN PANEL ----

function renderAdminList() {
  const container = document.getElementById('adminProductList');
  document.getElementById('productCount').textContent = products.length;
  if (products.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;padding:2rem">No products yet. Add your first product!</p>';
    return;
  }
  container.innerHTML = products.map(p => `
    <div class="admin-product-item" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect fill=%22%23333%22 width=%2248%22 height=%2248%22/><text fill=%22%23777%22 font-size=%2210%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22>No</text></svg>'">
      <div class="admin-product-item-info">
        <div class="name">${p.name}</div>
        <div class="meta">${p.category} · ${p.price}</div>
      </div>
      <div class="admin-product-item-actions">
        <button class="btn btn-secondary btn-sm edit-product-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-product-btn">Delete</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.admin-product-item').dataset.id);
      editProduct(id);
    });
  });
  container.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.admin-product-item').dataset.id);
      deleteProduct(id);
    });
  });
}

function resetForm() {
  editingId = null;
  document.getElementById('formTitle').textContent = 'Add Product';
  document.getElementById('formSubmitBtn').textContent = 'Add Product';
  document.getElementById('formCancelBtn').style.display = 'none';
  document.getElementById('productForm').reset();
  document.getElementById('formImagePreview').innerHTML = '';
  selectedImageData = null;
}

function populateForm(product) {
  editingId = product.id;
  document.getElementById('formTitle').textContent = 'Edit Product';
  document.getElementById('formSubmitBtn').textContent = 'Save Changes';
  document.getElementById('formCancelBtn').style.display = 'inline-block';
  document.getElementById('formName').value = product.name;
  document.getElementById('formCategory').value = product.category;
  document.getElementById('formPrice').value = product.price;
  document.getElementById('formDesc').value = product.description;
  if (product.image && !product.image.includes('placeholder')) {
    document.getElementById('formImagePreview').innerHTML = `<img src="${product.image}">`;
  } else {
    document.getElementById('formImagePreview').innerHTML = '';
  }
  selectedImageData = null;
  document.getElementById('formImage').value = '';
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) populateForm(product);
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderAdminList();
  renderFilters();
}

document.getElementById('productForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('formName').value.trim();
  const category = document.getElementById('formCategory').value.trim();
  const price = document.getElementById('formPrice').value.trim();
  const description = document.getElementById('formDesc').value.trim();
  if (!name || !category || !price || !description) return;

  const image = selectedImageData || (editingId
    ? (products.find(p => p.id === editingId)?.image || 'images/products/placeholder.jpg')
    : 'images/products/placeholder.jpg');

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, description, image };
    }
  } else {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    products.push({ id: maxId + 1, name, category, price, description, image });
  }

  saveProducts();
  resetForm();
  renderAdminList();
  renderFilters();
});

document.getElementById('formCancelBtn').addEventListener('click', resetForm);

document.getElementById('formImage').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    selectedImageData = ev.target.result;
    document.getElementById('formImagePreview').innerHTML = `<img src="${selectedImageData}">`;
  };
  reader.readAsDataURL(file);
});

// Import/Export
document.getElementById('exportBtn').addEventListener('click', () => {
  const data = JSON.stringify(products, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yokoso-products.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFileInput').click();
});

document.getElementById('importFileInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      if (data.length > 0 && !data[0].name) throw new Error('Invalid format');
      if (confirm(`Replace all ${products.length} products with ${data.length} imported products?`)) {
        products = data;
        saveProducts();
        resetForm();
        renderAdminList();
        renderFilters();
        renderProducts();
        alert('Products imported successfully!');
      }
    } catch {
      alert('Invalid JSON file. Please export a valid products file first.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// Navigation between public and admin view
document.getElementById('enterAdminBtn').addEventListener('click', () => {
  document.getElementById('maintenancePublic').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  renderAdminList();
});

document.getElementById('backToPublicBtn').addEventListener('click', () => {
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('maintenancePublic').style.display = 'block';
});

// ---- INIT ----
loadProducts();

async function init() {
  try {
    const res = await fetch('maintenance.json');
    const config = await res.json();
    if (config.enabled) {
      document.getElementById('maintenanceOverlay').classList.add('active');
      return;
    }
  } catch {}
  renderFilters();
  renderProducts();
}

init();
