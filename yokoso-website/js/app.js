const DEFAULT_PRODUCTS = [
  { id: 1, name: "Nike Air Force 1 Low (Japan Exclusive)", category0: "MENS", category1: "Shoes", category2: "Nike", sizes: ["7", "8", "9", "10", "11", "12"], price: "₱5,200", description: "Authentic Nike Air Force 1 Low from Japan. Limited Japan-exclusive colorway. Leather upper with Air-Sole cushioning.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 2, name: "Nike Dunk Low Retro", category0: "MENS", category1: "Shoes", category2: "Nike", sizes: ["7", "8", "9", "10", "11"], price: "₱4,800", description: "Classic Nike Dunk Low in premium leather. Japan release. Available in multiple colors.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 3, name: "Nike Air Max 90 (Japan Pack)", category0: "MENS", category1: "Shoes", category2: "Nike", sizes: ["7", "8", "9", "10", "11", "12"], price: "₱5,500", description: "Nike Air Max 90 from the Japan-exclusive pack. Visible Air cushioning. Iconic silhouette.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 4, name: "GU Fluffy Knit Sweater", category0: "MENS", category1: "Clothing", category2: "GU", sizes: ["S", "M", "L", "XL"], price: "₱850", description: "Soft fluffy knit sweater from GU. Available in multiple colors. Perfect for cold season. Oversized relaxed fit.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 5, name: "Uniqlo Airism Oversized T-Shirt", category0: "MENS", category1: "Clothing", category2: "Uniqlo", sizes: ["S", "M", "L", "XL"], price: "₱650", description: "Authentic Uniqlo Airism oversized t-shirt. Ultra-lightweight and breathable. Moisture-wicking fabric.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 6, name: "GU Wide Leg Pants", category0: "MENS", category1: "Clothing", category2: "GU", sizes: ["S", "M", "L", "XL"], price: "₱950", description: "GU wide-leg pants. Comfortable and stylish. Premium cotton blend. Available in black, beige, and navy.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 7, name: "Uniqlo Light Down Jacket", category0: "MENS", category1: "Clothing", category2: "Uniqlo", sizes: ["S", "M", "L", "XL"], price: "₱2,200", description: "Lightweight Uniqlo down jacket. Packable design. 750 fill power. Warm without being bulky. Water-repellent.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 8, name: "Japanese Biore UV Aqua Rich SPF50+", category0: "WOMENS", category1: "Cosmetics", category2: "Biore", sizes: [], price: "₱550", description: "Biore UV Aqua Rich watery essence sunscreen. SPF50+ PA++++. Lightweight, non-sticky, refreshing finish. 80g.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 9, name: "Japanese Sheet Mask Variety Pack (10pcs)", category0: "WOMENS", category1: "Cosmetics", category2: "Generic", sizes: [], price: "₱380", description: "Assorted Japanese facial sheet masks. Infused with collagen, hyaluronic acid, and vitamin C. 10-piece pack.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 10, name: "Heroine Make Waterproof Eyeliner", category0: "WOMENS", category1: "Cosmetics", category2: "Heroine Make", sizes: [], price: "₱480", description: "Japanese Heroine Make waterproof liquid eyeliner. Ultra-fine 0.1mm tip. Smudge-proof and long-lasting. Black.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 11, name: "Onitsuka Tiger Mexico 66", category0: "MENS", category1: "Shoes", category2: "Onitsuka Tiger", sizes: ["6", "7", "8", "9", "10"], price: "₱3,800", description: "Classic Onitsuka Tiger Mexico 66 sneakers. Japan-exclusive colorway. Iconic design. Comfortable sole.", available: true, images: ["images/products/placeholder.svg"] },
  { id: 12, name: "GU Knit Cardigan", category0: "MENS", category1: "Clothing", category2: "GU", sizes: ["S", "M", "L", "XL"], price: "₱1,100", description: "GU open-front knit cardigan. Soft acrylic blend. Oversized fit. Perfect layering piece for any outfit.", available: true, images: ["images/products/placeholder.svg"] }
];

// Firebase
var fbDB = null;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp({
      apiKey: "AIzaSyCR8jcz2JeDr3VYztZm2KYdns4uPUajtqQ",
      authDomain: "japan-goodies.firebaseapp.com",
      projectId: "japan-goodies",
      storageBucket: "japan-goodies.firebasestorage.app",
      messagingSenderId: "768529751498",
      appId: "1:768529751498:web:b0a48ecd1e709a8a5f0333",
      measurementId: "G-EJ6NKSDDHE"
    });
    fbDB = firebase.firestore();
  }
} catch (e) {}
const FB_COLLECTION = 'yokoso';
const FB_DOC = 'products';
var STOCK_PROXY_URL = localStorage.getItem('yokoso_stock_proxy_url') || 'https://yokoso-stock-proxy.shayera019.workers.dev';

// ---- ACCOUNT ----
var currentUser = null;

function loadSession() {
  try {
    var d = localStorage.getItem('yokoso_account');
    if (d) currentUser = JSON.parse(d);
  } catch(e) {}
}
function saveSession(u) { currentUser = u; localStorage.setItem('yokoso_account', JSON.stringify(u)); updateAccountUI(); }

function promptForPhone(contact) {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = '<div style="background:#fff;border-radius:12px;padding:24px;max-width:360px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.2);text-align:center">' +
    '<h3 style="margin:0 0 8px;font-size:1.1rem">Enter Contact Number</h3>' +
    '<p style="margin:0 0 16px;font-size:0.85rem;color:#666">Please provide your contact number to complete your profile.</p>' +
    '<input type="tel" id="phonePromptInput" placeholder="09123456789" style="width:100%;padding:10px 12px;border:2px solid #e8e8ed;border-radius:8px;font-size:1rem;box-sizing:border-box;margin-bottom:12px">' +
    '<button id="phonePromptSave" style="width:100%;padding:10px;background:#e94560;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Save</button>' +
    '<button id="phonePromptSkip" style="width:100%;padding:8px;background:none;border:none;color:#888;font-size:0.85rem;cursor:pointer;margin-top:6px">Skip</button></div>';
  document.body.appendChild(modal);
  document.getElementById('phonePromptInput').focus();
  document.getElementById('phonePromptSave').onclick = function() {
    var phone = document.getElementById('phonePromptInput').value.trim();
    if (!phone) return;
    document.getElementById('phonePromptSave').textContent = 'Saving...';
    document.getElementById('phonePromptSave').disabled = true;
    savePhone(contact, phone, function() { modal.remove(); }, function() { document.getElementById('phonePromptSave').textContent = 'Save'; document.getElementById('phonePromptSave').disabled = false; });
  };
  document.getElementById('phonePromptSkip').onclick = function() { modal.remove(); };
}

function savePhone(contact, phone, cb, errCb) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts/update-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: contact, phone: phone })
  }).then(function(r) { return r.json(); }).then(function(j) {
    if (j.ok && currentUser) { currentUser.phone = phone; saveSession(currentUser); showCartNotification('Contact saved!'); }
    if (cb) cb();
  }).catch(function(e) {
    showCartNotification('Failed to save contact: ' + e.message);
    if (errCb) errCb(); else if (cb) cb();
  });
}
function clearSession() { currentUser = null; localStorage.removeItem('yokoso_account'); updateAccountUI(); }
function proxyAccountUrl(path) { var base = STOCK_PROXY_URL.replace(/\/+$/, ''); return base + '/accounts/' + path.replace(/^\//, ''); }
function updateAccountUI() {
  var loggedOut = document.getElementById('accountLoggedOut');
  var loggedIn = document.getElementById('accountLoggedIn');
  if (!loggedOut || !loggedIn) return;
  if (currentUser) {
    loggedOut.style.display = 'none'; loggedIn.style.display = 'block';
    var dn = document.getElementById('accountDetailName'); if (dn) dn.textContent = currentUser.name || '';
    var dc = document.getElementById('accountDetailContact'); if (dc) dc.textContent = currentUser.phone || currentUser.contact || '';
    var de = document.getElementById('accountDetailEmail'); if (de) de.textContent = currentUser.email || '';
    var da = document.getElementById('accountDetailAddress'); if (da) da.textContent = currentUser.address || '';
    if (dc) {
      var editBtn = dc.nextElementSibling;
      if (editBtn && editBtn.classList.contains('account-edit-contact')) {
        editBtn.style.display = currentUser.contact && currentUser.contact.indexOf('_') !== -1 ? 'inline-block' : 'none';
      }
    }
  } else {
    loggedOut.style.display = 'block'; loggedIn.style.display = 'none';
  }
}
function openAccountModal() {
  // Close cart if open
  var cartEl = document.getElementById('cartSlideout');
  var cartOv = document.getElementById('cartOverlay');
  if (cartEl && cartEl.classList.contains('active')) {
    cartEl.classList.remove('active');
    if (cartOv) cartOv.classList.remove('active');
    if (location.hash === '#cart') { try { history.back(); } catch (e) {} }
  }
  var m = document.getElementById('accountModal');
  if (m) {
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchAccountTab('login');
    requestAnimationFrame(function() {
      var el = document.getElementById('loginContact');
      if (el) el.focus();
      renderGoogleButton();
    });
  }
}
function closeAccountModal() {
  var m = document.getElementById('accountModal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}
function switchAccountTab(tab) {
  var lf = document.getElementById('accountLoginForm');
  var rf = document.getElementById('accountRegisterForm');
  var lt = document.getElementById('accountTabLogin');
  var rt = document.getElementById('accountTabRegister');
  var le = document.getElementById('accountLoginError');
  var re = document.getElementById('accountRegisterError');
  if (le) le.textContent = ''; if (re) re.textContent = '';
  if (tab === 'login') {
    if (lf) lf.style.display = 'block'; if (rf) rf.style.display = 'none';
    if (lt) lt.classList.add('active'); if (rt) rt.classList.remove('active');
    requestAnimationFrame(function() { var el = document.getElementById('loginContact'); if (el && el.focus) el.focus(); });
  } else {
    // Clear register form to prevent browser autofill
    var regFields = ['registerName','registerAddress','registerContact','registerEmail','registerPassword'];
    regFields.forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });
    if (lf) lf.style.display = 'none'; if (rf) rf.style.display = 'block';
    if (lt) lt.classList.remove('active'); if (rt) rt.classList.add('active');
    requestAnimationFrame(function() { var el = document.getElementById('registerName'); if (el && el.focus) el.focus(); });
  }
}
function handleCreateAccount() {
  var name = document.getElementById('registerName'); var address = document.getElementById('registerAddress');
  var contact = document.getElementById('registerContact'); var password = document.getElementById('registerPassword');
  var email = document.getElementById('registerEmail');
  var err = document.getElementById('accountRegisterError');
  if (!name || !address || !contact || !password) return;
  var n = name.value.trim(), a = address.value.trim(), c = contact.value.trim(), p = password.value, e = email ? email.value.trim() : '';
  if (!n || !a || !c || !p) { if (err) err.textContent = 'All fields are required.'; return; }
  if (err) err.textContent = 'Creating account...';
  fetch(proxyAccountUrl('create'), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:n,address:a,contact:c,password:p,email:e}) })
    .then(function(r){ return r.json(); })
    .then(function(j){
      if (j.ok) {
        saveSession({name:j.name, address:j.address, contact:j.contact, email: j.email || '', admin: false});
        localStorage.setItem('yokoso_account_credentials', JSON.stringify({name:j.name, address:j.address, contact:j.contact, email: j.email || '', password: p, admin: false}));
        closeAccountModal();
        showCartNotification('Account created! Welcome, ' + j.name + '!');
      } else {
        if (err) err.textContent = j.error || 'Failed to create account.';
      }
    })
    .catch(function(){ if (err) err.textContent = 'Network error. Please try again.'; });
}
function handleLogin() {
  var contact = document.getElementById('loginContact'); var password = document.getElementById('loginPassword');
  var err = document.getElementById('accountLoginError');
  if (!contact || !password) return;
  var c = contact.value.trim(), p = password.value;
  if (!c || !p) { if (err) err.textContent = 'Please enter contact number and password.'; return; }
  if (err) err.textContent = 'Logging in...';
  fetch(proxyAccountUrl('login'), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contact:c,password:p}) })
    .then(function(r){ return r.json(); })
    .then(function(j){
      if (j.ok) {
        saveSession({name:j.name, address:j.address, contact:j.contact, email: j.email || '', admin: j.admin || false});
        closeAccountModal();
        showCartNotification('Welcome back, ' + j.name + '!');
        if (j.admin) showAdminPanel();
      } else {
        // Fallback: if Firestore is unavailable (quota exceeded), try cached credentials
        if (j.error === 'Account not found' || j.error === 'Invalid password') {
          var creds = localStorage.getItem('yokoso_account_credentials');
          if (creds) {
            try {
              var d = JSON.parse(creds);
              if (d.contact === c && d.password === p) {
                saveSession({name:d.name, address:d.address, contact:d.contact, email:d.email || '', admin: d.admin || false});
                closeAccountModal();
                showCartNotification('Welcome back, ' + d.name + '! (offline mode)');
                if (d.admin) showAdminPanel();
                return;
              }
            } catch(e) {}
          }
        }
        if (err) err.textContent = j.error || 'Login failed.';
      }
    })
    .catch(function(){ if (err) err.textContent = 'Network error. Please try again.'; });
}
function handleLogout() {
  var name = currentUser ? currentUser.name : '';
  clearSession();
  var overlay = document.getElementById('maintenanceOverlay');
  if (overlay && overlay.classList.contains('active')) {
    overlay.classList.remove('active');
    document.getElementById('maintenancePublic').style.display = '';
    document.getElementById('adminPanel').style.display = 'none';
  }
  showCartNotification('Logged out' + (name ? ', ' + name : '') + '.');
}
function showCustomerOrders() {
  closeAccountModal();
  var overlay = document.getElementById('customerOrdersModal');
  var list = document.getElementById('customerOrdersList');
  if (!overlay || !list) return;
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  list.innerHTML = 'Loading...';
  if (!currentUser || !currentUser.email) { list.innerHTML = '<div style="color:#888;padding:20px;text-align:center">No email on file.</div>'; return; }
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders?customerEmail=' + encodeURIComponent(currentUser.email) + '&limit=100')
    .then(function(r) { return r.json(); })
    .then(function(j) {
      var orders = j.docs || [];
      if (!orders.length) { list.innerHTML = '<div style="color:#888;padding:20px;text-align:center">No orders yet.</div>'; return; }
      var html = orders.map(function(o) {
        var items = [];
        try { items = JSON.parse(o.items || '[]'); } catch(e) {}
        var itemsHtml = items.map(function(i) {
          var ip = parseFloat(String(i.price || '').replace(/[^0-9.\-]/g, ''));
          if (isNaN(ip)) ip = 0;
          return '<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:13px;border-bottom:1px solid #f0f0f0">' +
            '<span>' + escapeHtml(i.name) + (i.color ? ' (' + escapeHtml(i.color) + ')' : '') + (i.size && i.size !== 'q' ? '/' + i.size : '') + ' x' + i.qty + '</span>' +
            '<span>\u20b1' + (ip * i.qty).toFixed(2) + '</span></div>';
        }).join('');
        var statusColors = { pending: '#f59e0b', 'deposit-paid': '#3b82f6', confirmed: '#22c55e', cancelled: '#ef4444' };
        var statusColor = statusColors[o.status] || '#888';
        var totalVal = parseFloat(String(o.total || '').replace(/[^0-9.\-]/g, ''));
        if (isNaN(totalVal)) totalVal = items.reduce(function(s, it) { return s + (parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0) * (it.qty || 0); }, 0);
        var depVal = parseFloat(String(o.deposit || '').replace(/[^0-9.\-]/g, ''));
        return '<div style="border:1px solid #e0e0e0;border-radius:6px;padding:12px;margin-bottom:10px;background:#fafafa">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
          '<strong style="font-size:14px">' + escapeHtml(o.poNumber || '') + '</strong>' +
          '<span style="font-size:12px;background:' + statusColor + ';color:#fff;padding:2px 8px;border-radius:10px">' + escapeHtml(o.status || '') + '</span></div>' +
          '<div style="font-size:12px;color:#666;margin-bottom:6px">' + (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '') + '</div>' +
          itemsHtml +
          '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:bold;padding-top:4px;margin-top:4px;border-top:2px solid #e0e0e0">' +
          '<span>Total</span><span>\u20b1' + totalVal.toFixed(2) + '</span></div>' +
          (!isNaN(depVal) ? '<div style="display:flex;justify-content:space-between;font-size:12px;color:#666">' +
          '<span>Deposit</span><span>\u20b1' + depVal.toFixed(2) + '</span></div>' : '') +
          '</div>';
      }).join('');
      list.innerHTML = html;
    })
    .catch(function(e) { list.innerHTML = '<div style="color:#c00;padding:20px;text-align:center">Error loading orders: ' + escapeHtml(e.message || '') + '</div>'; });
}
function closeCustomerOrders() {
  var overlay = document.getElementById('customerOrdersModal');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// ---- END ACCOUNT ----

// ---- ADMIN USERS ----
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
  document.querySelectorAll('.admin-tab-content').forEach(function(c) { c.style.display = c.id === 'tab-' + tab ? 'block' : 'none'; });
  if (tab === 'categories') renderCategoryManagement();
  if (tab === 'orders') loadOrders();
  if (tab === 'users') loadUsers();
  if (tab === 'analytics') loadAnalytics();
  if (tab === 'config') { applyProxyUrl(); var gti = document.getElementById('githubTokenInput'); if (gti) gti.value = localStorage.getItem('github_token') || ''; var ast = document.getElementById('autoSyncToggle'); if (ast) ast.checked = localStorage.getItem('autoSyncEnabled') === 'true'; var mui = document.getElementById('messengerUrlInput'); if (mui) mui.value = categoriesConfig.messengerUrl || ''; var ccn = document.getElementById('cloudinaryCloudName'); if (ccn) ccn.value = categoriesConfig.cloudinaryCloudName || ''; var cup = document.getElementById('cloudinaryUploadPreset'); if (cup) cup.value = categoriesConfig.cloudinaryUploadPreset || ''; var tbt = document.getElementById('telegramBotToken'); if (tbt) tbt.value = localStorage.getItem('telegram_bot_token') || ''; var tci = document.getElementById('telegramChatId'); if (tci) tci.value = localStorage.getItem('telegram_chat_id') || ''; var gci = document.getElementById('googleClientId'); if (gci) gci.value = localStorage.getItem('google_client_id') || ''; }
  if (tab === 'products') renderAdminList();
  if (tab === 'import') { populateImportDropdowns(); checkBookmarkletData(); }
}
function loadUsers() {
  var list = document.getElementById('usersList');
  if (!list) return;
  list.innerHTML = 'Loading...';
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts?_=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(users) {
      if (!Array.isArray(users) || users.length === 0) {
        list.innerHTML = '<p style="color:#888">No registered users yet.</p>';
        return;
      }
      var html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 60px 120px;gap:4px;font-weight:600;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:#ff6b81;font-size:0.8rem">' +
        '<span>Name</span><span>Contact</span><span>Email</span><span>Address</span><span style="text-align:center">Admin</span><span style="text-align:center">Actions</span></div>';
      users.forEach(function(u) {
        var isAdmin = u.admin === true || u.admin === 'true';
        var escContact = u.contact.replace(/'/g, "\\'");
        html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 60px 120px;gap:4px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.8rem;align-items:center">' +
          '<span>' + (u.name || '-') + '</span>' +
          '<span>' + (u.contact || '-') + '</span>' +
          '<span>' + (u.email || '-') + '</span>' +
          '<span style="font-size:0.75rem;color:#aaa">' + (u.address || '-') + '</span>' +
          '<span style="text-align:center"><span style="color:' + (isAdmin ? '#4caf50' : '#666') + ';font-weight:' + (isAdmin ? '600' : '400') + '">' + (isAdmin ? 'Yes' : 'No') + '</span></span>' +
          '<span style="text-align:center;display:flex;gap:4px;justify-content:center">' +
          '<button onclick="toggleAdminRole(\'' + escContact + '\')" style="padding:2px 8px;border:none;border-radius:3px;background:' + (isAdmin ? '#e94560' : '#4caf50') + ';color:#fff;font-size:0.7rem;cursor:pointer">' + (isAdmin ? 'Demote' : 'Make Admin') + '</button>' +
          '<button onclick="deleteUser(\'' + escContact + '\')" style="padding:2px 8px;border:none;border-radius:3px;background:#c62828;color:#fff;font-size:0.7rem;cursor:pointer">Delete</button>' +
          '<button onclick="resetPassword(\'' + escContact + '\')" style="padding:2px 8px;border:none;border-radius:3px;background:#e94560;color:#fff;font-size:0.7rem;cursor:pointer">Reset</button></span></div>';
      });
      html += '<div style="margin-top:8px;font-size:0.75rem;color:#888">Total: ' + users.length + ' user(s)</div>';
      list.innerHTML = html;
    })
    .catch(function() {
      list.innerHTML = '<p style="color:#c62828">Failed to load users. Check worker connection.</p>';
    });
}
function toggleAdminRole(contact) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts/' + encodeURIComponent(contact) + '/admin', { method:'POST' })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok) {
        showToast('Admin role ' + (j.admin ? 'granted' : 'removed') + ' for ' + contact + '!', 'success');
        loadUsers();
      } else { showToast(j.error || 'Failed to toggle admin role.', 'error'); }
    })
    .catch(function() { showToast('Network error.', 'error'); });
}
function deleteUser(contact) {
  if (!confirm('Are you sure you want to delete user ' + contact + '? This cannot be undone.')) return;
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts/' + encodeURIComponent(contact), { method:'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok) {
        showToast('User ' + contact + ' deleted.', 'success');
        loadUsers();
      } else { showToast(j.error || 'Failed to delete user.', 'error'); }
    })
    .catch(function() { showToast('Network error.', 'error'); });
}
function resetPassword(contact) {
  var newPass = prompt('Enter new password for ' + contact + ':');
  if (!newPass || newPass.trim().length < 4) { showToast('Password must be at least 4 characters.', 'error'); return; }
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts/' + encodeURIComponent(contact) + '/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:newPass.trim()}) })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok) { showToast('Password reset successfully for ' + contact + '!', 'success'); loadUsers(); }
      else { showToast(j.error || 'Failed to reset password.', 'error'); }
    })
    .catch(function() { showToast('Network error.', 'error'); });
}
// ---- END ADMIN USERS ----

// ---- DEPOSIT & CHECKOUT ----
var depositPercent = 50;
var adminEmail = '';

function loadDepositConfig() {
  var saved = localStorage.getItem('yokoso_admin_email');
  if (saved) adminEmail = saved;
  fetch('maintenance.json?_=' + Date.now()).then(function(r) { return r.json(); }).then(function(d) {
    if (d && typeof d.depositPercent === 'number') depositPercent = d.depositPercent;
    if (d && d.adminEmail && !localStorage.getItem('yokoso_admin_email')) adminEmail = d.adminEmail;
    if (d && d.googleClientId) localStorage.setItem('google_client_id', d.googleClientId);
    if (d && d.telegramBotToken) localStorage.setItem('telegram_bot_token', d.telegramBotToken);
    if (d && d.telegramChatId) localStorage.setItem('telegram_chat_id', d.telegramChatId);
  }).catch(function() {});
}

function saveAdminEmail() {
  var input = document.getElementById('adminEmailInput');
  var status = document.getElementById('adminEmailStatus');
  if (!input || !status) return;
  var val = input.value.trim();
  if (!val) { status.textContent = 'Please enter an email.'; return; }
  adminEmail = val;
  localStorage.setItem('yokoso_admin_email', val);
  status.textContent = 'Saved!';
  setTimeout(function() { status.textContent = ''; }, 2000);
  showCartNotification('Admin email updated.');
}

function testAdminEmail() {
  var input = document.getElementById('adminEmailInput');
  var status = document.getElementById('adminEmailStatus');
  if (!input || !status) return;
  var val = input.value.trim();
  if (!val) { status.textContent = 'Please enter an email first.'; return; }
  status.textContent = 'Sending test email...';
  status.style.color = '#888';
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/cart/test-email?to=' + encodeURIComponent(val))
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok) {
        status.textContent = 'Test email sent via ' + (j.method || '?') + '! Check ' + val;
        status.style.color = '#2e7d32';
        showCartNotification('Test email sent! Check ' + val);
      } else {
        status.textContent = 'Failed: ' + (j.error || 'unknown error');
        status.style.color = '#c62828';
        showCartNotification('Test email failed: ' + (j.error || 'unknown error'));
      }
    })
    .catch(function(e) {
      status.textContent = 'Connection error: ' + (e.message || '');
      status.style.color = '#c62828';
      showCartNotification('Test email connection error');
    });
}

function renderMessengerLink() {
  var link = document.getElementById('messengerLink');
  if (link && categoriesConfig && categoriesConfig.messengerUrl) {
    link.href = categoriesConfig.messengerUrl;
  }
}

function saveCloudinarySettings() {
  var cloudNameInput = document.getElementById('cloudinaryCloudName');
  var presetInput = document.getElementById('cloudinaryUploadPreset');
  var status = document.getElementById('cloudinaryStatus');
  if (!cloudNameInput || !presetInput || !status) return;
  categoriesConfig.cloudinaryCloudName = cloudNameInput.value.trim();
  categoriesConfig.cloudinaryUploadPreset = presetInput.value.trim();
  saveCategoriesConfig();
  status.textContent = 'Saved!';
  setTimeout(function() { status.textContent = ''; }, 2000);
  showCartNotification('Cloudinary settings saved.');
}

function saveTelegramConfig() {
  var tokenInput = document.getElementById('telegramBotToken');
  var chatIdInput = document.getElementById('telegramChatId');
  var status = document.getElementById('telegramStatus');
  if (!tokenInput || !chatIdInput || !status) return;
  var token = tokenInput.value.trim();
  var chatId = chatIdInput.value.trim();
  if (token) localStorage.setItem('telegram_bot_token', token);
  else localStorage.removeItem('telegram_bot_token');
  if (chatId) localStorage.setItem('telegram_chat_id', chatId);
  else localStorage.removeItem('telegram_chat_id');
  status.textContent = 'Saved locally. Syncing to GitHub...';
  status.style.color = '#888';
  var ghToken = localStorage.getItem('github_token');
  if (!ghToken) { status.textContent = 'Saved locally only (no GitHub token).'; setTimeout(function() { status.textContent = ''; }, 3000); return; }
  fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + GITHUB_MAINTENANCE_PATH, {
    headers: { 'Authorization': 'token ' + ghToken }
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(function(data) {
    var content = decodeURIComponent(escape(atob(data.content)));
    var mainObj = JSON.parse(content);
    if (token) mainObj.telegramBotToken = token; else delete mainObj.telegramBotToken;
    if (chatId) mainObj.telegramChatId = chatId; else delete mainObj.telegramChatId;
    var newContent = JSON.stringify(mainObj, null, 2);
    var encoded = btoa(unescape(encodeURIComponent(newContent)));
    return fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + GITHUB_MAINTENANCE_PATH, {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + ghToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Update Telegram config', content: encoded, sha: data.sha })
    });
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(function() {
    status.textContent = 'Saved & synced to GitHub!';
    status.style.color = '#2e7d32';
    setTimeout(function() { status.textContent = ''; }, 3000);
  })
  .catch(function(err) {
    status.textContent = 'Sync failed: ' + (err.message || '');
    status.style.color = '#e94560';
    setTimeout(function() { status.textContent = ''; }, 4000);
  });
}

function saveSocialLoginConfig() {
  var gci = document.getElementById('googleClientId');
  var status = document.getElementById('socialLoginStatus');
  if (!gci || !status) return;
  var val = gci.value.trim();
  if (val) localStorage.setItem('google_client_id', val); else localStorage.removeItem('google_client_id');
  status.textContent = 'Saved locally. Syncing to GitHub...';
  status.style.color = '#888';
  initSocialLogin();
  var token = localStorage.getItem('github_token');
  if (!token) { status.textContent = 'Saved locally only (no GitHub token).'; setTimeout(function() { status.textContent = ''; }, 3000); return; }
  fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + GITHUB_MAINTENANCE_PATH, {
    headers: { 'Authorization': 'token ' + token }
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(function(data) {
    var content = decodeURIComponent(escape(atob(data.content)));
    var mainObj = JSON.parse(content);
    mainObj.googleClientId = val;
    var newContent = JSON.stringify(mainObj, null, 2);
    var encoded = btoa(unescape(encodeURIComponent(newContent)));
    return fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + GITHUB_MAINTENANCE_PATH, {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Update Google Client ID', content: encoded, sha: data.sha, branch: GITHUB_BRANCH })
    });
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    status.textContent = 'Saved to GitHub ✓';
    status.style.color = '#28a745';
    setTimeout(function() { status.textContent = ''; }, 3000);
    showCartNotification('Social login settings saved to GitHub.');
  })
  .catch(function(e) {
    status.textContent = 'Saved locally. GitHub sync: ' + e.message;
    setTimeout(function() { status.textContent = ''; }, 3000);
  });
}

function handleSocialLogin(provider, email, name, sub) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/accounts/social-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: provider, email: email, name: name, sub: sub })
  }).then(function(r) { return r.json(); }).then(function(j) {
    if (!j.ok || !j.contact) { showCartNotification('Social login failed: ' + (j.error || '')); return; }
    var isSocialContact = j.contact && j.contact.indexOf('_') !== -1;
    saveSession({ name: j.name, contact: j.contact, email: j.email || '', address: j.address || '', admin: j.admin || false, phone: j.phone || '' });
    closeAccountModal();
    showCartNotification('Logged in as ' + j.name);
    if (j.admin) showAdminPanel();
    if (isSocialContact && !j.phone) { promptForPhone(j.contact); }
  }).catch(function(e) {
    showCartNotification('Social login error: ' + (e.message || ''));
  });
}

function renderGoogleButton() {
  var gc = document.getElementById('googleButtonContainer');
  if (!gc) return;
  gc.innerHTML = '<button type="button" id="customGoogleBtn" style="display:inline-flex;align-items:center;gap:10px;padding:10px 24px;border:1px solid #dadce0;border-radius:20px;background:#fff;color:#3c4043;font-size:14px;font-weight:500;font-family:Roboto,Helvetica,Arial,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.08)">' +
    '<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.163-1.84H9v3.482h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>' +
    'Sign in with Google</button>';
  gc.style.cssText = 'display:flex!important;justify-content:center!important;width:100%!important';
  document.getElementById('customGoogleBtn')?.addEventListener('click', triggerGoogleSignIn);
}
function triggerGoogleSignIn() {
  var cid = localStorage.getItem('google_client_id');
  if (!cid) { showCartNotification('Google Client ID not configured.'); return; }
  if (typeof google === 'undefined') { showCartNotification('Google not loaded. Tap again.'); return; }
  if (!google.accounts) { showCartNotification('Google accounts not ready. Tap again.'); return; }
  // Try OAuth token client
  if (google.accounts.oauth2) {
    try {
      var tc = google.accounts.oauth2.initTokenClient({
        client_id: cid,
        scope: 'openid email profile',
        callback: function(resp) {
          if (resp.access_token) {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: 'Bearer ' + resp.access_token }
            }).then(function(r) { return r.json(); }).then(function(u) {
              if (u.email && u.name && u.sub) handleSocialLogin('google', u.email, u.name, u.sub);
            }).catch(function(e) { showCartNotification('Google sign-in error: ' + e.message); });
          }
        },
        error_callback: function(e) {
          if (e.type !== 'popup_closed' && e.type !== 'popup_blocked') showCartNotification('Google sign-in cancelled or failed.');
        }
      });
      tc.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch(e) { showCartNotification('Google oauth error: ' + e.message); return; }
  }
  // Fallback: One Tap prompt
  if (google.accounts.id) {
    try { google.accounts.id.prompt(); return; } catch(e) {}
  }
  showCartNotification('Google not available. Use email/password.');
}
function initSocialLogin() {
  var cid = localStorage.getItem('google_client_id');
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id && cid) {
    try {
      google.accounts.id.initialize({
        client_id: cid,
        callback: function(resp) {
          if (!resp || !resp.credential) return;
          try {
            var payload = JSON.parse(atob(resp.credential.split('.')[1]));
            if (payload.email && payload.name && payload.sub) {
              handleSocialLogin('google', payload.email, payload.name, payload.sub);
            }
          } catch(e) { console.error('Google login parse error:', e); }
        }
      });
    } catch(e) { setTimeout(initSocialLogin, 1000); }
  } else if (cid && typeof google === 'undefined') {
    setTimeout(initSocialLogin, 1000);
  }
}

setTimeout(initSocialLogin, 500);

function sendTelegramNotification(message) {
  var token = localStorage.getItem('telegram_bot_token');
  var chatId = localStorage.getItem('telegram_chat_id');
  if (!token || !chatId) return Promise.resolve();
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  return fetch(base + '/notifications/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token, chatId: chatId, message: message })
  }).then(function(r) { return r.json(); }).then(function(j) {
    if (!j.ok) console.error('Telegram error:', j.error);
    else console.log('Telegram sent');
  }).catch(function(e) { console.error('Telegram fetch failed:', e); });
}

function saveMessengerUrl() {
  var input = document.getElementById('messengerUrlInput');
  var status = document.getElementById('messengerUrlStatus');
  if (!input || !status) return;
  var val = input.value.trim();
  if (!val) { status.textContent = 'Please enter a URL.'; return; }
  categoriesConfig.messengerUrl = val;
  saveCategoriesConfig();
  renderMessengerLink();
  status.textContent = 'Saved!';
  setTimeout(function() { status.textContent = ''; }, 2000);
  showCartNotification('Messenger URL updated.');
}

function getDepositAmount() {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) continue;
    var product = products.find(function(p) { return p.id === item.id; });
    if (product && product.deposit !== undefined && product.deposit !== '') {
      var d = parseFloat(String(product.deposit).replace(/[^0-9.]/g, ''));
      if (!isNaN(d)) { total += d * item.qty; continue; }
    }
    total += price * item.qty * depositPercent / 100;
  }
  return total;
}

var _checkoutPO = '';

function generatePO() {
  var d = new Date();
  var date = d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  var rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return 'PO-' + date + '-' + rand;
}

function handleCheckout() {
  if (!currentUser) {
    showCartNotification('Please login or create an account first.');
    openAccountModal();
    return;
  }
  if (!cart || cart.length === 0) return;
  _checkoutPO = generatePO();
  // Close cart, show review modal
  toggleCart();
  showCheckoutReview();
}

function showCheckoutReview() {
  var modal = document.getElementById('checkoutModal');
  if (!modal) return;
  var itemsEl = document.getElementById('checkoutItems');
  var totalEl = document.getElementById('checkoutTotal');
  var depositEl = document.getElementById('checkoutDeposit');
  var poEl = document.getElementById('checkoutPONumber');
  var headerEl = document.getElementById('checkoutHeader');
  var actionsEl = document.getElementById('checkoutActions');
  var noteEl = document.getElementById('checkoutNote');
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(function(item) {
      var price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      var sub = isNaN(price) ? item.price : '₱' + (price * item.qty).toFixed(2);
      return '<div class="checkout-item"><span class="checkout-item-name">' + item.name + (item.color ? ' (' + item.color + ')' : '') + (item.size ? ' · ' + item.size : '') + '</span><span class="checkout-item-qty">x' + item.qty + '</span><span class="checkout-item-price">' + sub + '</span></div>';
    }).join('');
  }
  var total = getCartTotal();
  var deposit = getDepositAmount();
  if (totalEl) totalEl.textContent = '₱' + total.toFixed(2);
  if (depositEl) depositEl.textContent = '₱' + deposit.toFixed(2);
  if (poEl) poEl.textContent = _checkoutPO;
  if (headerEl) headerEl.innerHTML = '<h3 style="margin:0">Review Your Order</h3>';
  if (noteEl) noteEl.textContent = 'Customer: ' + (currentUser ? currentUser.name : 'N/A') + ' | Contact: ' + (currentUser ? currentUser.contact : 'N/A');
  if (actionsEl) {
    actionsEl.innerHTML = '<button class="checkout-btn checkout-btn-confirm" onclick="placeOrder()" style="background:#2e7d32;color:#fff;border:none;padding:0.7rem 1.5rem;border-radius:8px;font-size:1rem;cursor:pointer;width:100%">Place Order</button>';
  }
  modal.style.display = 'flex';
  lockBody();
}

function placeOrder() {
  _orderSnapshot = { items: cart.slice(), total: getCartTotal(), deposit: getDepositAmount() };
  sendOrderEmail();
  saveOrder();
  cart = [];
  saveCart();
  renderCart();
  // Switch to success view
  var headerEl = document.getElementById('checkoutHeader');
  var actionsEl = document.getElementById('checkoutActions');
  var noteEl = document.getElementById('checkoutNote');
  if (headerEl) headerEl.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="#2e7d32" stroke="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><h3 style="margin:0">Order Submitted!</h3>';
  if (noteEl) noteEl.innerHTML = 'Please <strong>message us to confirm stock availability</strong> before making payment. Stock is reserved only once the deposit is confirmed. Prices are subject to change without prior notice.';
  if (actionsEl) {
    actionsEl.innerHTML =
      '<button class="checkout-btn checkout-btn-copy" onclick="copyOrderDetails()">📋 Copy Order Details</button>' +
      '<button class="checkout-btn checkout-btn-msg" onclick="messageOrderDetails()">💬 Message Us on Messenger</button>';
  }
}

function closeCheckoutModal() {
  var modal = document.getElementById('checkoutModal');
  if (modal) { modal.style.display = 'none'; unlockBody(); }
}

function getOrderText() {
  var snap = _orderSnapshot || { items: [], total: 0, deposit: 0 };
  var items = snap.items.length ? snap.items : cart;
  var lines = ['🛍 PURCHASE ORDER', '━━━━━━━━━━━━━━━━━━', 'PO Number: ' + _checkoutPO, 'Date: ' + new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}), '', 'CUSTOMER:'];
  lines.push('Name: ' + ((currentUser && currentUser.name) || 'N/A'));
  lines.push('Contact: ' + ((currentUser && currentUser.contact) || 'N/A'));
  if (currentUser && currentUser.email) lines.push('Email: ' + currentUser.email);
  if (currentUser && currentUser.address) lines.push('Address: ' + currentUser.address);
  lines.push('', 'ITEMS:');
  items.forEach(function(item, i) {
    var price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    var sub = isNaN(price) ? item.price : '₱' + (price * item.qty).toFixed(2);
    lines.push((i + 1) + '. ' + item.name + (item.color ? ' (' + item.color + ')' : '') + (item.size ? ' Size ' + item.size : '') + ' x' + item.qty + ' = ' + sub);
  });
  var total = snap.total || getCartTotal();
  var deposit = snap.deposit || getDepositAmount();
  lines.push('', 'Total: ₱' + total.toFixed(2), 'Deposit: ₱' + deposit.toFixed(2));
  return lines.join('\n');
}

function copyOrderDetails() {
  var text = getOrderText();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() { showCopied(); }).catch(function() { fallbackCopy(text); });
  } else { fallbackCopy(text); }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showCopied(); } catch(e) {}
  document.body.removeChild(ta);
}

function showCopied() {
  var el = document.getElementById('checkoutCopied');
  if (!el) return;
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 2000);
}

function messageOrderDetails() {
  var url = (categoriesConfig && categoriesConfig.messengerUrl) || 'https://m.me/61591559623253';
  window.open(url, '_blank');
}

function emailOrderDetails() {
  if (!adminEmail) { showCartNotification('Admin email not configured.'); return; }
  var text = getOrderText();
  var mailto = 'mailto:' + adminEmail + '?subject=' + encodeURIComponent('Purchase Order ' + _checkoutPO) + '&body=' + encodeURIComponent(text);
  window.location.href = mailto;
}

function sendOrderEmail() {
  if (!adminEmail) return;
  if (!adminEmail) return;
  var text = getOrderText();
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/cart/send-order', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({adminEmail:adminEmail, customerEmail:'', subject:'Purchase Order ' + _checkoutPO, text:text}) })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.results) {
        var sent = j.results.filter(function(r) { return r.method; }).length;
        var failed = j.results.filter(function(r) { return r.error; });
        if (sent > 0) {
          showCartNotification('Order confirmation sent to admin.');
        } else if (failed.length > 0) {
          showCartNotification('Auto-email not configured. Use Copy/Email/Messenger buttons below to send manually.');
          console.log('[Checkout] Email send not configured (set RESEND_API_KEY, EMAIL binding, or MAILGUN_API_KEY in worker)');
        }
      }
    })
    .catch(function(e) { console.log('[Checkout] Email send error:', e); });
}

function saveOrder() {
  if (!cart || cart.length === 0) return;
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  var items = cart.map(function(item) {
    return { id: item.id, name: item.name, color: item.color || '', size: item.size || '', qty: item.qty, price: parseFloat(String(item.price || '').replace(/[^0-9.\-]/g, '')) || 0 };
  });
  var total = getCartTotal();
  var deposit = getDepositAmount();
  var orderTotalStr = '₱' + total.toFixed(2);
  var orderDepositStr = '₱' + deposit.toFixed(2);
  fetch(base + '/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      poNumber: _checkoutPO,
      items: items,
      customerName: (currentUser && currentUser.name) || '',
      customerEmail: (currentUser && currentUser.email) || '',
      customerContact: (currentUser && (currentUser.phone || currentUser.contact)) || '',
      total: orderTotalStr,
      deposit: orderDepositStr
    })
  }).then(function(r) {
    r.text().then(function(body) {
      if (!r.ok) {
        console.log('[Order] save failed:', r.status, body);
        showCartNotification('Order save failed (HTTP ' + r.status + ')');
      } else {
        showCartNotification('Order saved!');
        var orderMsg = '<b>New Order!</b>\n\nPO: ' + _checkoutPO + '\nCustomer: ' + ((currentUser && currentUser.name) || 'N/A') + '\nEmail: ' + ((currentUser && currentUser.email) || 'N/A') + '\nContact: ' + ((currentUser && currentUser.contact) || 'N/A') + '\nItems:\n' + items.map(function(i) { return '  \u2022 ' + i.name + ' (' + (i.color || '') + (i.size && i.size !== 'q' ? ', ' + i.size : '') + ') x' + i.qty + ' = \u20b1' + (i.price * i.qty).toFixed(2); }).join('\n') + '\n\nTotal: ' + orderTotalStr + '\nDeposit: ' + orderDepositStr;
        sendTelegramNotification(orderMsg);
      }
    });
  }).catch(function(e) {
    console.log('[Order] fetch error:', e); showCartNotification('Order save error: ' + (e.message || ''));
  });
}

function releaseExpiredOrders() {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders/release-expired', { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok && j.released && j.released.length > 0) {
        console.log('[Orders] Released expired:', j.released);
      }
    })
    .catch(function(e) {
      console.log('[Orders] Release expired error:', e);
    });
}

var tabBtns = document.querySelectorAll('.admin-tab-btn');
tabBtns.forEach(function(b) { b.addEventListener('click', function() { switchAdminTab(this.dataset.tab); }); });

var ordersPage = 1;
var ordersLimit = 50;
var ordersTotal = 0;

function loadOrders() {
  var el = document.getElementById('ordersList');
  if (!el) return;
  el.innerHTML = 'Loading...';
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  var filterEl = document.getElementById('ordersFilterStatus');
  var filter = filterEl ? filterEl.value : 'all';
  var url = base + '/orders?_=' + Date.now() + '&page=' + ordersPage + '&limit=' + ordersLimit + '&status=' + encodeURIComponent(filter);
  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(j) {
      ordersTotal = j.count || 0;
      if (j.docs && j.docs.length === 0 && ordersTotal > 0 && ordersPage > 1) {
        ordersPage = 1;
        loadOrders();
        return;
      }
      renderOrders(j.docs || []);
    })
    .catch(function(e) { el.innerHTML = 'Error loading orders: ' + (e.message || ''); });
}

function renderOrders(orders) {
  var el = document.getElementById('ordersList');
  if (!el) return;
  var countEl = document.getElementById('ordersCount');
  if (countEl) countEl.textContent = ordersTotal + ' order(s) — Page ' + ordersPage + ' of ' + Math.max(1, Math.ceil(ordersTotal / ordersLimit));
  if (!orders || orders.length === 0) { el.innerHTML = '<div style="color:#888;text-align:center;padding:20px">No orders yet.</div>' + paginationHtml(); return; }
  var html = '<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:700px">';
  html += '<thead><tr style="background:rgba(255,255,255,0.08);text-align:left;color:#ff6b81">' +
    '<th style="padding:8px 10px">PO#</th>' +
    '<th style="padding:8px 10px">Date</th>' +
    '<th style="padding:8px 10px">Customer</th>' +
    '<th style="padding:8px 10px">Contact</th>' +
    '<th style="padding:8px 10px">Items</th>' +
    '<th style="padding:8px 10px">Total</th>' +
    '<th style="padding:8px 10px">Deposit</th>' +
    '<th style="padding:8px 10px">Status</th>' +
    '<th style="padding:8px 10px">Action</th></tr></thead><tbody>';
  orders.forEach(function(o) {
    var items = [];
    try { items = JSON.parse(o.items || '[]'); } catch(e) {}
    var itemSummary = items.map(function(i) { return (i.name || '').substring(0, 20) + ' x' + (i.qty || 1); }).join(', ');
    var created = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—';
    var statusBadge = '';
    var statusColor = '';
    if (o.status === 'pending') { statusBadge = 'Pending'; statusColor = '#f57f17'; }
    else if (o.status === 'deposit_paid') { statusBadge = 'Deposit Paid'; statusColor = '#1976d2'; }
    else if (o.status === 'confirmed') { statusBadge = 'Confirmed'; statusColor = '#2e7d32'; }
    else if (o.status === 'cancelled') { statusBadge = 'Cancelled'; statusColor = '#c62828'; }
    else { statusBadge = o.status || '—'; statusColor = '#888'; }
    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">';
    html += '<td style="padding:8px 10px;color:#ff6b81;font-weight:600">' + (o.id || o.poNumber || '—') + '</td>';
    html += '<td style="padding:8px 10px">' + created + '</td>';
    html += '<td style="padding:8px 10px">' + (o.customerName || '—') + '</td>';
    html += '<td style="padding:8px 10px">' + (o.customerContact || '—') + '</td>';
    html += '<td style="padding:8px 10px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + itemSummary.replace(/"/g, '&quot;') + '">' + itemSummary + '</td>';
    html += '<td style="padding:8px 10px;font-weight:600">' + (o.total || '—') + '</td>';
    html += '<td style="padding:8px 10px">' + (o.deposit || '—') + '</td>';
    html += '<td style="padding:8px 10px"><span style="display:inline-block;padding:2px 8px;border-radius:10px;background:' + statusColor + '20;color:' + statusColor + ';font-weight:600;font-size:11px">' + statusBadge + '</span></td>';
    html += '<td style="padding:8px 10px;white-space:nowrap">';
    var poSafe = o.id.replace(/'/g, "\\'");
    if (o.status === 'pending') {
      html += '<button onclick="event.stopPropagation();depositPaidOrder(\'' + poSafe + '\')" style="padding:3px 8px;background:#1976d2;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:11px;margin-right:4px">Deposit Paid</button>';
      html += '<button onclick="event.stopPropagation();cancelOrder(\'' + poSafe + '\')" style="padding:3px 8px;background:#c62828;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:11px">Cancel</button>';
    } else if (o.status === 'deposit_paid') {
      html += '<button onclick="event.stopPropagation();confirmOrder(\'' + poSafe + '\')" style="padding:3px 8px;background:#2e7d32;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:11px;margin-right:4px">Confirm</button>';
      html += '<button onclick="event.stopPropagation();cancelOrder(\'' + poSafe + '\')" style="padding:3px 8px;background:#c62828;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:11px">Cancel</button>';
    }
    html += '</td></tr>';
  });
  html += '</tbody></table>';
  html += paginationHtml();
  el.innerHTML = html;
  el.querySelectorAll('tbody tr').forEach(function(row) {
    var po = row.querySelector('td:first-child')?.textContent;
    if (po) row.style.cursor = 'pointer';
    row.addEventListener('click', function(e) {
      if (e.target.closest('button')) return;
      var poNum = this.querySelector('td:first-child')?.textContent;
      if (poNum) showOrderDetail(poNum);
    });
  });
}

function showOrderDetail(poNumber) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders/' + encodeURIComponent(poNumber) + '?_=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(order) {
      if (!order || order.error) { showToast('Order not found.', 'info'); return; }
      var items = [];
      try { items = JSON.parse(order.items || '[]'); } catch(e) {}
      var statusColor = '';
      var statusLabel = order.status || '—';
      if (order.status === 'pending') statusColor = '#f57f17';
      else if (order.status === 'deposit_paid') statusColor = '#1976d2';
      else if (order.status === 'confirmed') statusColor = '#2e7d32';
      else if (order.status === 'cancelled') statusColor = '#c62828';
      else statusColor = '#888';
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.addEventListener('click', function(e) { if (e.target === this) this.remove(); });
      var poEnc = order.id;
      overlay.innerHTML = '<div style="background:#1a1a2e;color:#eee;border-radius:12px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;padding:24px 28px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3)">' +
        '<button class="order-modal-close" style="position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.1);border:none;font-size:22px;cursor:pointer;color:#aaa;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center">×</button>' +
        '<h2 style="font-size:18px;margin:0 0 4px;color:#ff6b81">' + (order.id || poNumber) + '</h2>' +
        '<span style="display:inline-block;padding:2px 10px;border-radius:10px;background:' + statusColor + '20;color:' + statusColor + ';font-weight:600;font-size:12px;margin-bottom:16px">' + statusLabel + '</span>' +
        '<div style="margin-bottom:16px">' +
          '<p style="margin:2px 0;font-size:13px;color:#aaa">' + (order.createdAt ? new Date(order.createdAt).toLocaleString() : '—') + '</p>' +
          '<p style="margin:4px 0;font-size:14px"><strong>' + (order.customerName || '—') + '</strong></p>' +
          (order.customerContact ? '<p style="margin:2px 0;font-size:13px;color:#ccc">📞 ' + order.customerContact + '</p>' : '') +
          (order.customerEmail ? '<p style="margin:2px 0;font-size:13px;color:#ccc">✉️ ' + order.customerEmail + '</p>' : '') +
          (order.customerAddress ? '<p style="margin:2px 0;font-size:13px;color:#ccc">📍 ' + order.customerAddress + '</p>' : '') +
        '</div>' +
        '<div style="border-top:1px solid rgba(255,255,255,0.1);padding:12px 0">' +
          '<div style="font-size:13px;font-weight:600;color:#ff6b81;margin-bottom:8px">Items</div>' +
          items.map(function(i, idx) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
              '<div style="flex:1;font-size:13px">' +
                '<div>' + (i.name || '—') + '</div>' +
                '<div style="font-size:11px;color:#888">' +
                  (i.color ? i.color : '') +
                  (i.size ? ' · ' + i.size : '') +
                '</div>' +
              '</div>' +
              '<div style="text-align:right;font-size:13px">' +
                '<div>x' + (i.qty || 1) + '</div>' +
                '<div style="color:#ff6b81">' + (i.price || '') + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div style="border-top:1px solid rgba(255,255,255,0.1);padding:12px 0;display:flex;justify-content:space-between;font-size:14px">' +
          '<div><strong>Total</strong></div><div>' + (order.total || '—') + '</div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding-bottom:12px">' +
          '<div><strong>Deposit</strong></div><div style="color:#4fc3f7">' + (order.deposit || '—') + '</div>' +
        '</div>' +
        '<div class="order-modal-actions" style="display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.1);padding-top:14px">' +
        '</div>' +
      '</div>';
      document.body.appendChild(overlay);
      var actionsDiv = overlay.querySelector('.order-modal-actions');
      if (actionsDiv) {
        if (order.status === 'pending') {
          addOrderActionBtn(actionsDiv, 'Mark Deposit Paid', '#1976d2', function() { overlay.remove(); depositPaidOrder(poEnc); });
          addOrderActionBtn(actionsDiv, 'Cancel Order', '#c62828', function() { overlay.remove(); cancelOrder(poEnc); });
        } else if (order.status === 'deposit_paid') {
          addOrderActionBtn(actionsDiv, 'Confirm Order', '#2e7d32', function() { overlay.remove(); confirmOrder(poEnc); });
          addOrderActionBtn(actionsDiv, 'Cancel Order', '#c62828', function() { overlay.remove(); cancelOrder(poEnc); });
        }
      }
      var closeBtn = overlay.querySelector('.order-modal-close');
      if (closeBtn) closeBtn.addEventListener('click', function() { overlay.remove(); });
    })
    .catch(function(e) { showToast('Error loading order: ' + (e.message || ''), 'error'); });
}

function addOrderActionBtn(container, label, color, onClick) {
  var btn = document.createElement('button');
  btn.textContent = label;
  btn.style.cssText = 'padding:8px 20px;background:' + color + ';color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600';
  btn.addEventListener('click', onClick);
  container.appendChild(btn);
}

function productPaginationHtml(totalPages) {
  if (totalPages <= 1) return '';
  return '<div style="display:flex;justify-content:center;align-items:center;gap:12px;padding:12px 0">' +
    '<button onclick="productsPage=Math.max(1,productsPage-1);renderAdminList()" style="padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px"' + (productsPage <= 1 ? ' disabled style="opacity:0.4;padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;font-size:12px"' : '') + '>‹ Prev</button>' +
    '<span style="font-size:12px;color:#aaa">' + productsPage + ' / ' + totalPages + '</span>' +
    '<button onclick="productsPage=Math.min(' + totalPages + ',productsPage+1);renderAdminList()" style="padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px"' + (productsPage >= totalPages ? ' disabled style="opacity:0.4;padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;font-size:12px"' : '') + '>Next ›</button>' +
    '</div>';
}

function paginationHtml() {
  var totalPages = Math.max(1, Math.ceil(ordersTotal / ordersLimit));
  if (totalPages <= 1) return '';
  return '<div style="display:flex;justify-content:center;align-items:center;gap:12px;padding:12px 0">' +
    '<button onclick="ordersPage=Math.max(1,ordersPage-1);loadOrders()" style="padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px"' + (ordersPage <= 1 ? ' disabled style="opacity:0.4;padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;font-size:12px"' : '') + '>‹ Prev</button>' +
    '<span style="font-size:12px;color:#aaa">' + ordersPage + ' / ' + totalPages + '</span>' +
    '<button onclick="ordersPage=Math.min(totalPages,ordersPage+1);loadOrders()" style="padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px"' + (ordersPage >= totalPages ? ' disabled style="opacity:0.4;padding:4px 12px;background:#555;color:#fff;border:none;border-radius:4px;font-size:12px"' : '') + '>Next ›</button>' +
    '</div>';
}

function depositPaidOrder(poNumber) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders/' + encodeURIComponent(poNumber))
    .then(function(r) { return r.json(); })
    .then(function(order) {
      if (!order || order.error) { showCartNotification('Order not found'); return; }
      var items = [];
      try { items = JSON.parse(order.items || '[]'); } catch(e) {}
      if (!items.length) { showCartNotification('No items in order'); return; }
      // Fetch stock for all products in one bulk call
      var productIds = [];
      items.forEach(function(item) {
        var id = parseInt(item.id || item.productId || 0);
        if (id && productIds.indexOf(id) === -1) productIds.push(id);
      });
      fetch(proxyUrl('stocks'))
        .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(docs) {
          if (Array.isArray(docs)) {
            docs.forEach(function(doc) {
              if (doc && doc.id && productIds.indexOf(parseInt(doc.id)) !== -1) {
                applyStockDoc(doc);
              }
            });
          }
          // Check stock for every item
          var shortItems = [];
          items.forEach(function(item) {
            var p = products.find(function(x) { return x.id === parseInt(item.id || item.productId || 0); });
            if (!p) return;
            var color = item.color || '';
            if (!color) { var colors = getVariantColors(p); color = colors.length ? colors[0] : 'Default'; }
            var size = item.size || 'q';
            var qty = parseInt(item.qty, 10) || 1;
            var v = getVariant(p, color);
            var actual = (v && v.stock) ? (v.stock[size] !== undefined ? v.stock[size] : 0) : 0;
            if (actual < qty) {
              shortItems.push((item.productName || item.name || p.name) + ' (' + color + (size !== 'q' ? '/' + size : '') + ') — ordered ' + qty + ', in stock ' + actual);
            }
          });
          if (shortItems.length) {
            showCartNotification('⚠️ Cannot mark deposit paid: ' + shortItems.join('; ') + ' — advise customer');
            return;
          }
          // All items have sufficient stock — proceed
          fetch(base + '/orders/' + encodeURIComponent(poNumber) + '/deposit-paid', { method: 'POST' })
            .then(function(r) { return r.json(); })
            .then(function(j) {
              if (!j.ok) { showCartNotification('Failed: ' + (j.error || '')); return; }
              items.forEach(function(item) {
                var p = products.find(function(x) { return x.id === parseInt(item.id || item.productId || 0); });
                if (!p) return;
                var color = item.color || '';
                if (!color) { var colors = getVariantColors(p); color = colors.length ? colors[0] : 'Default'; }
                var size = item.size || 'q';
                var qty = parseInt(item.qty, 10) || 1;
                deductVariantStock(p, color, size, qty);
                stockMap[p.id] = { q: getTotalStock(p.id) };
                syncStockToFirestore(p.id);
              });
              saveProducts();
              renderProducts();
              showCartNotification('Deposit marked paid: ' + poNumber);
              var depositItems = []; try { depositItems = JSON.parse(order.items || '[]'); } catch(e) {}
              var depositMsg = '<b>Deposit Paid!</b>\n\nOrder: ' + poNumber + '\nCustomer: ' + (order.customerName || 'N/A') + '\nContact: ' + (order.customerContact || 'N/A') + '\nItems:\n' + depositItems.map(function(i) { return '  \u2022 ' + i.name + ' x' + i.qty + ' = \u20b1' + ((parseFloat(String(i.price || '').replace(/[^0-9.\-]/g, '')) || 0) * i.qty).toFixed(2); }).join('\n') + '\n\nDeposit: ' + (order.deposit || '') + '\nTotal: ' + (order.total || '');
              sendTelegramNotification(depositMsg);
              loadOrders();
            })
            .catch(function(e) { showCartNotification('Error: ' + (e.message || '')); });
        })
        .catch(function(e) { showCartNotification('Failed to fetch stock: ' + (e.message || '')); });
    })
    .catch(function(e) { showCartNotification('Error: ' + (e.message || '')); });
}

function confirmOrder(poNumber) {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders/' + encodeURIComponent(poNumber) + '/confirm', { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.ok) {
        showCartNotification('Order confirmed: ' + poNumber);
        fetch(base + '/orders/' + encodeURIComponent(poNumber))
          .then(function(r) { return r.json(); })
          .then(function(order) {
            if (order && !order.error) {
              var confirmItems = []; try { confirmItems = JSON.parse(order.items || '[]'); } catch(e) {}
              var msg = '<b>Order Confirmed!</b>\n\nPO: ' + poNumber + '\nCustomer: ' + (order.customerName || 'N/A') + '\nContact: ' + (order.customerContact || 'N/A') + '\nItems:\n' + confirmItems.map(function(i) { return '  \u2022 ' + i.name + ' x' + i.qty + ' = \u20b1' + ((parseFloat(String(i.price || '').replace(/[^0-9.\-]/g, '')) || 0) * i.qty).toFixed(2); }).join('\n') + '\n\nTotal: ' + (order.total || '') + '\nDeposit: ' + (order.deposit || '');
              sendTelegramNotification(msg);
            }
          }).catch(function() {});
        loadOrders();
      }
      else showCartNotification('Confirm failed: ' + (j.error || ''));
    })
    .catch(function(e) { showCartNotification('Confirm error: ' + (e.message || '')); });
}

function cancelOrder(poNumber) {
  if (!confirm('Cancel order ' + poNumber + '? Stock will be restored.')) return;
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders/' + encodeURIComponent(poNumber))
    .then(function(r) { return r.json(); })
    .then(function(order) {
      if (!order || order.error) { showCartNotification('Order not found'); return; }
      return fetch(base + '/orders/' + encodeURIComponent(poNumber) + '/cancel', { method: 'POST' })
        .then(function(r) { return r.json(); })
        .then(function(j) {
          if (!j.ok) { showCartNotification('Cancel failed: ' + (j.error || '')); return; }
          // Only restore stock if deposit was paid (pending orders never deducted stock persistently)
          if (order.status === 'deposit_paid') {
            var items = [];
            try { items = JSON.parse(order.items || '[]'); } catch(e) {}
            items.forEach(function(item) {
              var p = products.find(function(x) { return x.id === parseInt(item.id || item.productId || 0); });
              if (!p) return;
              var color = item.color || '';
              if (!color) { var colors = getVariantColors(p); color = colors.length ? colors[0] : 'Default'; }
              var size = item.size || 'q';
              restoreVariantStock(p, color, size, parseInt(item.qty, 10) || 1);
              stockMap[p.id] = { q: getTotalStock(p.id) };
              syncStockToFirestore(p.id);
            });
            saveProducts();
            renderProducts();
          }
          showCartNotification('Order cancelled: ' + poNumber);
          loadOrders();
        });
    })
    .catch(function(e) { showCartNotification('Cancel error: ' + (e.message || '')); });
}

function exportOrdersCSV() {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders?limit=10000')
    .then(function(r) { return r.json(); })
    .then(function(j) {
      var orders = Array.isArray(j) ? j : (j.docs || []);
      if (!orders || orders.length === 0) { showCartNotification('No orders to export.'); return; }
      var rows = [['PO#','Date','Customer','Contact','Email','Product','Color','Size','Qty','Price','Total','Deposit','Status']];
      orders.forEach(function(o) {
        var items = [];
        try { items = JSON.parse(o.items || '[]'); } catch(e) {}
        if (items.length === 0) {
          rows.push([o.id || o.poNumber || '', o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '', o.customerName || '', o.customerContact || '', o.customerEmail || '', '', '', '', '', '', o.total || '', o.deposit || '', o.status || '']);
          return;
        }
        items.forEach(function(i) {
          rows.push([o.id || o.poNumber || '', o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '', o.customerName || '', o.customerContact || '', o.customerEmail || '', i.name || '', i.color || '', i.size || '', i.qty || 1, i.price || '', o.total || '', o.deposit || '', o.status || '']);
        });
      });
      var csv = rows.map(function(r) {
        return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
      }).join('\n');
      var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'orders_' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
      showCartNotification('Orders exported to CSV.');
    })
    .catch(function(e) { showCartNotification('Export error: ' + (e.message || '')); });
}

function clearAllOrders() {
  if (!isProxyReady()) { showToast('Proxy not configured. Set Stock Proxy URL in Config tab.', 'error'); return; }
  if (!confirm('Delete ALL orders? This cannot be undone.')) return;
  if (!confirm('Are you sure? All order history will be permanently deleted.')) return;
  showToast('Clearing all orders...', 'info');
  fetch(proxyUrl('orders/clear-all'))
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      showToast('Deleted ' + (data.deleted || 0) + ' orders.', 'success');
      loadOrders();
    })
    .catch(function(err) {
      showToast('Failed to clear orders: ' + err.message, 'error');
    });
}
// ---- END DEPOSIT & CHECKOUT ----

function migrateCategoriesConfig(cfg) {
  console.log('[Trace] migrateCategoriesConfig() — input has types:', !!cfg.types, 'groups:', !!(cfg.groups), 'subcategoryMap:', !!(cfg.subcategoryMap), 'brands:', (cfg.brands||[]).length);
  if (cfg.types && !cfg.groups) {
    cfg.groups = [{ name: "All", image: "" }];
    cfg.subcategoryMap = { "All": cfg.types || [] };
    delete cfg.types;
  }
  if (!cfg.groups) cfg.groups = [];
  if (!cfg.subcategoryMap) {
    cfg.subcategoryMap = {};
    cfg.groups.forEach(function(g) { if (!cfg.subcategoryMap[g.name]) cfg.subcategoryMap[g.name] = []; });
  }
  cfg.groups.forEach(function(g) {
    if (!cfg.subcategoryMap[g.name]) cfg.subcategoryMap[g.name] = [];
    if (g.image && !g.images) { g.images = [g.image]; delete g.image; }
    if (!g.images) g.images = [];
  });
  if (!cfg.brands) cfg.brands = [];
  if (!cfg.colors) cfg.colors = [];
  if (!cfg.sizes) cfg.sizes = [];
  if (!cfg.subcategoryBrands) cfg.subcategoryBrands = {};
  if (!cfg.brandLogos) cfg.brandLogos = {};
  if (!cfg.messengerUrl) cfg.messengerUrl = 'https://m.me/61591559623253';
  console.log('[Trace] migrateCategoriesConfig() — output groups:', cfg.groups.length, 'subcategoryMap keys:', Object.keys(cfg.subcategoryMap).length, 'brands:', cfg.brands.length, 'sizes:', cfg.sizes.length);
  return cfg;
}

let categoriesConfig = migrateCategoriesConfig({
  groups: [
    { name: "MENS", images: [] },
    { name: "WOMENS", images: [] },
    { name: "DESIGN", images: [] }
  ],
  subcategoryMap: {
    "MENS": ["Shoes", "Clothing"],
    "WOMENS": ["Shoes", "Clothing", "Cosmetics"],
    "DESIGN": ["Clothing", "Accessories"]
  },
  brands: ["Nike", "Uniqlo", "GU", "Biore", "Onitsuka Tiger", "Heroine Make", "Generic"],
  colors: ["Black", "White", "Navy", "Beige", "Gray"],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "One Size", "Free Size"]
});

let currentGroup = 'all';
let currentBrand = 'all';
var mainPage = 1;
var productsShown = 0;
var favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
var showFavoritesOnly = false;
var recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
var mainLimit = 50;
var adminSearchVal = '';
var adminFilterGroup = 'all';
var adminFilterType = 'all';
var adminFilterColor = 'all';
var adminFilterBrand = 'all';

let products = [];
let editingId = null;
let currentCategory = 'all';
let currentSearch = '';
let selectedImagesData = [];
let variantImagesData = {};
let currentModalImages = [];
let currentImageIndex = 0;
var scrollPos = 0, bodyLocked = false;

// Per-size stock tracking
var stockMap = {};

function stockField(size) {
  if (!size || size === 'default' || size === 'quantity' || size === 'q') return 'q';
  return 's' + size.replace(/[^a-zA-Z0-9]/g, '');
}

function getVariant(product, color) {
  return (product.variants || {})[color || ''] || null;
}

function getVariantColors(product) {
  var colors;
  if (product._colorOrder && product._colorOrder.length) {
    colors = product._colorOrder.filter(function(c) { return product.variants && product.variants[c]; });
  } else {
    colors = Object.keys(product.variants || {});
  }
  // For design-based variants (not standard color names), sort numerically
  var isDesign = (categoriesConfig.colors || []).every(function(col) { return colors.indexOf(col) === -1; });
  if (isDesign && colors.length > 1) {
    return colors.slice().sort(function(a, b) {
      var na = parseInt(a.match(/\d+/)) || 0;
      var nb = parseInt(b.match(/\d+/)) || 0;
      return na - nb;
    });
  }
  return colors;
}

var ALPHA_SIZE_ORDER = ["XS","S","M","L","XL","2XL","3XL","One Size","Free Size"];
function sortSizes(sizes) {
  return sizes.slice().sort(function(a, b) {
    var aIsNum = /^\d+(\.\d+)?$/.test(a);
    var bIsNum = /^\d+(\.\d+)?$/.test(b);
    if (aIsNum && bIsNum) return parseFloat(a) - parseFloat(b);
    if (aIsNum) return 1;
    if (bIsNum) return -1;
    var ai = ALPHA_SIZE_ORDER.indexOf(a);
    var bi = ALPHA_SIZE_ORDER.indexOf(b);
    return (ai !== -1 ? ai : 999) - (bi !== -1 ? bi : 999);
  });
}
function getVariantSizes(product, color) {
  var v = getVariant(product, color);
  var sizes = v ? (v.sizes || []) : [];
  return sortSizes(sizes);
}

function getVariantStock(product, color, size) {
  var v = getVariant(product, color);
  if (!v) return 0;
  var s = v.stock || {};
  return s[size] !== undefined ? s[size] : 0;
}

function getTotalVariantStock(product, color) {
  var v = getVariant(product, color);
  if (!v) return 0;
  var s = v.stock || {};
  var t = 0;
  for (var k in s) t += s[k];
  return t;
}

function getSizeStock(productId, size, color) {
  var p = products.find(function(x) { return x.id === productId; });
  if (p && p.variants) {
    if (!color) {
      var colors = getVariantColors(p);
      if (colors.length) color = colors[0];
      else return 0;
    }
    return getVariantStock(p, color, size);
  }
  // fallback to old stockMap
  var m = stockMap[productId];
  if (!m) return 5;
  var qty = m[stockField(size)];
  return qty !== undefined ? qty : 0;
}

function getTotalStock(productId) {
  var p = products.find(function(x) { return x.id === productId; });
  // Use proxy stock if available (cross-device sync)
  if (stockInitialized && stockMap[productId]) {
    var m = stockMap[productId];
    var t = 0;
    for (var k in m) t += m[k];
    return t;
  }
  if (p && p.variants) {
    var t = 0;
    for (var c in p.variants) {
      var s = p.variants[c].stock || {};
      for (var k in s) t += s[k];
    }
    return t;
  }
  // fallback to old stockMap
  var m = stockMap[productId];
  if (!m) return 5;
  var t = 0;
  for (var k in m) t += m[k];
  return t;
}

function hasSizes(product) {
  if (product.variants) {
    for (var c in product.variants) {
      if (product.variants[c].sizes && product.variants[c].sizes.length > 0) return true;
    }
    return false;
  }
  return Array.isArray(product.sizes) && product.sizes.length > 0;
}

function lockBody() {
  if (bodyLocked) return;
  bodyLocked = true;
  scrollPos = window.scrollY || window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = -scrollPos + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
}

function unlockBody() {
  if (!bodyLocked) return;
  bodyLocked = false;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollPos);
}

// Prevent body touchmove when overlay is open
document.addEventListener('touchmove', function(e) {
  if (document.getElementById('productModal').classList.contains('active') &&
      !e.target.closest('.modal')) {
    e.preventDefault();
  }
  if (document.getElementById('liveFullscreen')) {
    e.preventDefault();
  }
  var cartOv = document.getElementById('cartOverlay');
  if (cartOv && cartOv.classList.contains('active') && !e.target.closest('#cartSlideout')) {
    e.preventDefault();
  }
}, { passive: false });

// Back button closes overlay via hashchange
window.addEventListener('hashchange', function() {
  var cartEl = document.getElementById('cartSlideout');
  if (cartEl && cartEl.classList.contains('active') && location.hash !== '#cart') {
    cartEl.classList.remove('active');
    var cartOv = document.getElementById('cartOverlay');
    if (cartOv) cartOv.classList.remove('active');
    unlockBody();
    return;
  }
  var live = document.getElementById('liveModal');
  if (live && location.hash !== '#modal') { closeLiveModal(); return; }
  var liveFS = document.getElementById('liveFullscreen');
  var modal = document.getElementById('productModal');
  if (!liveFS && (!modal || !modal.classList.contains('active'))) return;
  var hash = location.hash;
  if (liveFS && hash !== '#fullscreen') {
    closeFullscreen();
    return;
  }
  if (modal && modal.classList.contains('active') && hash !== '#modal') {
    closeModal();
  }
});

function migrateProducts() {
  let migrated = false;
  products.forEach(p => {
    if (p.image && !p.images) {
      p.images = [p.image];
      delete p.image;
      migrated = true;
    }
    if (p.available === undefined) {
      p.available = true;
      migrated = true;
    }
    if (p.category && !p.category1) {
      p.category1 = p.category;
      delete p.category;
      migrated = true;
    }
    if (!p.category0) {
      // Assign to first group that has this subcategory
      var assigned = false;
      (categoriesConfig.groups || []).forEach(function(g) {
        if (assigned) return;
        var subs = categoriesConfig.subcategoryMap[g.name] || [];
        if (subs.indexOf(p.category1) !== -1) {
          p.category0 = g.name;
          assigned = true;
        }
      });
      if (!assigned) p.category0 = (categoriesConfig.groups[0] || {}).name || '';
      migrated = true;
    }
    if (!p.category2) {
      p.category2 = "";
      migrated = true;
    }
    if (!p.color) {
      p.color = "";
      migrated = true;
    }
    if (!p.sizes) {
      p.sizes = [];
      migrated = true;
    }
    // Migrate old fields to variants
    if (!p.variants) {
      p.variants = {};
      var colorKey = p.color || "Default";
      if (p.sizes.length > 0) {
        var stockObj = {};
        p.sizes.forEach(function(s) {
          var fid = stockField(s);
          var qty = (stockMap && stockMap[p.id] && stockMap[p.id][fid] !== undefined) ? stockMap[p.id][fid] : 5;
          stockObj[s] = qty;
        });
        p.variants[colorKey] = { sizes: p.sizes.slice(), stock: stockObj };
      } else {
        p.variants[colorKey] = { sizes: [], stock: { q: p.stock !== undefined ? p.stock : 5 } };
      }
      migrated = true;
    }
    if (!p._colorOrder || p._colorOrder.length === 0) {
      p._colorOrder = Object.keys(p.variants || {});
      migrated = true;
    }
    if (p.images) {
      var oldLen = p.images.length;
      p.images = p.images.filter(function(img) { return img && !img.match(/firebasestorage\.googleapis\.com/); });
      if (p.images.length === 0 && oldLen > 0) { p.images = ['images/products/placeholder.svg']; migrated = true; }
      else if (p.images.length !== oldLen) migrated = true;
    }
    if (p.stock === undefined) {
      p.stock = 5;
      migrated = true;
    }
  });
  return migrated;
}

function loadProducts(callback) {
  var rendered = false;
  function done() {
    if (!rendered) { rendered = true; if (callback) callback(); }
  }

  var cdnLoaded = false;

  // Stage 1: Load from CDN file (Cloudflare Pages — always fresh), fallback to localStorage
  fetch('data/products.json?_=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.length > 0) {
        products = data;
        migrateProducts();
        cdnLoaded = true;
        localStorage.setItem('yokoso_sync_time', Date.now().toString());
        console.log('[Load] Loaded from CDN file: ' + products.length + ' products');
      } else {
        throw new Error('empty file');
      }
    })
    .catch(function() {
      var saved = localStorage.getItem('yokoso_products');
      if (saved) {
        try { products = JSON.parse(saved); migrateProducts(); console.log('[Load] Fallback to localStorage: ' + products.length + ' products'); }
        catch { products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)); console.log('[Load] Fallback to defaults (localStorage parse failed)'); }
      } else {
        products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        console.log('[Load] Fallback to defaults');
      }
    })
    .then(function() {
    // Stage 2: Only use localStorage if CDN failed AND there are pending unsaved edits.
    // If CDN loaded, it is always authoritative — otherwise stale localStorage
    // (from a previous buggy saveProducts call) would perpetually override fresh data.
    var pend = localStorage.getItem('yokoso_pending_sync');
    if (pend === 'true' && !cdnLoaded) {
      var saved = localStorage.getItem('yokoso_products');
      if (saved) {
        try {
          products = JSON.parse(saved);
          migrateProducts();
          console.log('[Load] Pending edits found, using localStorage: ' + products.length + ' products');
        } catch(e) {
          console.warn('[Load] Failed to parse localStorage products:', e);
        }
      }
    }
    // Merge onSale from localStorage onto CDN data (always, not just when pending edits).
    // Only ADD onSale by default — also respect explicit onSale=false when pending edits exist
    // (so admin's "turn off" survives stale CDN).
    if (cdnLoaded) {
      var saved = localStorage.getItem('yokoso_products');
      if (saved) {
        try {
          var localProds = JSON.parse(saved);
          if (localProds && localProds.length > 0) {
            var merged = 0;
            var pend = localStorage.getItem('yokoso_pending_sync') === 'true';
            products.forEach(function(p) {
              var lp = localProds.find(function(x) { return x.id === p.id; });
              if (lp) {
                if (lp.onSale === true) {
                  p.onSale = true;
                  merged++;
                } else if (lp.onSale === false && pend) {
                  delete p.onSale;
                  merged++;
                }
              }
            });
            if (merged > 0) console.log('[Load] LocalStorage onSale merged onto CDN data: ' + merged + ' products');
          }
        } catch(e) {
          console.warn('[Load] Failed to parse localStorage for onSale merge:', e);
        }
      }
    }
    localStorage.setItem('yokoso_products', JSON.stringify(products));
    console.log('[Debug] After Stage 2, products.length =', products.length);

    // Stage 3: Override with worker data (authoritative — always has latest edits)
    function afterWorkerCheck() {
      // Stage 4: Firebase sync (if available)
      if (fbDB) {
        fbDB.collection(FB_COLLECTION).doc(FB_DOC).get()
          .then(function(doc) {
            if (!doc.exists || !doc.data().items || !doc.data().items.length) {
              fbDB.collection(FB_COLLECTION).doc(FB_DOC).set({ items: products }).catch(function() {});
            }
            done();
          })
          .catch(function() { done(); });
        setTimeout(done, 3000);
      } else {
        console.log('[Debug] Before done(), products.length =', products.length);
        done();
      }
    }

    if (isProxyReady()) {
      fetch(proxyUrl('products'))
        .then(function(r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function(data) {
          if (data && data.products && data.products.length > 0) {
            products = data.products;
            migrateProducts();
            // Re-merge onSale from localStorage (worker is authoritative but onSale toggle is local)
            var saved = localStorage.getItem('yokoso_products');
            if (saved) {
              try {
                var localProds = JSON.parse(saved);
                var pend = localStorage.getItem('yokoso_pending_sync') === 'true';
                products.forEach(function(p) {
                  var lp = localProds.find(function(x) { return x.id === p.id; });
                  if (lp) {
                    if (lp.onSale === true) p.onSale = true;
                    else if (lp.onSale === false && pend) delete p.onSale;
                  }
                });
              } catch(e) {}
            }
            console.log('[Load] Overrode with worker data: ' + products.length + ' products');
          }
          localStorage.setItem('yokoso_products', JSON.stringify(products));
          afterWorkerCheck();
        })
        .catch(function() { afterWorkerCheck(); });
    } else {
      afterWorkerCheck();
    }
  });

  // Load categories
  loadCategories();
}

function loadCategories() {
  console.log('[Trace] loadCategories()');
  var savedConfig = localStorage.getItem('yokoso_categories');
  console.log('[Trace] loadCategories() — localStorage has savedConfig:', !!savedConfig);

  // Stage 1: Load committed categories from GitHub API (bypasses CDN), fallback to local file
  var fileFetch = fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + GITHUB_CATEGORIES_PATH)
    .then(function(r) {
      if (!r.ok) throw new Error('API fetch failed');
      return r.json();
    })
    .then(function(data) {
      if (data && data.content) {
        var decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
        return JSON.parse(decoded);
      }
      throw new Error('no content');
    })
    .catch(function() {
      return fetch('data/categories.json?_=' + Date.now())
        .then(function(r) { return r.json(); })
        .catch(function() { return null; });
    });

  fileFetch.then(function(data) {
    if (data) {
      console.log('[Trace] loadCategories() — loaded from GitHub API/' + GITHUB_CATEGORIES_PATH + ', groups:', (data.groups||[]).length);
      categoriesConfig = migrateCategoriesConfig(data);
    } else {
      console.log('[Trace] loadCategories() — empty data from API');
    }
  })
  .catch(function() {
    console.log('[Trace] loadCategories() — API failed, using fallback');
    // Fallback: keep whatever we had before
      if (savedConfig) {
        try {
          var parsed = JSON.parse(savedConfig);
          categoriesConfig = migrateCategoriesConfig(parsed);
        } catch(e) {}
      }
      categoriesConfig = migrateCategoriesConfig(categoriesConfig);
    })
    .finally(function() {
      console.log('[Trace] loadCategories() — Stage 2 merge, categoriesConfig groups:', (categoriesConfig.groups||[]).length, 'subcategoryMap keys:', Object.keys(categoriesConfig.subcategoryMap||{}).length);
      // Stage 2: Overlay with savedConfig (preserves user's edits from before fetch)
      if (savedConfig) {
        console.log('[Trace] loadCategories() — merging savedConfig with API data');
        try {
          var parsed = JSON.parse(savedConfig);
          var fetched = categoriesConfig;
          // Merge: API/file data is authoritative for groups, but localStorage edits take priority
          var fileGroups = fetched.groups || [];
          var userGroups = parsed.groups || [];
          userGroups.forEach(function(ug) {
            var fg = fileGroups.find(function(g) { return g.name === ug.name; });
            if (fg && (!fg.images || !fg.images.length)) {
              if (ug.images && ug.images.length) {
                fg.images = ug.images.slice();
              } else if (ug.image) {
                fg.images = [ug.image];
              }
            }
          });
          // Merge subcategoryMap from localStorage (user may have added new subcategories)
          if (parsed.subcategoryMap) {
            Object.keys(parsed.subcategoryMap).forEach(function(g) {
              if (!fetched.subcategoryMap[g]) fetched.subcategoryMap[g] = [];
              parsed.subcategoryMap[g].forEach(function(s) {
                if (fetched.subcategoryMap[g].indexOf(s) === -1) fetched.subcategoryMap[g].push(s);
              });
            });
          }
          if (parsed.brandLogos) {
            if (!fetched.brandLogos) fetched.brandLogos = {};
            Object.keys(parsed.brandLogos).forEach(function(b) {
              if (!fetched.brandLogos[b]) fetched.brandLogos[b] = parsed.brandLogos[b];
            });
          }
          // Merge colors, sizes, brands from localStorage (user may have added custom labels)
          if (parsed.colors) {
            parsed.colors.forEach(function(c) {
              if (fetched.colors.indexOf(c) === -1) fetched.colors.push(c);
            });
          }
          if (parsed.sizes) {
            parsed.sizes.forEach(function(s) {
              if (fetched.sizes.indexOf(s) === -1) fetched.sizes.push(s);
            });
          }
          if (parsed.brands) {
            parsed.brands.forEach(function(b) {
              if (fetched.brands.indexOf(b) === -1) fetched.brands.push(b);
            });
          }
          categoriesConfig = migrateCategoriesConfig(fetched);
        } catch(e) {}
      }
      console.log('[Trace] loadCategories() — final categoriesConfig groups:', (categoriesConfig.groups||[]).length, 'subcategoryMap keys:', Object.keys(categoriesConfig.subcategoryMap||{}).length, 'brands:', (categoriesConfig.brands||[]).length, 'sizes:', (categoriesConfig.sizes||[]).length);
      localStorage.setItem('yokoso_categories', JSON.stringify(categoriesConfig));

      // Backfill category0 only for products that don't have it yet
      // (preserves admin-set category0 values)
      products.forEach(function(p) {
        if (p.category0) return;
        var assigned = false;
        (categoriesConfig.groups || []).forEach(function(g) {
          if (assigned) return;
          var subs = categoriesConfig.subcategoryMap[g.name] || [];
          if (subs.indexOf(p.category1) !== -1) {
            p.category0 = g.name;
            assigned = true;
          }
        });
        if (!assigned) p.category0 = (categoriesConfig.groups[0] || {}).name || '';
      });

      // Re-render now that categories are loaded
      renderFilters();
      renderProducts();
      renderMessengerLink();

      // Stage 3: Firebase sync (if available)
      // categoriesConfig from GitHub API + localStorage merge is authoritative.
      // Only write categories to Firebase if empty (don't let stale Firebase data override).
      if (fbDB) {
        var catDone = false;
        fbDB.collection(FB_COLLECTION).doc('categories').get()
          .then(function(doc) {
            if (!catDone) {
              catDone = true;
              if (!doc.exists || !doc.data() || (!doc.data().types && !doc.data().groups)) {
                fbDB.collection(FB_COLLECTION).doc('categories').set({ groups: categoriesConfig.groups, subcategoryMap: categoriesConfig.subcategoryMap, brands: categoriesConfig.brands, sizes: categoriesConfig.sizes, colors: categoriesConfig.colors || [], brandLogos: categoriesConfig.brandLogos || {} }).catch(function() {});
              }
              renderCategoryDropdowns();
              renderCategoryManagement();
              renderFilters();
              renderProducts();
              renderMessengerLink();
            }
          })
          .catch(function() { if (!catDone) { catDone = true; renderCategoryDropdowns(); renderCategoryManagement(); renderFilters(); renderProducts(); renderMessengerLink(); } });
        setTimeout(function() { if (!catDone) { catDone = true; renderCategoryDropdowns(); renderCategoryManagement(); renderFilters(); renderProducts(); renderMessengerLink(); } }, 3000);
      } else {
        renderCategoryDropdowns();
        renderCategoryManagement();
        renderFilters();
        renderProducts();
        renderMessengerLink();
      }

      // Pick up proxy URL from categoriesConfig if not set locally
      if (!localStorage.getItem('yokoso_stock_proxy_url') && categoriesConfig.proxyUrl) {
        STOCK_PROXY_URL = categoriesConfig.proxyUrl;
        localStorage.setItem('yokoso_stock_proxy_url', STOCK_PROXY_URL);
        var pi = document.getElementById('stockProxyUrl');
        if (pi) pi.value = STOCK_PROXY_URL;
      }
    });
}

function saveCategoriesConfig() {
  console.log('[Trace] saveCategoriesConfig() — groups:', (categoriesConfig.groups||[]).length, 'subcategories:', Object.keys(categoriesConfig.subcategoryMap||{}).length, 'brands:', (categoriesConfig.brands||[]).length);
  var groupStatusEl = document.getElementById('groupImageSyncStatus');
  if (groupStatusEl) groupStatusEl.textContent = 'Saving...';
  localStorage.setItem('yokoso_categories', JSON.stringify(categoriesConfig));
  if (fbDB) {
    fbDB.collection(FB_COLLECTION).doc('categories').set(categoriesConfig).catch(function() {});
  }
  var autoSync = localStorage.getItem('autoSyncEnabled') === 'true';
  var token = localStorage.getItem('github_token');
  if (autoSync && token) {
    if (groupStatusEl) groupStatusEl.textContent = 'Syncing categories to GitHub...';
    syncCategoriesToGitHub();
  } else {
    if (groupStatusEl) {
      groupStatusEl.innerHTML = (autoSync ? '' : 'Auto-sync not enabled. ') + (!token ? 'No GitHub token.' : '') + ' <a href="#" onclick="switchAdminTab(\'config\');return false">Open sync settings</a>';
      groupStatusEl.style.color = '#e67e22';
    }
  }
}

function saveProducts() {
  console.log('[Save] saveProducts() called. Products count:', products.length);
  localStorage.setItem('yokoso_products', JSON.stringify(products));
  localStorage.setItem('yokoso_pending_sync', 'true');
  localStorage.setItem('yokoso_local_save_time', Date.now().toString());
  console.log('[Save] Written to localStorage, pending_sync=true');
  if (fbDB) {
    fbDB.collection(FB_COLLECTION).doc(FB_DOC).set({ items: products }).catch(function() {});
  }
  if (localStorage.getItem('autoSyncEnabled') === 'true' && localStorage.getItem('github_token')) {
    console.log('[Save] Auto-sync enabled, triggering syncToGitHub()');
    syncToGitHub();
  } else {
    console.log('[Save] Auto-sync not enabled or no token. Token exists:', !!localStorage.getItem('github_token'));
  }
  // Push to worker for cross-device real-time sync
  if (isProxyReady()) {
    fetch(proxyUrl('products'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: products, updatedAt: Date.now() })
    }).then(function(r) {
      if (r.ok) console.log('[Sync] Products pushed to worker');
    }).catch(function(err) { console.warn('[Sync] Worker push failed:', err.message); });
  }
  // Show commit reminder in admin panel
  var reminder = document.getElementById('commitReminder');
  if (!reminder) {
    reminder = document.createElement('div');
    reminder.id = 'commitReminder';
    reminder.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ffc107;color:#333;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);cursor:pointer;max-width:300px;';
    reminder.addEventListener('click', function() { this.remove(); });
    document.body.appendChild(reminder);
  }
  var syncing = localStorage.getItem('autoSyncEnabled') === 'true' && localStorage.getItem('github_token');
  reminder.innerHTML = syncing ? 'Syncing to GitHub... ✓' : 'Changes saved locally. <b>Export JSON</b> and commit <code>data/products.json</code> to GitHub to sync all devices.';
  reminder.style.display = 'block';
  clearTimeout(reminder._timeout);
  reminder._timeout = setTimeout(function() { if (reminder) reminder.style.display = 'none'; }, syncing ? 2000 : 6000);
}

function uploadImage(dataUrl) {
  var cloudName = categoriesConfig && categoriesConfig.cloudinaryCloudName;
  var uploadPreset = categoriesConfig && categoriesConfig.cloudinaryUploadPreset;
  if (!cloudName || !uploadPreset) {
    return Promise.resolve(dataUrl);
  }
  var isVideo = dataUrl.indexOf('data:video/') === 0;
  var uploadEndpoint = isVideo ? '/video/upload' : '/image/upload';
  var formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('upload_preset', uploadPreset);
  return fetch('https://api.cloudinary.com/v1_1/' + cloudName + uploadEndpoint, {
    method: 'POST',
    body: formData
  }).then(function(r) {
    if (!r.ok) return r.text().then(function(t) { throw new Error('Cloudinary ' + r.status + ': ' + t); });
    return r.json();
  }).then(function(j) {
    if (j.secure_url) return j.secure_url;
    throw new Error(j.error && j.error.message || 'Cloudinary upload failed');
  });
}

function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.indexOf('data:video/') === 0) return true;
  if (url.indexOf('/video/upload/') !== -1) return true;
  var ext = url.split('?')[0].toLowerCase();
  return ext.indexOf('.mp4') !== -1 || ext.indexOf('.webm') !== -1 || ext.indexOf('.mov') !== -1;
}

function getGroups() {
  return categoriesConfig.groups || [];
}

function getSubcategories(groupName) {
  if (!groupName || groupName === 'all') {
    var all = [];
    categoriesConfig.groups.forEach(function(g) {
      (categoriesConfig.subcategoryMap[g.name] || []).forEach(function(s) {
        if (all.indexOf(s) === -1) all.push(s);
      });
    });
    return all;
  }
  return categoriesConfig.subcategoryMap[groupName] || [];
}

function getTypes() {
  var subs = getSubcategories(currentGroup === 'all' ? null : currentGroup);
  return subs;
}

function getBrands() {
  var fromConfig = categoriesConfig.brands || [];
  var fromProducts = products.filter(function(p) {
    if (currentGroup !== 'all' && p.category0 !== currentGroup) return false;
    if (currentCategory !== 'all' && p.category1 !== currentCategory) return false;
    return true;
  }).map(function(p) { return p.category2; }).filter(Boolean);
  var merged = fromConfig.concat(fromProducts);
  return merged.filter(function(v, i, a) { return a.indexOf(v) === i; });
}

function getBrandsForSubcategory(sub) {
  if (!sub || sub === 'all') return [];
  if (categoriesConfig.subcategoryBrands && categoriesConfig.subcategoryBrands[sub] && categoriesConfig.subcategoryBrands[sub].length) {
    return categoriesConfig.subcategoryBrands[sub].slice().sort();
  }
  var filtered = products.filter(function(p) { return p.available !== false && p.category0 === currentGroup && p.category1 === sub; });
  var brands = [...new Set(filtered.map(function(p) { return p.category2; }).filter(Boolean))].sort();
  return brands;
}

function renderFilters() {
  renderCarousel();
  renderSubcategoryFilter();
  renderBrandFilter();
}

function renderSubcategoryFilter() {
  var container = document.getElementById('subcategoryFilterContainer');
  if (!container) return;
  if (currentGroup === 'all') { container.innerHTML = ''; return; }
  var subs = getSubcategories(currentGroup);
  var html = '';
  subs.forEach(function(s) {
    html += '<button class="filter-btn' + (currentCategory === s && currentBrand === 'all' ? ' active' : '') + '" data-subcategory="' + s + '">' + s + '</button>';
  });
  container.innerHTML = html;
}

function renderCarousel() {
  var container = document.getElementById('categoryCarousel');
  if (!container) return;
  if (document.body.classList.contains('catalog-mode')) return;
  var groups = getGroups();
  if (window._carouselIntervals) {
    window._carouselIntervals.forEach(clearInterval);
  }
  window._carouselIntervals = [];
  container.innerHTML = groups.map(function(g) {
    var active = currentGroup === g.name ? ' active' : '';
    var images = g.images && g.images.length ? g.images : [];
    var slidesHtml = images.map(function(img, i) {
      return '<div class="carousel-group-slide' + (i === 0 ? ' active' : '') + '" style="background-image:url(' + img + ');background-size:cover;background-position:center"></div>';
    }).join('');
    return '<button class="carousel-group-btn' + active + '" data-group="' + g.name + '">' +
      '<div class="carousel-group-slides">' + slidesHtml + '</div>' +
      '<span class="carousel-group-label">' + g.name + '</span></button>';
  }).join('');
  container.querySelectorAll('.carousel-group-btn').forEach(function(btn) {
    var slides = btn.querySelectorAll('.carousel-group-slide');
    if (slides.length < 2) return;
    var idx = 0;
    var stagger = Math.floor(Math.random() * 5000);
    setTimeout(function() {
      var interval = setInterval(function() {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
      }, 3000);
      window._carouselIntervals = window._carouselIntervals || [];
      window._carouselIntervals.push(interval);
    }, stagger);
  });
}

function renderBrandFilter() {
  var container = document.getElementById('brandFilterContainer');
  if (!container) return;
  if (currentGroup === 'all' || currentCategory === 'all') {
    container.innerHTML = '';
    return;
  }
  var brands = getBrandsForSubcategory(currentCategory);
  if (!brands.length) { container.innerHTML = ''; return; }
  var html = '<div class="brand-grid">';
  brands.forEach(function(b) {
    var logo = categoriesConfig.brandLogos && categoriesConfig.brandLogos[b] ? categoriesConfig.brandLogos[b] : '';
    var active = currentBrand === b ? ' active' : '';
    html += '<button class="brand-card' + active + '" data-subcategory="' + currentCategory + '" data-brand="' + b + '">';
    if (logo) html += '<img src="' + logo + '" class="brand-card-logo">';
    html += '<span class="brand-card-name">' + b + '</span></button>';
  });
  html += '</div>';
  container.innerHTML = html;
}



function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectGroup(name) {
  currentGroup = name;
  currentCategory = 'all';
  currentBrand = 'all';
  mainPage = 1;
  productsShown = 0;
  document.body.classList.add('catalog-mode');
  var ch = document.getElementById('catalogHeader');
  if (ch) ch.style.display = 'block';
  var ct = document.getElementById('catalogTitle');
  if (ct) {
    ct.textContent = name;
    ct.style.cursor = 'pointer';
    ct.onclick = function() {
      currentGroup = 'all';
      currentCategory = 'all';
      currentBrand = 'all';
      document.body.classList.remove('catalog-mode');
      if (ch) ch.style.display = 'none';
      var cc2 = document.getElementById('categoryCarousel');
      if (cc2) cc2.style.display = '';
      history.pushState({}, '', window.location.pathname);
      renderSubcategoryFilter();
      renderBrandFilter();
      mainPage = 1;
      renderProducts();
    };
  }
  var cc = document.getElementById('categoryCarousel');
  if (cc) cc.style.display = 'none';
  history.pushState({ group: name }, '', '?group=' + encodeURIComponent(name));
  renderSubcategoryFilter();
  renderBrandFilter();
  renderProducts();
  setTimeout(function() { scrollToTop(); }, 100);
}

var cc = document.getElementById('categoryCarousel');
if (cc) {
  cc.addEventListener('click', function(e) {
    var btn = e.target.closest('.carousel-group-btn');
    if (!btn) return;
    selectGroup(btn.dataset.group);
  });
}

var openSubcats = {};

document.addEventListener('click', function(e) {
  var brandCard = e.target.closest('.brand-card');
  if (brandCard) {
    var sub = brandCard.dataset.subcategory;
    var brand = brandCard.dataset.brand;
    currentCategory = sub;
    currentBrand = brand;
    openSubcats = {};
    renderSubcategoryFilter();
    document.getElementById('brandFilterContainer').innerHTML = '';
    mainPage = 1; renderProducts();
    setTimeout(function() { scrollToTop(); }, 100);
    return;
  }
  var subBtn = e.target.closest('#subcategoryFilterContainer .filter-btn');
  if (subBtn) {
    var sub = subBtn.dataset.subcategory;
    if (sub === 'all') {
      currentCategory = 'all';
      currentBrand = 'all';
      openSubcats = {};
    } else {
      currentCategory = sub;
      currentBrand = 'all';
      openSubcats = {};
    }
    renderSubcategoryFilter();
    renderBrandFilter();
    mainPage = 1; renderProducts();
    setTimeout(function() { scrollToTop(); }, 100);
    return;
  }
});

function openProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  trackRecentlyViewed(id);
  fetchProductStock(id, function() {
    openModal(product);
  });
}

function renderBreadcrumb() {
  var el = document.getElementById('breadcrumb');
  if (!el) return;
  var parts = [];
  parts.push('<span class="breadcrumb-item" onclick="resetFilters()">Home</span>');
  if (currentGroup !== 'all') {
    parts.push('<span class="breadcrumb-sep">›</span>');
    if (currentCategory !== 'all') {
      parts.push('<span class="breadcrumb-item" onclick="selectGroup(\'' + currentGroup.replace(/'/g, "\\'") + '\')">' + currentGroup + '</span>');
    } else {
      parts.push('<span class="breadcrumb-current">' + currentGroup + '</span>');
    }
  }
  if (currentCategory !== 'all') {
    parts.push('<span class="breadcrumb-sep">›</span>');
    if (currentBrand !== 'all') {
      parts.push('<span class="breadcrumb-item" onclick="selectSubcategory(\'' + currentCategory.replace(/'/g, "\\'") + '\')">' + currentCategory + '</span>');
    } else {
      parts.push('<span class="breadcrumb-current">' + currentCategory + '</span>');
    }
  }
  if (currentBrand !== 'all') {
    parts.push('<span class="breadcrumb-sep">›</span>');
    parts.push('<span class="breadcrumb-current">' + currentBrand + '</span>');
  }
  if (currentSearch) {
    parts.push('<span class="breadcrumb-sep">›</span>');
    parts.push('<span class="breadcrumb-current">Search: "' + currentSearch + '"</span>');
  }
  el.innerHTML = parts.join('');
  el.style.display = parts.length > 1 ? 'flex' : 'none';
}

function resetFilters() {
  currentGroup = 'all';
  currentCategory = 'all';
  currentBrand = 'all';
  currentSearch = '';
  mainPage = 1;
  document.body.classList.remove('catalog-mode');
  var ch = document.getElementById('catalogHeader');
  if (ch) ch.style.display = 'none';
  var cc = document.getElementById('categoryCarousel');
  if (cc) cc.style.display = '';
  history.pushState({}, '', window.location.pathname);
  renderFilters();
  renderProducts();
  setTimeout(function() { scrollToTop(); }, 100);
}

function loadMore() {
  productsShown += mainLimit;
  renderProducts();
  setTimeout(function() {
    var cards = document.querySelectorAll('#productGrid .product-card');
    var target = cards[productsShown - mainLimit];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function toggleFavorite(id, e) {
  if (e) e.stopPropagation();
  var idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
    showToast('Added to favorites', 'success');
  } else {
    favorites.splice(idx, 1);
    showToast('Removed from favorites', 'info');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  var btn = document.querySelector('.wishlist-btn[data-id="' + id + '"]');
  if (btn) btn.classList.toggle('active', favorites.indexOf(id) !== -1);
}

function toggleShowFavorites() {
  showFavoritesOnly = !showFavoritesOnly;
  productsShown = 0;
  var favBtn = document.getElementById('favFilterBtn');
  if (favBtn) favBtn.classList.toggle('active', showFavoritesOnly);
  renderProducts();
}

function trackRecentlyViewed(id) {
  recentlyViewed = recentlyViewed.filter(function(x) { return x !== id; });
  recentlyViewed.unshift(id);
  if (recentlyViewed.length > 10) recentlyViewed = recentlyViewed.slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

function renderRecentlyViewed() {
  var container = document.getElementById('recentlyViewedSection');
  if (!container || recentlyViewed.length === 0) return;
  var allProducts = window.allProducts || [];
  var viewed = recentlyViewed.map(function(id) {
    return allProducts.find(function(p) { return p.id === id; });
  }).filter(Boolean);
  if (viewed.length === 0) return;
  container.innerHTML = '<div class="rv-grid">' + viewed.map(function(p) {
    return '<div class="rv-card" onclick="openProduct(' + p.id + ')">' +
      '<img src="' + (p.img && p.img[0] ? p.img[0] : '') + '" alt="' + (p.name || '') + '" loading="lazy">' +
      '<div class="rv-name">' + (p.name || '') + '</div>' +
      '<div class="rv-price">¥' + (p.price || 0).toLocaleString() + '</div>' +
    '</div>';
  }).join('') + '</div>';
  container.style.display = 'block';
}

function selectSubcategory(name) {
  currentCategory = name;
  currentBrand = 'all';
  mainPage = 1;
  productsShown = 0;
  renderSubcategoryFilter();
  renderBrandFilter();
  renderProducts();
  setTimeout(function() { scrollToTop(); }, 100);
}

function renderProducts() {
  console.log('[Trace] renderProducts() — total products:', products.length, 'group:', currentGroup, 'category:', currentCategory, 'brand:', currentBrand, 'search:', currentSearch, 'favoritesOnly:', showFavoritesOnly);
  renderBreadcrumb();
  var grid = document.getElementById('productGrid');
  var spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.classList.add('active');
  var empty = document.getElementById('emptyState');
  var filtered = products.filter(function(p) { return p.available !== false; });
  if (currentGroup !== 'all') {
    filtered = filtered.filter(function(p) { return p.category0 === currentGroup; });
  }
  if (currentCategory !== 'all') {
    filtered = filtered.filter(function(p) { return p.category1 === currentCategory; });
  }
  if (currentBrand !== 'all') {
    filtered = filtered.filter(function(p) { return p.category2 === currentBrand; });
  }

  if (currentSearch) {
    var q = currentSearch.toLowerCase();
    filtered = filtered.filter(function(p) {
      return (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
             (p.category0 && p.category0.toLowerCase().indexOf(q) !== -1) ||
             (p.category1 && p.category1.toLowerCase().indexOf(q) !== -1) ||
             (p.category2 && p.category2.toLowerCase().indexOf(q) !== -1);
    });
  }
  if (showFavoritesOnly) {
    filtered = filtered.filter(function(p) { return favorites.indexOf(p.id) !== -1; });
  }
  filtered = filtered.sort(function(a, b) {
    if (a.onSale && !b.onSale) return -1;
    if (!a.onSale && b.onSale) return 1;
    return 0;
  });
  var totalFiltered = filtered.length;
  if (productsShown === 0) productsShown = mainLimit;
  if (productsShown > totalFiltered) productsShown = totalFiltered;
  var pageItems = filtered.slice(0, productsShown);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    if (spinner) spinner.classList.remove('active');
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = pageItems.map(function(p) {
    var brandHtml = p.category2 ? '<span class="product-brand">' + p.category2 + '</span>' : '';
    var variantColors = getVariantColors(p);
    var firstColor = variantColors.length ? variantColors[0] : 'Default';
    var colorChips = '';
    if (variantColors.length > 1) {
      colorChips = '<div class="product-color-chips">' + variantColors.map(function(c) {
        return '<span class="color-chip" title="' + c + '">' + c + '</span>';
      }).join('') + '</div>';
    } else if (variantColors.length === 1 && variantColors[0] !== 'Default') {
      colorChips = '<div class="product-color-chips"><span class="color-chip">' + variantColors[0] + '</span></div>';
    }
    var totalAvail = getTotalStock(p.id);
    var stockLabel = totalAvail > 3 ? 'In Stock' : totalAvail > 0 ? 'Only ' + totalAvail + ' left' : 'Out of Stock';
    var stockClass = totalAvail > 0 ? 'in-stock' : 'out-of-stock';
    var firstMedia = p.images?.[0] || 'images/products/placeholder.svg';
    var mediaHtml = isVideoUrl(firstMedia) ?
      '<div class="product-image-wrap"><div class="product-image product-image-video"><span class="video-play-icon">▶</span></div></div>' :
      '<div class="product-image-wrap"><span class="skeleton"></span><img class="product-image" src="' + firstMedia + '" alt="' + p.name + '" loading="lazy" onload="this.classList.add(\'loaded\');var sk=this.previousElementSibling;if(sk&&sk.classList.contains(\'skeleton\'))sk.remove();" onerror="this.classList.add(\'loaded\');var sk=this.previousElementSibling;if(sk&&sk.classList.contains(\'skeleton\'))sk.remove();if(this.dataset.retry){this.style.display=\'none\'}else{this.dataset.retry=\'1\';this.src=\'images/products/placeholder.svg\'}"></div>';
    return '<div class="product-card' + (p.onSale ? ' on-sale' : '') + '" data-id="' + p.id + '">' +
      mediaHtml +
      (p.onSale ? '<span class="product-sale-badge">SALE</span>' : '') +
      '<button class="wishlist-btn' + (favorites.indexOf(p.id) !== -1 ? ' active' : '') + '" data-id="' + p.id + '" onclick="toggleFavorite(' + p.id + ', event)" title="Add to favorites">♥</button>' +
      '<button class="quick-view-btn" onclick="event.stopPropagation();openProduct(' + p.id + ')" title="Quick View">👁</button>' +
      '<div class="product-info">' +
      (p.category0 ? '<div class="product-group">' + p.category0 + '</div>' : '') +
      '<div class="product-category">' + p.category1 + '</div>' +
      brandHtml +
      colorChips +
      '<div class="product-name" onclick="openProduct(' + p.id + ')">' + p.name + '</div>' +
      '<div class="product-price">' + p.price + '</div>' +
      '<div class="product-stock ' + stockClass + '">' + stockLabel + '</div>' +
      (!hasSizes(p) && variantColors.length <= 1 && totalAvail > 0 ? '<button class="btn-add-cart" data-id="' + p.id + '" data-color="' + firstColor.replace(/'/g, "\\'") + '">Add to Cart</button>' : '') +
      '</div></div>';
  }).join('');

  grid.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.btn-add-cart')) return;
      var id = parseInt(this.dataset.id);
      if (!isNaN(id)) openProduct(id);
    });
  });
  grid.querySelectorAll('.btn-add-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = parseInt(this.dataset.id);
      var color = this.dataset.color || '';
      if (!isNaN(id)) addToCart(id, color);
    });
  });
  if (productsShown < totalFiltered) {
    var pag = document.createElement('div');
    pag.style.cssText = 'display:flex;justify-content:center;padding:20px 0;grid-column:1/-1';
    pag.innerHTML = '<button class="load-more-btn" onclick="loadMore()">Load More (' + (totalFiltered - productsShown) + ' remaining)</button>';
    grid.appendChild(pag);
  }
  if (spinner) spinner.classList.remove('active');
}

function goToPage(newPage) {
  mainPage = newPage;
  renderProducts();
  setTimeout(function() {
    var first = document.querySelector('#productGrid .product-card');
    if (!first) return;
    if (window.innerWidth > 768) {
      first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      var header = document.querySelector('.header');
      var filter = document.querySelector('.search-filter');
      var offset = (header ? header.offsetHeight : 0) + (filter ? filter.offsetHeight : 0);
      var top = first.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, 50);
}

// ---- PROXY-BASED STOCK ----
var stockInitialized = false;

function proxyUrl(path) {
  var base = (STOCK_PROXY_URL || '').replace(/\/+$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}

function isProxyReady() {
  return STOCK_PROXY_URL && STOCK_PROXY_URL.startsWith('http');
}

function setProxyStatus(msg, isError) {
  var el = document.getElementById('proxyStatus');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#e94560' : '#2e7d32';
}

function syncStockToFirestore(productId) {
  if (!isProxyReady()) return;
  var p = products.find(function(x) { return x.id === productId; });
  if (!p) return;
  var body = {};
  if (p.variants) {
    var total = 0;
    for (var c in p.variants) {
      var v = p.variants[c];
      if (v.stock) {
        for (var s in v.stock) {
          body[c + '|' + s] = v.stock[s];
          total += v.stock[s];
        }
      }
    }
    body.q = total;
  } else if (hasSizes(p)) {
    var m = stockMap[productId];
    if (m) {
      body = m;
    } else {
      var perSize = Math.max(1, Math.floor((p.stock !== undefined ? p.stock : 5) / (p.sizes.length || 1)));
      p.sizes.forEach(function(s) { body[stockField(s)] = perSize; });
      body.q = 0;
    }
  } else {
    body.q = p.stock !== undefined ? p.stock : 5;
  }
  console.log('[Stock] Syncing product', productId, '->', JSON.stringify(body));
  fetch(proxyUrl('stocks/' + productId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(function(r) {
    if (!r.ok) console.warn('[Stock] Sync PUT failed:', r.status);
    return r.json().then(function(d) { console.log('[Stock] Sync response for', productId, ':', d); });
  }).catch(function(err) { console.warn('[Stock] Sync error for', productId, ':', err.message); });
}

function syncAllStockToFirestore() {
  if (!isProxyReady()) return;
  products.forEach(function(p) {
    syncStockToFirestore(p.id);
  });
  setProxyStatus('Stock synced to proxy');
}

function loadStockFromFirestore(callback) {
  if (!isProxyReady()) { console.log('[Stock] Proxy not ready, using local stock'); stockInitialized = true; if (callback) callback(); return; }
  var url = proxyUrl('stocks');
  console.log('[Stock] Loading from', url);
  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      console.log('[Stock] Load response', r.status);
      return r.json();
    })
    .then(function(docs) {
      console.log('[Stock] Got docs:', docs ? docs.length : 0);
      if (Array.isArray(docs)) {
        docs.forEach(function(doc) {
          if (doc && doc.id) {
            var id = parseInt(doc.id);
            var p = products.find(function(x) { return x.id === id; });
            if (p && doc.fields) {
              // Restore per-color per-size stock from proxy fields
              if (p.variants) {
                for (var c in p.variants) {
                  var v = p.variants[c];
                  if (v.stock) {
                    for (var s in v.stock) {
                      var key = c + '|' + s;
                      if (doc.fields[key] !== undefined) {
                        v.stock[s] = doc.fields[key];
                      }
                    }
                  }
                }
                stockMap[id] = { q: doc.fields.q !== undefined ? doc.fields.q : getTotalStock(id) };
              } else if (hasSizes(p) && Object.keys(doc.fields).length === 1 && (doc.fields.q !== undefined || doc.fields.default !== undefined)) {
                var total = doc.fields.q !== undefined ? doc.fields.q : doc.fields.default;
                stockMap[id] = {};
                var perSize = Math.max(1, Math.floor(total / p.sizes.length));
                p.sizes.forEach(function(s) { stockMap[id][stockField(s)] = perSize; });
                stockMap[id].q = 0;
              } else {
                stockMap[id] = doc.fields;
              }
              p.stock = getTotalStock(id);
              console.log('[Stock] Product', id, 'stockMap:', JSON.stringify(stockMap[id]), 'total:', p.stock);
            }
          }
        });
      }
      // Initialize stockMap for products not in Firestore yet (silently, no writes)
      products.forEach(function(p) {
        if (!stockMap[p.id]) {
          if (p.variants) {
            stockMap[p.id] = { q: getTotalStock(p.id) };
          } else if (hasSizes(p)) {
            stockMap[p.id] = {};
            var perSize = Math.max(1, Math.floor((p.stock !== undefined ? p.stock : 5) / (p.sizes.length || 1)));
            p.sizes.forEach(function(s) { stockMap[p.id][stockField(s)] = perSize; });
            stockMap[p.id].q = 0;
          } else {
            stockMap[p.id] = { q: p.stock !== undefined ? p.stock : 5 };
          }
          p.stock = getTotalStock(p.id);
        }
      });
      stockInitialized = true;
      setProxyStatus('Proxy connected (' + (docs ? docs.length : 0) + ' stock docs)');
      if (callback) callback();
    })
    .catch(function(err) {
      console.warn('[Stock] Load error:', err.message);
      stockInitialized = true;
      setProxyStatus('Proxy error: ' + (err.message || 'connection failed'), true);
      if (callback) callback();
    });
}

function applyStockDoc(doc) {
  if (!doc || !doc.fields) return;
  var id = parseInt(doc.id);
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;
  if (p.variants) {
    for (var c in p.variants) {
      var v = p.variants[c];
      if (v.stock) {
        for (var s in v.stock) {
          var key = c + '|' + s;
          if (doc.fields[key] !== undefined) v.stock[s] = doc.fields[key];
        }
      }
    }
    stockMap[id] = { q: doc.fields.q !== undefined ? doc.fields.q : getTotalStock(id) };
  } else {
    stockMap[id] = doc.fields;
  }
  p.stock = getTotalStock(id);
}

function getCachedStockDoc(productId) {
  try {
    var raw = localStorage.getItem('yokoso_stock_cache');
    if (!raw) return null;
    var cache = JSON.parse(raw);
    var entry = cache[productId];
    if (!entry) return null;
    // Expire after 5 minutes so product modal shows up-to-date stock after admin deductions
    if (Date.now() - (entry._ts || 0) > 300000) {
      delete cache[productId];
      localStorage.setItem('yokoso_stock_cache', JSON.stringify(cache));
      return null;
    }
    return entry;
  } catch(e) { return null; }
}

function setCachedStockDoc(productId, doc) {
  try {
    var raw = localStorage.getItem('yokoso_stock_cache');
    var cache = raw ? JSON.parse(raw) : {};
    cache[productId] = doc;
    cache[productId]._ts = Date.now();
    localStorage.setItem('yokoso_stock_cache', JSON.stringify(cache));
  } catch(e) {}
}

function fetchProductStock(productId, callback) {
  var cached = getCachedStockDoc(productId);
  if (cached) {
    applyStockDoc(cached);
    if (callback) callback();
    return;
  }
  if (!isProxyReady()) { if (callback) callback(); return; }
  fetch(proxyUrl('stocks/' + productId))
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(doc) {
      if (doc && doc.fields) setCachedStockDoc(productId, doc);
      applyStockDoc(doc);
      if (callback) callback();
    })
    .catch(function() { if (callback) callback(); });
}

function testProxyConnection() {
  var statusEl = document.getElementById('proxyStatus');
  if (!statusEl) return;
  statusEl.textContent = 'Testing...';
  statusEl.style.color = '#888';
  if (!isProxyReady()) { setProxyStatus('No proxy URL configured', true); return; }
  fetch(proxyUrl('stocks'))
    .then(function(r) {
      if (r.ok) { setProxyStatus('Connected! (' + r.status + ')'); return r.json(); }
      throw new Error('HTTP ' + r.status);
    })
    .then(function(docs) {
      setProxyStatus('Connected — ' + (Array.isArray(docs) ? docs.length : 0) + ' products in stock');
    })
    .catch(function(err) {
      setProxyStatus('Test failed: ' + (err.message || 'connection error'), true);
    });
}

// Pre-fill proxy URL input on load and auto-connect if saved
// Priority: localStorage > categoriesConfig > JS default
(function initProxy() {
  var saved = localStorage.getItem('yokoso_stock_proxy_url');
  if (saved) {
    STOCK_PROXY_URL = saved;
  } else if (categoriesConfig && categoriesConfig.proxyUrl) {
    STOCK_PROXY_URL = categoriesConfig.proxyUrl;
    localStorage.setItem('yokoso_stock_proxy_url', STOCK_PROXY_URL);
  }
  var input = document.getElementById('stockProxyUrl');
  if (input) {
    if (!input.value) input.value = STOCK_PROXY_URL;
  }
  if (STOCK_PROXY_URL) setProxyStatus('Proxy configured, connecting...');
})();

function applyProxyUrl() {
  var input = document.getElementById('stockProxyUrl');
  if (!input) return;
  STOCK_PROXY_URL = input.value.trim();
  localStorage.setItem('yokoso_stock_proxy_url', STOCK_PROXY_URL);
  // Persist across devices via categoriesConfig (synced to GitHub)
  if (categoriesConfig) {
    categoriesConfig.proxyUrl = STOCK_PROXY_URL;
    saveCategoriesConfig();
  }
  if (isProxyReady()) {
    setProxyStatus('Connecting...');
    stockInitialized = false;
    loadStockFromFirestore(function() {
      renderProducts();
    });
  } else {
    setProxyStatus('Enter a valid proxy URL', true);
  }
}

// ---- CART SYSTEM ----
var cart = JSON.parse(localStorage.getItem('yokoso_cart') || '[]');

function saveCart() {
  console.log('[Trace] saveCart() — cart items:', cart.length, 'total qty:', cart.reduce(function(s,i){return s+i.qty;},0), 'cart:', JSON.stringify(cart.map(function(i){return {id:i.id,color:i.color,size:i.size,qty:i.qty}})));
  localStorage.setItem('yokoso_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var badge = document.getElementById('cartBadge');
  if (!badge) return;
  var count = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function cartKey(id, color, size) {
  return id + '|' + (color || '') + '|' + (size || '');
}

function addToCart(productId, color, size) {
  var p = products.find(function(x) { return x.id === productId; });
  if (!p) { console.warn('[Trace] addToCart() — product not found, id:', productId); return; }
  console.log('[Trace] addToCart() — id:', productId, 'color:', color, 'size:', size, 'name:', p.name);
  // If color not provided, use first/only variant
  if (!color) {
    var colors = getVariantColors(p);
    if (colors.length) color = colors[0];
    else { return; }
  }
  if (!size) {
    // non-sized product
    var avail = getVariantStock(p, color, 'q');
    if (avail <= 0) { showToast('This item is out of stock.', 'error'); return; }
    var key = cartKey(productId, color, null);
    var existing = cart.find(function(item) { return cartKey(item.id, item.color, item.size) === key; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: productId,
        color: color,
        size: null,
        qty: 1,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || 'images/products/placeholder.svg'
      });
    }
    deductVariantStock(p, color, 'q', 1);
    saveCart();
    renderProducts();
    showCartNotification(p.name);
    return;
  }
  var avail = getVariantStock(p, color, size);
  if (avail <= 0) { showToast('Color ' + color + ', size ' + size + ' is out of stock.', 'error'); return; }
  var key = cartKey(productId, color, size);
  var existing = cart.find(function(item) { return cartKey(item.id, item.color, item.size) === key; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: productId,
      color: color,
      size: size,
      qty: 1,
      name: p.name,
      price: p.price,
      image: p.images?.[0] || 'images/products/placeholder.svg'
    });
  }
  deductVariantStock(p, color, size, 1);
  saveCart();
  console.log('[Cart] Added ' + p.name + ' (' + color + (size ? '/' + size : '') + ')');
  renderProducts();
  showCartNotification(p.name + (size ? ' (' + color + '/' + size + ')' : ' (' + color + ')'));
}

function syncStockCache(product) {
  if (!product || !product.variants) return;
  var fields = { q: 0 };
  for (var c in product.variants) {
    var v = product.variants[c];
    if (v.stock) {
      for (var s in v.stock) {
        fields[c + '|' + s] = v.stock[s];
        if (s === 'q') fields.q = (fields.q || 0) + v.stock[s];
      }
    }
  }
  setCachedStockDoc(product.id, { id: String(product.id), fields: fields });
}

function deductVariantStock(p, color, size, qty) {
  if (!p.variants) return;
  var v = p.variants[color];
  if (!v) return;
  if (!v.stock) v.stock = {};
  if (v.stock[size] === undefined) v.stock[size] = 0;
  v.stock[size] = Math.max(0, v.stock[size] - qty);
  syncStockCache(p);
}

function restoreVariantStock(p, color, size, qty) {
  if (!p.variants) return;
  var v = p.variants[color];
  if (!v) return;
  if (!v.stock) v.stock = {};
  if (v.stock[size] === undefined) v.stock[size] = 0;
  v.stock[size] = (v.stock[size] || 0) + qty;
  syncStockCache(p);
}

function removeFromCart(productId, color, size) {
  var key = cartKey(productId, color, size);
  var idx = cart.findIndex(function(x) { return cartKey(x.id, x.color, x.size) === key; });
  if (idx === -1) { console.warn('[Trace] removeFromCart() — not found, key:', key); return; }
  var item = cart[idx];
  console.log('[Trace] removeFromCart() — id:', productId, 'color:', color, 'size:', size, 'qty:', item.qty);
  var p = products.find(function(x) { return x.id === productId; });
  if (p) restoreVariantStock(p, item.color, item.size || 'q', item.qty);
  cart.splice(idx, 1);
  saveCart();
  renderProducts();
  renderCart();
}

function updateCartQty(productId, delta, color, size) {
  var key = cartKey(productId, color, size);
  var idx = cart.findIndex(function(x) { return cartKey(x.id, x.color, x.size) === key; });
  if (idx === -1) { console.warn('[Trace] updateCartQty() — not found, key:', key); return; }
  var item = cart[idx];
  console.log('[Trace] updateCartQty() — id:', productId, 'color:', color, 'size:', size, 'delta:', delta, 'currentQty:', item.qty);
  var p = products.find(function(x) { return x.id === productId; });
  var avail = p ? getVariantStock(p, item.color, item.size || 'q') : 0;
  var newQty = item.qty + delta;
  if (newQty <= 0) { removeFromCart(productId, item.color, item.size); return; }
  if (delta > 0 && delta > avail) { showToast('Not enough stock for ' + (item.color || '') + (item.size ? '/' + item.size : '') + '.', 'error'); return; }
  if (delta > 0) {
    deductVariantStock(p, item.color, item.size || 'q', delta);
  } else {
    restoreVariantStock(p, item.color, item.size || 'q', -delta);
  }
  item.qty = newQty;
  saveCart();
  renderProducts();
  renderCart();
}

function getCartTotal() {
  return cart.reduce(function(sum, item) {
    var price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(price) ? 0 : price * item.qty);
  }, 0);
}

function showCartNotification(name) {
  var el = document.getElementById('cartNotification');
  if (!el) return;
  el.textContent = name + ' added to cart!';
  el.classList.add('active');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(function() { el.classList.remove('active'); }, 2000);
}

function toggleCart() {
  var el = document.getElementById('cartSlideout');
  var ov = document.getElementById('cartOverlay');
  if (!el) return;
  var opening = !el.classList.contains('active');
  el.classList.toggle('active');
  if (ov) ov.classList.toggle('active');
  if (opening) {
    renderCart();
    lockBody();
    try { history.pushState({cart: true}, '', '#cart'); } catch (e) {}
  } else {
    unlockBody();
    if (location.hash === '#cart') { try { history.back(); } catch (e) {} }
  }
}

function renderCart() {
  var list = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartTotal');
  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:#888">Your cart is empty</div>';
    if (totalEl) totalEl.textContent = '';
    return;
  }
  list.innerHTML = cart.map(function(item) {
    var price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    var subtotal = isNaN(price) ? item.price : '₱' + (price * item.qty).toFixed(2);
    var sizeEl = item.size ? '<div class="cart-item-size">' + item.size + '</div>' : '';
    var colorEl = item.color ? '<div class="cart-item-color">' + item.color + '</div>' : '';
    return '<div class="cart-item">' +
      '<img src="' + item.image + '" class="cart-item-img" onerror="this.src=\'images/products/placeholder.svg\'">' +
      '<div class="cart-item-info">' +
      '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ',\'' + (item.color || '') + '\',\'' + (item.size || '') + '\')">×</button>' +
      '<div class="cart-item-name">' + item.name + '</div>' +
      (colorEl || sizeEl ? '<div class="cart-item-variant">' + colorEl + sizeEl + '</div>' : '') +
      '<div class="cart-item-price">' + item.price + '</div>' +
      '<div class="cart-item-subtotal">Subtotal: ' + subtotal + '</div>' +
      '<div class="cart-item-qty">' +
      '<button class="cart-qty-btn" onclick="updateCartQty(' + item.id + ',-1,\'' + (item.color || '') + '\',\'' + (item.size || '') + '\')">−</button>' +
      '<span>' + item.qty + '</span>' +
      '<button class="cart-qty-btn" onclick="updateCartQty(' + item.id + ',1,\'' + (item.color || '') + '\',\'' + (item.size || '') + '\')">+</button>' +
      '</div></div>' +
      '</div>';
  }).join('');
  if (totalEl) {
    var total = getCartTotal();
    var deposit = getDepositAmount();
    totalEl.innerHTML = total > 0 ? '<div class="cart-total-row">Total: ₱' + total.toFixed(2) + '</div><div class="cart-deposit-row">Deposit: <strong>₱' + deposit.toFixed(2) + '</strong></div>' : '';
  }
}

function openModalFullscreen() {
  try {
    currentModalImages = _modalImages.slice();
    currentImageIndex = _modalImageIdx;
    document.title = 'FS:' + currentModalImages.length;
    openFullscreen();
  } catch (e) {
    console.error('openModalFullscreen error:', e);
  }
}

function closeLiveModal() {
  _modalProduct = null;
  var el = document.getElementById('liveModal');
  if (el) { el.remove(); unlockBody(); if (location.hash === '#modal') history.back(); }
}

function modalStripNav(dir) {
  var c = document.getElementById('modalMediaContainer');
  if (c) {
    c.scrollBy({ left: dir * c.clientWidth, behavior: 'smooth' });
  }
}

var _orderSnapshot = null;

var _modalImages = [];
var _modalImageIdx = 0;
var _modalProduct = null;

function renderModalMedia(src) {
  if (isVideoUrl(src)) {
    return '<video src="' + src + '" controls style="width:100%;height:500px;object-fit:contain;background:#000" playsinline></video>';
  }
  return '<img class="modal-strip-img" src="' + src + '" style="height:500px;width:100%;flex:0 0 100%;object-fit:contain;background:#fff;cursor:pointer;scroll-snap-align:start" onerror="if(this.dataset.retry){this.style.display=\'none\'}else{this.dataset.retry=\'1\';this.src=\'images/products/placeholder.svg\'}">';
}

function modalGoTo(index) {
  _modalImageIdx = index;
  var container = document.getElementById('modalMediaContainer');
  if (container) {
    container.scrollTo({ left: container.clientWidth * index, behavior: 'smooth' });
  }
}

var _colorHexMap = {
  red:'#e53935',blue:'#1e88e5',green:'#43a047',black:'#212121',white:'#ffffff',
  beige:'#f5f5dc',pink:'#f06292',silver:'#bdbdbd',grey:'#757575',gray:'#757575',
  brown:'#6d4c41',lavender:'#b39ddb',navy:'#1a237e',olive:'#7cb342',
  yellow:'#fdd835',orange:'#fb8c00',purple:'#8e24aa',gold:'#f9a825',
  tan:'#d2b48c',cream:'#fff8e1',charcoal:'#37474f',indigo:'#3949ab',
  coral:'#ff7043',teal:'#00897b',maroon:'#6d1a36',violet:'#9c27b0','off white':'#faf9f6',default:'#bbb'
};
function colorToHex(name) {
  var n = (name || '').toLowerCase().trim();
  if (_colorHexMap[n]) return _colorHexMap[n];
  var parts = n.split(/\s*&\s*|\s*\/\s*|\s*\+\s*/);
  if (parts.length > 1) {
    var r = 0, g = 0, b = 0, count = 0;
    parts.forEach(function(p) {
      var hex = _colorHexMap[p.trim()];
      if (hex) {
        var c = hex.replace('#','');
        r += parseInt(c.substr(0,2),16);
        g += parseInt(c.substr(2,2),16);
        b += parseInt(c.substr(4,2),16);
        count++;
      }
    });
    if (count > 0) {
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
      return '#' + ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
    }
  }
  var hash = 0;
  for (var i = 0; i < n.length; i++) { hash = n.charCodeAt(i) + ((hash << 5) - hash); }
  var hue = Math.abs(hash) % 360;
  return 'hsl(' + hue + ', 65%, 45%)';
}
function getColorParts(name) {
  var n = (name || '').toLowerCase().trim();
  if (_colorHexMap[n]) return [_colorHexMap[n]];
  var parts = n.split(/\s*&\s*|\s*\/\s*|\s*\+\s*/);
  var hexes = [];
  parts.forEach(function(p) {
    var hex = _colorHexMap[p.trim()];
    if (hex) hexes.push(hex);
  });
  return hexes.length > 1 ? hexes : [_colorHexMap.default];
}
function colorBtnBg(name) {
  var parts = getColorParts(name);
  if (parts.length === 1) return 'background:' + parts[0];
  var deg = Math.round(360 / parts.length);
  var stops = parts.map(function(h, i) { return h + ' ' + (i * deg) + 'deg ' + ((i + 1) * deg) + 'deg'; });
  return 'background:conic-gradient(' + stops.join(',') + ')';
}
function isLightColor(hex) {
  var c = hex.replace('#','');
  var r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
  return (r*299 + g*587 + b*114) / 1000 > 180;
}

function openModal(product) {
  try {
    console.log('[Trace] openModal() — product:', product.id, product.name);
    _modalProduct = product;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'liveModal';
    overlay.style.cssText = 'display:flex !important;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;align-items:center;justify-content:center;padding:20px;';
    
    var variantColors = getVariantColors(product);
    var firstColor = variantColors.length ? variantColors[0] : null;
    // Default: show all product-level images (no color filter)
    _modalImages = (Array.isArray(product.images) && product.images.length > 0) ? product.images.slice() : [product.image || 'images/products/placeholder.svg'];
    _modalImageIdx = 0;
    _modalSelectedColor = firstColor;
    _modalSelectedSize = null;
    var productHasSizes = hasSizes(product);
    // Color picker
    var colorPickerHtml = '';
    if (variantColors.length > 1 || (variantColors.length === 1 && variantColors[0] !== 'Default')) {
      var isDesignProduct = (categoriesConfig.colors || []).every(function(col) { return variantColors.indexOf(col) === -1; });
      colorPickerHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px 6px;margin-bottom:12px" id="modalColorContainer">' + variantColors.map(function(c) {
        if (isDesignProduct) {
          var isActive = c === firstColor;
          return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer" onclick="selectModalColor(this,\'' + c.replace(/'/g, "\\'") + '\')">' +
            '<button class="modal-color-btn' + (isActive ? ' modal-color-active' : '') + '" data-color="' + c + '" style="background:#f0f0f0;border:' + (isActive ? '2px solid #e94560' : '1px solid #ddd') + ';border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#333;cursor:pointer;font-weight:' + (isActive ? '600' : '400') + ';width:auto;overflow:visible">' + c + '</button>' +
            '</div>';
        }
        var bgStyle = colorBtnBg(c);
        var isActive = c === firstColor;
        var circleBorder = isActive ? '1.5px solid #e94560' : '1.5px solid rgba(0,0,0,0.2)';
        var activeClass = isActive ? ' modal-color-active' : '';
        var label = c.length > 10 ? c.substring(0, 8) + '..' : c;
        return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;width:42px" onclick="selectModalColor(this,\'' + c.replace(/'/g, "\\'") + '\')">' +
          '<button class="modal-color-btn' + activeClass + '" data-color="' + c + '" style="' + bgStyle + ';border:' + circleBorder + '"></button>' +
          '<span style="font-size:0.5rem;color:' + (isActive ? '#e94560' : '#888') + ';font-weight:' + (isActive ? '600' : '400') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:42px;display:block;text-align:center" title="' + c + '">' + label + '</span>' +
          '</div>';
      }).join('') + '</div>';
    }
    // Sizes for selected color
    var sizesHtml = '';
    if (firstColor) {
      var vSizes = getVariantSizes(product, firstColor);
      if (vSizes.length > 0) {
        sizesHtml = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px" id="modalSizesContainer">' + vSizes.map(function(s) {
          var sStock = getVariantStock(product, firstColor, s);
          var sClass = sStock > 0 ? 'modal-size-btn' : 'modal-size-btn size-oos';
          var sLabel = sStock > 0 ? s : s + ' (OOS)';
          return '<button class="' + sClass + '" data-size="' + s + '" onclick="selectModalSize(this,\'' + s + '\')">' + sLabel + '</button>';
        }).join('') + '</div>';
      }
    }
    var totalAvail = getTotalStock(product.id);
    
    overlay.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:720px;width:100%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.15)">' +
      '<button onclick="closeLiveModal()" style="position:absolute;top:12px;right:16px;background:rgba(0,0,0,0.06);border:none;font-size:24px;cursor:pointer;color:#666;z-index:10;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center">×</button>' +
      '<div style="display:flex;flex-direction:column">' +
         '<div style="position:relative">' +
            '<div id="modalMediaContainer" style="position:relative;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;height:500px">' +
            _modalImages.map(function(img, i) {
              return '<img class="modal-strip-img" data-index="' + i + '" src="' + img + '" style="height:500px;width:100%;flex:0 0 100%;object-fit:contain;background:#fff;cursor:pointer;scroll-snap-align:start" onerror="if(this.dataset.retry){this.style.display=\'none\'}else{this.dataset.retry=\'1\';this.src=\'images/products/placeholder.svg\'}">';
            }).join('') +
            '</div>' +
            (_modalImages.length > 1 ? '<button id="modalStripPrev" onclick="modalStripNav(-1)" style="position:absolute;left:4px;top:50%;transform:translateY(-50%);z-index:5;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#333;box-shadow:0 1px 4px rgba(0,0,0,0.15)">‹</button>' : '') +
            (_modalImages.length > 1 ? '<button id="modalStripNext" onclick="modalStripNav(1)" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:5;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#333;box-shadow:0 1px 4px rgba(0,0,0,0.15)">›</button>' : '') +
        '</div>' +
        '<div style="padding:24px 32px 32px">' +
          '<h2 style="font-size:20px;margin:0 0 4px;line-height:1.3">' + (product.name || '') + '</h2>' +
          '<div style="display:flex;align-items:center;gap:8px;margin:0 0 4px"><span style="font-size:18px;font-weight:700;color:#e94560">' + (product.price || '') + '</span>' + (product.onSale ? '<span style="background:#d32f2f;color:#fff;font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:0.5px">SALE</span>' : '') + '</div>' +
          '<p style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;font-weight:600;margin:0 0 8px">' + (product.category0 ? product.category0 + ' / ' : '') + (product.category1 || '') + (product.category2 ? ' · ' + product.category2 : '') + '</p>' +
          colorPickerHtml +
          sizesHtml +
          '<p style="color:#666;margin:0 0 16px;line-height:1.6;font-size:14px">' + (product.description || '') + '</p>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' +
          '<span style="font-size:0.8rem;font-weight:600;padding:4px 10px;border-radius:4px;' + (totalAvail > 0 ? 'background:#e8f5e9;color:#2e7d32' : 'background:#ffebee;color:#c62828') + '">' + (totalAvail > 3 ? 'In Stock' : totalAvail > 0 ? 'Only ' + totalAvail + ' left' : 'Out of Stock') + '</span>' +
           (totalAvail > 0 ? '<button id="modalAddToCartBtn" onclick="addToCartFromModal(' + product.id + ')" style="padding:12px 32px;border-radius:8px;border:none;font-weight:600;font-size:14px;background:#e94560;color:#fff;cursor:pointer">' + (productHasSizes ? 'Select a size' : 'Add to Cart') + '</button>' : '<button id="modalAddToCartBtn" disabled style="padding:12px 32px;border-radius:8px;border:none;font-weight:600;font-size:14px;background:#ccc;color:#888;cursor:not-allowed">Out of Stock</button>') +
           '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      var stripImg = e.target.closest('.modal-strip-img');
      if (stripImg) {
        var idx = parseInt(stripImg.dataset.index);
        if (isNaN(idx)) idx = 0;
        currentModalImages = _modalImages.slice();
        currentImageIndex = idx;
        openFullscreen();
      }
      if (e.target === this) closeLiveModal();
    });
    if (window.innerWidth <= 768) {
      overlay.style.padding = '0';
      overlay.style.alignItems = 'stretch';
      var card = overlay.querySelector('div');
      if (card) { card.style.maxWidth = '100%'; card.style.borderRadius = '0'; card.style.maxHeight = '100vh'; }
      var closeBtn = overlay.querySelector('button');
      if (closeBtn) closeBtn.classList.add('modal-close-mobile');
    }
    lockBody();
    try { history.pushState({modal: true}, '', '#modal'); } catch (e) {}
  } catch (e) {
    console.error('openModal error:', e);
  }
}

// Modal color + size selection
var _modalSelectedColor = null;
var _modalSelectedSize = null;

function selectModalColor(el, color) {
  var container = document.getElementById('modalColorContainer');
  if (container) {
    container.querySelectorAll('.modal-color-btn').forEach(function(b) {
      var c = b.dataset.color;
      var hex = colorToHex(c);
      var isLight = isLightColor(hex);
      b.style.border = c === color ? '1.5px solid #e94560' : '1.5px solid rgba(0,0,0,0.2)';
      b.classList.toggle('modal-color-active', c === color);
    });
    container.querySelectorAll('span').forEach(function(s) {
      var parent = s.parentElement;
      if (parent) {
        var btn = parent.querySelector('.modal-color-btn');
        if (btn) {
          var active = btn.dataset.color === color;
          s.style.color = active ? '#e94560' : '#888';
          s.style.fontWeight = active ? '600' : '400';
        }
      }
    });
  }
  _modalSelectedColor = color;
  _modalSelectedSize = null;
  var p = _modalProduct;
  if (p) {
    // If color has bound images, switch to those; otherwise show all product-level images
    var variant = p.variants && p.variants[color];
    if (variant && variant.images && variant.images.length > 0) {
      _modalImages = variant.images.slice();
    } else {
      var productImgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images.slice() : [p.image || 'images/products/placeholder.svg'];
      _modalImages = productImgs;
    }
    // Rebuild the scrollable strip
    var mediaContainer = document.getElementById('modalMediaContainer');
    if (mediaContainer) {
      mediaContainer.innerHTML = _modalImages.map(function(img, idx) {
        return '<img class="modal-strip-img" data-index="' + idx + '" src="' + img + '" style="height:500px;width:100%;flex:0 0 100%;object-fit:contain;background:#fff;cursor:pointer;scroll-snap-align:start" onerror="if(this.dataset.retry){this.style.display=\'none\'}else{this.dataset.retry=\'1\';this.src=\'images/products/placeholder.svg\'}">';
      }).join('');
      _modalImageIdx = 0;
      mediaContainer.scrollTo({ left: 0, behavior: 'smooth' });
    }
    // Show/hide nav buttons based on new count
    var prev = document.getElementById('modalStripPrev');
    var next = document.getElementById('modalStripNext');
    if (prev) prev.style.display = _modalImages.length > 1 ? 'flex' : 'none';
    if (next) next.style.display = _modalImages.length > 1 ? 'flex' : 'none';
    // Update sizes for this color
    var vSizes = getVariantSizes(p, color);
    var sizeContainer = document.getElementById('modalSizesContainer');
    if (sizeContainer) {
      if (vSizes.length > 0) {
        sizeContainer.innerHTML = vSizes.map(function(s) {
          var sStock = getVariantStock(p, color, s);
          var sClass = sStock > 0 ? 'modal-size-btn' : 'modal-size-btn size-oos';
          var sLabel = sStock > 0 ? s : s + ' (OOS)';
          return '<button class="' + sClass + '" data-size="' + s + '" onclick="selectModalSize(this,\'' + s + '\')">' + sLabel + '</button>';
        }).join('');
        sizeContainer.style.display = 'flex';
        updateModalAddBtn(p, color, null);
      } else {
        sizeContainer.style.display = 'none';
        updateModalAddBtn(p, color, null);
      }
    }
  }
}

function selectModalSize(el, size) {
  document.querySelectorAll('#liveModal .modal-size-btn').forEach(function(b) { b.style.borderColor = '#ddd'; b.style.background = '#f5f5f7'; });
  el.style.borderColor = '#e94560';
  el.style.background = '#ffe8eb';
  _modalSelectedSize = size;
  updateModalAddBtn(_modalProduct, _modalSelectedColor, size);
}

function updateModalAddBtn(p, color, size) {
  var btn = document.getElementById('modalAddToCartBtn');
  if (!btn) return;
  if (size) {
    var sStock = p && color ? getVariantStock(p, color, size) : 0;
    if (sStock <= 0) {
      btn.disabled = true;
      btn.textContent = 'Out of Stock';
      btn.style.background = '#ccc';
      btn.style.color = '#888';
      btn.style.cursor = 'not-allowed';
      btn.onclick = null;
    } else {
      btn.disabled = false;
      btn.textContent = 'Add to Cart (' + size + ')';
      btn.style.background = '#e94560';
      btn.style.color = '#fff';
      btn.style.cursor = 'pointer';
      btn.onclick = function() { addToCartFromModal(_modalProduct ? _modalProduct.id : null); };
    }
    return;
  }
  // No size selected — check if color has any available variant
  var hasStock = false;
  if (p && color) {
    var sizes = getVariantSizes(p, color);
    if (sizes.length > 0) {
      sizes.forEach(function(s) { if (getVariantStock(p, color, s) > 0) hasStock = true; });
      btn.disabled = true;
      btn.textContent = hasStock ? 'Select a size' : 'Out of Stock';
      btn.style.background = hasStock ? '#e94560' : '#ccc';
      btn.style.color = '#fff';
      btn.style.cursor = hasStock ? 'pointer' : 'not-allowed';
      btn.onclick = hasStock ? null : null;
    } else {
      var qStock = getVariantStock(p, color, 'q');
      if (qStock <= 0) {
        btn.disabled = true;
        btn.textContent = 'Out of Stock';
        btn.style.background = '#ccc';
        btn.style.color = '#888';
        btn.style.cursor = 'not-allowed';
        btn.onclick = null;
      } else {
        btn.disabled = false;
        btn.textContent = 'Add to Cart';
        btn.style.background = '#e94560';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        btn.onclick = function() { addToCartFromModal(_modalProduct ? _modalProduct.id : null); };
      }
    }
  }
}

function addToCartFromModal(productId) {
  var p = products.find(function(x) { return x.id === productId; });
  if (!p) return;
  if (hasSizes(p)) {
    if (!_modalSelectedColor) { showToast('Please select a color first.', 'info'); return; }
    if (!_modalSelectedSize) { showToast('Please select a size first.', 'info'); return; }
    addToCart(productId, _modalSelectedColor, _modalSelectedSize);
  } else {
    var color = _modalSelectedColor || getVariantColors(p)[0] || '';
    addToCart(productId, color);
  }
  closeLiveModal();
}

var _modalImgRetry = 0;
function showModalImage() {
  const img = document.getElementById('modalImage');
  if (!img) { console.error('modalImage element not found!'); return; }
  img.onerror = function() {
    if (_modalImgRetry > 0) { this.onerror = null; this.style.display = 'none'; return; }
    _modalImgRetry++;
    this.src = 'images/products/placeholder.svg';
  };
  img.src = currentModalImages[currentImageIndex] || 'images/products/placeholder.svg';
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (currentModalImages.length > 1) {
    dotsContainer.innerHTML = currentModalImages.map((_, i) =>
      `<span class="carousel-dot ${i === currentImageIndex ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    dotsContainer.style.display = '';
    prevBtn.style.display = '';
    nextBtn.style.display = '';
  } else {
    dotsContainer.innerHTML = '';
    dotsContainer.style.display = 'none';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
}

var cp = document.getElementById('carouselPrev');
if (cp) cp.addEventListener('click', () => {
  if (currentModalImages.length < 2) return;
  currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
  showModalImage();
});

var cn = document.getElementById('carouselNext');
if (cn) cn.addEventListener('click', () => {
  if (currentModalImages.length < 2) return;
  currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
  showModalImage();
});

var cd = document.getElementById('carouselDots');
if (cd) cd.addEventListener('click', e => {
  const dot = e.target.closest('.carousel-dot');
  if (!dot) return;
  currentImageIndex = parseInt(dot.dataset.index);
  showModalImage();
});

function closeModal() {
  console.log('[Trace] closeModal()');
  var pm = document.getElementById('productModal');
  if (pm) { pm.classList.remove('active'); pm.style.display = ''; }
  unlockBody();
  currentModalImages = [];
  currentImageIndex = 0;
  if (location.hash === '#modal') history.back();
}

var pm = document.getElementById('productModal');
if (pm) pm.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
var mc = document.querySelector('#productModal .modal-close');
if (mc) mc.addEventListener('click', closeModal);
// Fullscreen image viewer
function openFullscreen() {
  if (currentModalImages.length === 0) return;
  console.log('[Trace] openFullscreen() — images:', currentModalImages.length, 'startIdx:', currentImageIndex);
  var old = document.getElementById('liveFullscreen');
  if (old) old.remove();
  var ov = document.createElement('div');
  ov.id = 'liveFullscreen';
  ov.style.cssText = 'display:flex!important;position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:#fff!important;z-index:99999!important;overflow:hidden;';
  document.body.appendChild(ov);
  var track = document.createElement('div');
  track.style.cssText = 'position:relative;width:100%;height:100%;display:flex;flex-direction:column;';
  var w = window.innerWidth;
  var h = window.innerHeight;
  window._fsSlideH = h;
  var slides = [];
  for (var i = 0; i < currentModalImages.length; i++) {
    var slide = document.createElement('div');
    slide.style.cssText = 'width:100vw;height:' + h + 'px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative;';
    var img = document.createElement('img');
    img.dataset.src = currentModalImages[i];
    if (Math.abs(i - currentImageIndex) <= 1) img.src = currentModalImages[i];
    img.style.cssText = 'max-width:100vw;max-height:' + h + 'px;object-fit:contain;user-select:none;';
    slides.push(img);
    slide.appendChild(img);
    track.appendChild(slide);
  }
  if (currentModalImages.length === 1) {
    var theImg = slides[0];
    var theSlide = theImg.parentNode;
    var zoomLevel = 1;
    var lastTap = 0;
    var pinching = false;
    var initialDist = 0;
    var initialZoom = 1;
    var panX = 0, panY = 0;
    var panStartX = 0, panStartY = 0;
    var panStartTouchX = 0, panStartTouchY = 0;
    var isPanning = false;
    var wasPanning = false;
    theImg.style.transition = 'transform 0.2s ease';
    theImg.style.transformOrigin = 'center center';
    function applyZoom() {
      if (zoomLevel > 1) {
        theImg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoomLevel + ')';
      } else {
        panX = 0; panY = 0;
        theImg.style.transform = 'scale(1)';
      }
    }
    theSlide.addEventListener('click', function(e) {
      if (wasPanning) { wasPanning = false; return; }
      var now = Date.now();
      if (now - lastTap < 300) {
        zoomLevel = zoomLevel > 1 ? 1 : 3;
        applyZoom();
        lastTap = 0;
      } else {
        lastTap = now;
        if (zoomLevel > 1) {
          zoomLevel = 1;
          applyZoom();
          lastTap = 0;
        }
      }
    });
    theSlide.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        pinching = true;
        initialDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = zoomLevel;
        theImg.style.transition = 'none';
      } else if (e.touches.length === 1 && zoomLevel > 1) {
        isPanning = true;
        panStartTouchX = e.touches[0].clientX;
        panStartTouchY = e.touches[0].clientY;
        panStartX = panX;
        panStartY = panY;
        theImg.style.transition = 'none';
      }
    }, { passive: false });
    theSlide.addEventListener('touchmove', function(e) {
      if (pinching && e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        var dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        zoomLevel = Math.max(1, Math.min(5, initialZoom * (dist / initialDist)));
        applyZoom();
      } else if (isPanning && e.touches.length === 1) {
        e.preventDefault();
        var dx = e.touches[0].clientX - panStartTouchX;
        var dy = e.touches[0].clientY - panStartTouchY;
        panX = panStartX + dx;
        panY = panStartY + dy;
        theImg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoomLevel + ')';
      }
    }, { passive: false });
    theSlide.addEventListener('touchend', function(e) {
      if (pinching) {
        e.stopPropagation();
        if (e.touches.length < 2) {
          pinching = false;
          theImg.style.transition = 'transform 0.2s ease';
          if (zoomLevel < 1.5) {
            zoomLevel = 1;
            applyZoom();
          }
          initialDist = 0;
        }
      }
      if (isPanning) {
        isPanning = false;
        theImg.style.transition = 'transform 0.2s ease';
        if (Math.abs(panX - panStartX) > 5 || Math.abs(panY - panStartY) > 5) {
          wasPanning = true;
        }
      }
    });
    theSlide.addEventListener('mousedown', function(e) {
      if (zoomLevel > 1 && e.button === 0) {
        isPanning = true;
        panStartTouchX = e.clientX;
        panStartTouchY = e.clientY;
        panStartX = panX;
        panStartY = panY;
        theImg.style.transition = 'none';
        e.preventDefault();
      }
    });
    document.addEventListener('mousemove', function(e) {
      if (isPanning) {
        var dx = e.clientX - panStartTouchX;
        var dy = e.clientY - panStartTouchY;
        panX = panStartX + dx;
        panY = panStartY + dy;
        theImg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoomLevel + ')';
      }
    });
    document.addEventListener('mouseup', function(e) {
      if (isPanning) {
        isPanning = false;
        theImg.style.transition = 'transform 0.2s ease';
        if (Math.abs(panX - panStartX) > 5 || Math.abs(panY - panStartY) > 5) {
          wasPanning = true;
        }
      }
    });
  }
  ov._slides = slides;
  track.style.transform = 'translate3d(0,' + (-currentImageIndex * h) + 'px,0)';
  ov.appendChild(track);
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00D7';
  closeBtn.style.cssText = 'position:fixed!important;top:16px!important;right:20px!important;background:rgba(0,0,0,0.06)!important;border:none!important;color:#333!important;font-size:2rem!important;width:44px!important;height:44px!important;border-radius:50%!important;cursor:pointer!important;z-index:999999!important;display:flex!important;align-items:center!important;justify-content:center!important;';
  closeBtn.onclick = closeFullscreen;
  closeBtn.addEventListener('touchstart', function(e) { e.stopPropagation(); closeFullscreen(); });
  closeBtn.addEventListener('touchend', function(e) { e.preventDefault(); });
  ov.appendChild(closeBtn);
  var counter = document.createElement('div');
  counter.id = 'fsCounter';
  counter.style.cssText = 'position:fixed!important;top:20px!important;left:50%!important;transform:translateX(-50%)!important;color:rgba(0,0,0,0.4)!important;font-size:0.85rem!important;z-index:10!important;pointer-events:none!important;';
  counter.textContent = (currentImageIndex + 1) + ' / ' + currentModalImages.length;
  ov.appendChild(counter);
  ov.addEventListener('click', function(e) { if (e.target === this) closeFullscreen(); });
  lockBody();
  try { history.pushState({fullscreen: true}, '', '#fullscreen'); } catch (e) {}
}

function closeFullscreen() {
  var ov = document.getElementById('liveFullscreen');
  if (ov) ov.remove();
  var modal = document.getElementById('productModal');
  var live = document.getElementById('liveModal');
  if ((!modal || !modal.classList.contains('active')) && !live) unlockBody();
  if (location.hash === '#fullscreen') {
    try { history.back(); } catch (e) {}
  }
}

function updateCounter() {
  var el = document.getElementById('fsCounter') || document.getElementById('fullscreenCounter');
  if (el) el.textContent = (currentImageIndex + 1) + ' / ' + currentModalImages.length;
}

function getFullscreenTrack() {
  var ov = document.getElementById('liveFullscreen');
  return ov ? ov.firstElementChild : document.getElementById('fullscreenTrack');
}

function loadSlideImages(idx) {
  var ov = document.getElementById('liveFullscreen');
  if (!ov || !ov._slides) return;
  for (var i = Math.max(0, idx - 1); i <= Math.min(currentModalImages.length - 1, idx + 1); i++) {
    var img = ov._slides[i];
    if (img && !img.src && img.dataset.src) img.src = img.dataset.src;
  }
}

// Fullscreen swipe / drag (vertical)
(function() {
  var startY = 0;
  var dragging = false;
  var dragOffset = 0;

  function isActive() { return !!document.getElementById('liveFullscreen'); }

  function nav(dir) {
    if (currentModalImages.length < 2) return;
    var next = currentImageIndex + dir;
    if (next < 0 || next >= currentModalImages.length) return;
    currentImageIndex = next;
    updateCounter();
    loadSlideImages(next);
    var h = window._fsSlideH || window.innerHeight;
    var tr = getFullscreenTrack();
    if (!tr) return;
    tr.style.transition = 'transform 0.3s ease';
    tr.style.transform = 'translate3d(0,' + (-next * h) + 'px,0)';
  }

  document.addEventListener('touchstart', function(e) {
    if (!isActive()) return;
    if (e.touches.length > 1) return;
    var t = e.touches[0];
    if (!t) return;
    startY = t.clientY;
    dragOffset = 0;
    dragging = true;
    var tr = getFullscreenTrack();
    if (tr) tr.style.transition = 'none';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    if (!dragging || !isActive()) return;
    if (currentModalImages.length < 2) { dragging = false; return; }
    var t = e.touches[0];
    if (!t) return;
    var dy = t.clientY - startY;
    var h = window._fsSlideH || window.innerHeight;
    dragOffset = dy;
    var tr = getFullscreenTrack();
    if (!tr) return;
    tr.style.transition = 'none';
    var offset = dy * 0.3;
    if (currentImageIndex === 0) offset = Math.min(offset, 0);
    if (currentImageIndex === currentModalImages.length - 1) offset = Math.max(offset, 0);
    tr.style.transform = 'translate3d(0,' + (-currentImageIndex * h + offset) + 'px,0)';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (!dragging) return;
    dragging = false;
    if (currentModalImages.length < 2) return;
    if (Math.abs(dragOffset) > 50) {
      nav(dragOffset < 0 ? 1 : -1);
    } else {
      var h = window._fsSlideH || window.innerHeight;
      var tr = getFullscreenTrack();
      if (!tr) return;
      tr.style.transition = 'transform 0.3s ease';
      tr.style.transform = 'translate3d(0,' + (-currentImageIndex * h) + 'px,0)';
    }
  }, { passive: true });

  document.addEventListener('wheel', function(e) {
    if (!isActive()) return;
    if (currentModalImages.length < 2) return;
    if (Math.abs(e.deltaY) < 20) return;
    nav(e.deltaY > 0 ? 1 : -1);
  }, { passive: true });
})();

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    var live = document.getElementById('liveModal');
    if (live) { closeLiveModal(); return; }
    if (document.getElementById('liveFullscreen')) {
      closeFullscreen();
      return;
    }
    closeModal();
    return;
  }
  if (document.getElementById('liveFullscreen')) {
    if (e.key === 'ArrowUp') {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateCounter();
        loadSlideImages(currentImageIndex);
        var tr = getFullscreenTrack();
        if (tr) {
          var h2 = window.innerHeight;
          tr.style.transition = 'transform 0.3s ease';
          tr.style.transform = 'translate3d(0,' + (-currentImageIndex * h2) + 'px,0)';
        }
      }
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      if (currentImageIndex < currentModalImages.length - 1) {
        currentImageIndex++;
        updateCounter();
        loadSlideImages(currentImageIndex);
        var tr = getFullscreenTrack();
        if (tr) {
          var h2 = window.innerHeight;
          tr.style.transition = 'transform 0.3s ease';
          tr.style.transform = 'translate3d(0,' + (-currentImageIndex * h2) + 'px,0)';
        }
      }
      e.preventDefault();
    }
    return;
  }
  if (!document.getElementById('productModal').classList.contains('active')) return;
  if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
    currentImageIndex--;
    showModalImage();
  }
  if (e.key === 'ArrowRight' && currentImageIndex < currentModalImages.length - 1) {
    currentImageIndex++;
    showModalImage();
  }
});

var si = document.getElementById('searchInput');
if (si) si.addEventListener('input', e => {
  currentSearch = e.target.value;
  mainPage = 1; renderProducts();
});

function doSearch(e) {
  if (e) e.preventDefault();
  var input = document.getElementById('searchInput');
  input.readOnly = true;
  input.blur();
  setTimeout(function() {
    input.readOnly = false;
    requestAnimationFrame(function() {
      var el = document.querySelector('.product-card .product-image') || document.getElementById('productGrid');
      if (el) {
        var y = el.getBoundingClientRect().top + window.pageYOffset - 250;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    });
  }, 600);
}

if (si) si.addEventListener('search', doSearch);

if (si) si.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    doSearch(e);
  }
});

// ---- ADMIN PANEL ----

var productsPage = 1;
var productsLimit = 50;

function renderAdminList() {
  console.log('[Trace] renderAdminList() — total products:', products.length, 'page:', productsPage, 'filter:', adminFilterGroup, adminFilterType, adminFilterBrand, adminFilterColor, 'search:', adminSearchVal);
  renderAdminFilterDropdowns();
  var container = document.getElementById('adminProductList');
  var filtered = products;
  if (adminSearchVal) {
    var q = adminSearchVal.toLowerCase();
    filtered = filtered.filter(function(p) {
      return (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
             (p.category0 && p.category0.toLowerCase().indexOf(q) !== -1) ||
             (p.category1 && p.category1.toLowerCase().indexOf(q) !== -1) ||
             (p.category2 && p.category2.toLowerCase().indexOf(q) !== -1) ||
             (p.color && p.color.toLowerCase().indexOf(q) !== -1);
    });
  }
  if (adminFilterGroup !== 'all') {
    filtered = filtered.filter(function(p) { return p.category0 === adminFilterGroup; });
  }
  if (adminFilterType !== 'all') {
    filtered = filtered.filter(function(p) { return p.category1 === adminFilterType; });
  }
  if (adminFilterBrand !== 'all') {
    filtered = filtered.filter(function(p) { return p.category2 === adminFilterBrand; });
  }
  if (adminFilterColor !== 'all') {
    filtered = filtered.filter(function(p) { return (p.color || '') === adminFilterColor; });
  }
  // Sale items on top, then newest first (descending by id)
  filtered = filtered.sort(function(a, b) {
    if (a.onSale && !b.onSale) return -1;
    if (!a.onSale && b.onSale) return 1;
    return b.id - a.id;
  });
  var totalProducts = filtered.length;
  var totalProductPages = Math.max(1, Math.ceil(totalProducts / productsLimit));
  if (productsPage > totalProductPages) { productsPage = totalProductPages; renderAdminList(); return; }
  var start = (productsPage - 1) * productsLimit;
  var pageItems = filtered.slice(start, start + productsLimit);
  document.getElementById('productCount').textContent = totalProducts + (totalProducts > productsLimit ? ' (Page ' + productsPage + '/' + totalProductPages + ')' : '');
  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;padding:2rem">' + (products.length === 0 ? 'No products yet. Add your first product!' : 'No products match your filters.') + '</p>';
    return;
  }
  container.innerHTML = pageItems.map(function(p) {
    var catStr = p.category1;
    if (p.category0) catStr = p.category0 + ' / ' + catStr;
    if (p.category2) catStr += ' · ' + p.category2;
    if (p.color) catStr += ' · ' + p.color;
    var allSizes = [];
    if (p.variants) { for (var c in p.variants) { (p.variants[c].sizes || []).forEach(function(s) { if (allSizes.indexOf(s) === -1) allSizes.push(s); }); } }
    var sizesStr = allSizes.length > 0 ? ' · Sizes: ' + allSizes.join(', ') : '';
    var stockStr = ' · Stock: ' + getTotalStock(p.id);
    return '<div class="admin-product-item' + (p.onSale ? ' on-sale' : '') + '" data-id="' + p.id + '">' +
      '<img src="' + (p.images?.[0] || 'images/products/placeholder.svg') + '" alt="' + p.name + '" onerror="if(this.dataset.retry)this.style.display=\'none\';else{this.dataset.retry=\'1\';this.src=\'images/products/placeholder.svg\'}">' +
      '<div class="admin-product-item-info">' +
      '<div class="name">' + (p.onSale ? '<span class="sale-badge">SALE</span> ' : '') + p.name + '</div>' +
      '<div class="meta">' + catStr + ' · ' + p.price + sizesStr + stockStr + '</div>' +
      '</div>' +
      '<div class="admin-product-item-actions">' +
      '<button class="btn btn-sm ' + (p.available !== false ? 'btn-success' : 'btn-secondary') + ' toggle-available-btn">' + (p.available !== false ? 'Available' : 'Hidden') + '</button>' +
      '<button class="btn btn-sm ' + (p.onSale ? 'btn-danger' : 'btn-outline-danger') + ' toggle-sale-btn">' + (p.onSale ? 'Sale' : 'Regular') + '</button>' +
      '<button class="btn btn-secondary btn-sm edit-product-btn">Edit</button>' +
      '<button class="btn btn-danger btn-sm delete-product-btn">Delete</button>' +
      '</div></div>';
  }).join('') + productPaginationHtml(totalProductPages);

  container.querySelectorAll('.toggle-available-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.admin-product-item').dataset.id);
      const p = products.find(x => x.id === id);
      if (p) {
        p.available = p.available === false;
        saveProducts();
        renderAdminList();
        renderProducts();
        renderFilters();
      }
    });
  });

  container.querySelectorAll('.toggle-sale-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.admin-product-item').dataset.id);
      const p = products.find(x => x.id === id);
      if (p) {
        p.onSale = !p.onSale;
        saveProducts();
        renderAdminList();
        renderProducts();
      }
    });
  });

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

function renderCategoryDropdowns() {
  var groupSelect = document.getElementById('formCategory0');
  var typeSelect = document.getElementById('formCategory1');
  var brandSelect = document.getElementById('formCategory2');
  if (!groupSelect || !typeSelect || !brandSelect) return;

  var groups = getGroups();
  groupSelect.innerHTML = groups.map(function(g) {
    return '<option value="' + g.name + '">' + g.name + '</option>';
  }).join('');

  updateSubcategoryDropdown();
  updateBrandDropdown();
  renderVariantsEditor();
}

function updateSubcategoryDropdown() {
  var groupSelect = document.getElementById('formCategory0');
  var typeSelect = document.getElementById('formCategory1');
  if (!groupSelect || !typeSelect) return;
  var group = groupSelect.value;
  var subs = getSubcategories(group);
  var currentVal = typeSelect.value;
  typeSelect.innerHTML = '<option value="">Select subcategory...</option>' + subs.map(function(t) {
    var sel = t === currentVal ? ' selected' : '';
    return '<option value="' + t + '"' + sel + '>' + t + '</option>';
  }).join('');
  updateBrandDropdown();
}

function updateBrandDropdown() {
  var groupSelect = document.getElementById('formCategory0');
  var typeSelect = document.getElementById('formCategory1');
  var brandSelect = document.getElementById('formCategory2');
  if (!groupSelect || !typeSelect || !brandSelect) return;
  var group = groupSelect.value;
  var sub = typeSelect.value;
  var filtered = products.filter(function(p) { return p.available !== false; });
  if (group) filtered = filtered.filter(function(p) { return p.category0 === group; });
  if (sub) filtered = filtered.filter(function(p) { return p.category1 === sub; });
  var usedBrands = [...new Set(filtered.map(function(p) { return p.category2; }).filter(Boolean))].sort();
  var allBrands = categoriesConfig.brands.slice();
  usedBrands.forEach(function(b) { if (allBrands.indexOf(b) === -1) allBrands.push(b); });
  var currentVal = brandSelect.value;
  brandSelect.innerHTML = '<option value="">Select brand...</option>' + allBrands.map(function(b) {
    var sel = b === currentVal ? ' selected' : '';
    return '<option value="' + b + '"' + sel + '>' + b + '</option>';
  }).join('');
}

function renderVariantImagePreview(vi) {
  var preview = document.querySelector('.variant-image-preview[data-vi="' + vi + '"]');
  if (!preview) return;
  var imgs = variantImagesData[vi] || [];
  if (imgs.length === 0) {
    preview.innerHTML = '';
    return;
  }
  preview.innerHTML = imgs.map(function(src, idx) {
    return '<span style="position:relative;display:inline-block;margin:2px"><img src="' + src + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;border:1px solid #ddd"><button type="button" class="btn-variant-remove-image" data-vi="' + vi + '" data-idx="' + idx + '" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;border:none;background:#dc3545;color:#fff;font-size:12px;line-height:1;cursor:pointer;padding:0">×</button></span>';
  }).join('');
}
function renderVariantProductImageSelect(vi) {
  var grid = document.querySelector('.variant-pimg-grid[data-vi="' + vi + '"]');
  if (!grid) return;
  if (!selectedImagesData || selectedImagesData.length === 0) {
    grid.innerHTML = '<span style="color:#999;font-size:11px">No product images</span>';
    return;
  }
  var vImgs = variantImagesData[vi] || [];
  grid.innerHTML = selectedImagesData.map(function(src, i) {
    var checked = vImgs.indexOf(src) !== -1;
    return '<label style="display:inline-flex;flex-direction:column;align-items:center;margin:3px;cursor:pointer;border:2px solid ' + (checked ? '#007bff' : '#ddd') + ';border-radius:6px;padding:2px"><img src="' + src + '" style="width:55px;height:55px;object-fit:cover;border-radius:4px"><input type="checkbox" class="variant-pimg-cb" data-vi="' + vi + '" data-idx="' + i + '"' + (checked ? ' checked' : '') + ' style="margin-top:2px;cursor:pointer"></label>';
  }).join('');
}

function renderAllVariantProductImageSelects() {
  var rows = document.querySelectorAll('.variant-row');
  rows.forEach(function(r) {
    var vi = r.dataset.vi;
    if (vi !== undefined) renderVariantProductImageSelect(vi);
  });
}

function renderVariantsEditor() {
  var container = document.getElementById('formVariantsContainer');
  if (!container) return;
  var rows = container.querySelectorAll('.variant-row');
  var variantColors = [];
  rows.forEach(function(r) {
    var sel = r.querySelector('.form-variant-color');
    if (sel && sel.value) variantColors.push(sel.value);
  });
  // Populate each row's color dropdown
  var allColors = (categoriesConfig.colors || []).slice();
  products.forEach(function(p) {
    var vc = getVariantColors(p);
    vc.forEach(function(c) { if (allColors.indexOf(c) === -1 && c !== 'Default') allColors.push(c); });
  });
  rows.forEach(function(r, i) {
    var sel = r.querySelector('.form-variant-color');
    if (!sel) return;
    var currentVal = sel.value;
    sel.innerHTML = '<option value="">Select color...</option>' + allColors.filter(function(c) {
      return variantColors.indexOf(c) === -1 || c === currentVal;
    }).map(function(c) {
      var selected = c === currentVal ? ' selected' : '';
      return '<option value="' + c + '"' + selected + '>' + c + '</option>';
    }).join('');
    // Sizes: show checkboxes with stock inputs using size presets
    var sizesDiv = r.querySelector('.variant-sizes');
    if (sizesDiv) {
      var currentSizes = {};
      sizesDiv.querySelectorAll('.vs-row').forEach(function(sr) {
        var cb = sr.querySelector('.vs-size');
        var stockInput = sr.querySelector('.vs-stock');
        if (cb && cb.checked && stockInput) currentSizes[cb.value] = stockInput.value;
      });
      var allSizes = sortSizes(categoriesConfig.sizes);
      sizesDiv.innerHTML = allSizes.map(function(s) {
        var checked = currentSizes[s] !== undefined ? ' checked' : '';
        var stockVal = currentSizes[s] !== undefined ? currentSizes[s] : 5;
        return '<label class="vs-row" style="display:inline-flex;align-items:center;gap:4px;margin:2px 6px 2px 0;font-size:0.8rem;white-space:nowrap"><input type="checkbox" class="vs-size" value="' + s + '"' + checked + '> ' + s + ' <input type="number" class="vs-stock" value="' + stockVal + '" min="0" style="width:40px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label>';
      }).join('');
    }
    // Update variant image preview
    var vi = r.dataset.vi;
    if (vi !== undefined) renderVariantImagePreview(vi);
    // Remove button
    var rmBtn = r.querySelector('.variant-remove-btn');
    if (rmBtn) rmBtn.style.display = rows.length > 1 ? 'inline-block' : 'none';
  });
  var modeEl = document.getElementById('formVariantMode');
  if (modeEl) applyVariantMode(modeEl.value);
  rows.forEach(function(r) {
    var vi = r.dataset.vi;
    if (!r.querySelector('.variant-pimg-grid')) {
      var grid = document.createElement('div');
      grid.className = 'variant-pimg-grid';
      grid.setAttribute('data-vi', vi);
      grid.style.cssText = 'margin-top:4px;display:none;max-height:120px;overflow-y:auto';
      var section = r.querySelector('.variant-images-section');
      if (section) section.appendChild(grid);
    }
  });
  renderAllVariantProductImageSelects();
}

function applyVariantMode(mode) {
  var container = document.getElementById('formVariantsContainer');
  if (!container) return;
  container.querySelectorAll('.variant-row').forEach(function(r) {
    var sel = r.querySelector('.form-variant-color');
    var inp = r.querySelector('.form-variant-design');
    if (!sel || !inp) return;
    if (mode === 'design') {
      sel.style.display = 'none';
      inp.style.display = 'inline-block';
      inp.style.width = '140px';
      inp.style.padding = '4px 6px';
      inp.style.border = '1px solid #ddd';
      inp.style.borderRadius = '4px';
      inp.style.fontSize = '0.8rem';
      var cur = sel.value;
      if (cur && !inp.value) inp.value = cur;
    } else {
      sel.style.display = 'inline-block';
      inp.style.display = 'none';
    }
  });
}

function resetForm() {
  editingId = null;
  document.getElementById('formTitle').textContent = 'Add Product';
  document.getElementById('formSubmitBtn').textContent = 'Add Product';
  document.getElementById('formCancelBtn').style.display = 'none';
  document.getElementById('productForm').reset();
  var depEl = document.getElementById('formDeposit');
  if (depEl) depEl.value = '';
  selectedImagesData = [];
  variantImagesData = {};
  renderImagePreview();
  // Reset variant editor to one empty row
  var container = document.getElementById('formVariantsContainer');
  if (container) {
    var allSizes = sortSizes(categoriesConfig.sizes || []);
    var sizesHtml = allSizes.map(function(s) {
      return '<label class="vs-row" style="display:inline-flex;align-items:center;gap:4px;margin:2px 6px 2px 0;font-size:0.8rem;white-space:nowrap"><input type="checkbox" class="vs-size" value="' + s + '"> ' + s + ' <input type="number" class="vs-stock" value="5" min="0" style="width:40px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label>';
    }).join('');
    container.innerHTML = '<div class="variant-row" data-vi="0"><select class="form-variant-color"><option value="">Select color...</option></select><input type="text" class="form-variant-design" style="display:none" placeholder="e.g. D1"><button type="button" class="btn btn-danger btn-sm variant-remove-btn" style="display:none">×</button><label style="margin-left:6px;font-size:0.75rem;color:#555">Stock: <input type="number" class="variant-qty" value="5" min="0" style="width:50px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label><div class="variant-sizes" style="margin-top:6px">' + sizesHtml + '</div><div class="variant-images-section" style="margin-top:6px;padding-top:6px;border-top:1px solid #eee"><label style="font-size:0.75rem;color:#666">Images for this variant:</label><div class="variant-image-preview" data-vi="0"></div><button type="button" class="btn btn-sm btn-outline-primary variant-add-image-btn">+ Upload</button><button type="button" class="btn btn-sm btn-outline-secondary variant-select-pimg-btn" style="font-size:0.75rem">From uploads</button><input type="file" class="variant-image-input" accept="image/*" multiple style="display:none"></div></div>';
  }
  renderVariantsEditor();
}

function populateForm(product) {
  console.log('[Trace] populateForm() — id:', product.id, 'name:', product.name, 'variants:', product.variants ? Object.keys(product.variants).join(',') : 'none');
  editingId = product.id;
  document.getElementById('formTitle').textContent = 'Edit Product';
  document.getElementById('formSubmitBtn').textContent = 'Save Changes';
  document.getElementById('formCancelBtn').style.display = 'inline-block';
  document.getElementById('formName').value = product.name;
  document.getElementById('formCategory0').value = product.category0 || '';
  updateSubcategoryDropdown();
  document.getElementById('formCategory1').value = product.category1 || '';
  updateBrandDropdown();
  document.getElementById('formCategory2').value = product.category2 || '';
  // Build variant rows from product.variants
  var container = document.getElementById('formVariantsContainer');
  variantImagesData = {};
  if (container && product.variants) {
    var colors = Object.keys(product.variants);
    if (colors.length === 0) colors = [''];
    container.innerHTML = colors.map(function(c, i) {
      var v = product.variants[c] || { sizes: [], stock: {} };
      var sortedSizes = sortSizes(categoriesConfig.sizes || []);
      var sizesHtml = sortedSizes.map(function(s) {
        var checked = v.sizes.indexOf(s) !== -1 ? ' checked' : '';
        var stockVal = v.stock && v.stock[s] !== undefined ? v.stock[s] : 5;
        return '<label class="vs-row" style="display:inline-flex;align-items:center;gap:4px;margin:2px 6px 2px 0;font-size:0.8rem;white-space:nowrap"><input type="checkbox" class="vs-size" value="' + s + '"' + checked + '> ' + s + ' <input type="number" class="vs-stock" value="' + stockVal + '" min="0" style="width:40px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label>';
      }).join('');
      var qtyVal = v.stock && v.stock.q !== undefined ? v.stock.q : 5;
      return '<div class="variant-row" data-vi="' + i + '"><select class="form-variant-color"><option value="">Select color...</option></select><input type="text" class="form-variant-design" style="display:none" placeholder="e.g. D1"><button type="button" class="btn btn-danger btn-sm variant-remove-btn" style="display:' + (colors.length > 1 ? 'inline-block' : 'none') + '">×</button><label style="margin-left:6px;font-size:0.75rem;color:#555">Stock: <input type="number" class="variant-qty" value="' + qtyVal + '" min="0" style="width:50px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label><div class="variant-sizes" style="margin-top:6px">' + sizesHtml + '</div><div class="variant-images-section" style="margin-top:6px;padding-top:6px;border-top:1px solid #eee"><label style="font-size:0.75rem;color:#666">Images for this variant:</label><div class="variant-image-preview" data-vi="' + i + '"></div><button type="button" class="btn btn-sm btn-outline-primary variant-add-image-btn">+ Upload</button><button type="button" class="btn btn-sm btn-outline-secondary variant-select-pimg-btn" style="font-size:0.75rem">From uploads</button><input type="file" class="variant-image-input" accept="image/*" multiple style="display:none"></div></div>';
    }).join('');
    // Load per-variant images
    colors.forEach(function(c, i) {
      var v = product.variants[c] || {};
      variantImagesData[i] = (v.images || []).slice();
    });
    renderVariantsEditor();
    // Now set selected color/design values
    var anyDesign = false;
    container.querySelectorAll('.variant-row').forEach(function(r, i) {
      if (i < colors.length) {
        var sel = r.querySelector('.form-variant-color');
        if (sel) sel.value = colors[i];
        var inp = r.querySelector('.form-variant-design');
        if (inp) inp.value = colors[i];
        if (categoriesConfig.colors.indexOf(colors[i]) === -1) anyDesign = true;
      }
    });
    // Auto-detect mode: if any variant key is not a standard color, switch to design
    var modeEl = document.getElementById('formVariantMode');
    if (modeEl) {
      modeEl.value = anyDesign ? 'design' : 'color';
      applyVariantMode(modeEl.value);
    }
  }
  document.getElementById('formPrice').value = product.price;
  var origEl = document.getElementById('formOriginalPrice');
  if (origEl) origEl.value = product.originalPrice || '';
  var depEl = document.getElementById('formDeposit');
  if (depEl) depEl.value = product.deposit !== undefined ? product.deposit : '';
  document.getElementById('formDesc').value = product.description;
  document.getElementById('formAvailable').checked = product.available !== false;
  var imgs = product.images || (product.image ? [product.image] : []);
  selectedImagesData = imgs.filter(function(img) { return img && img.indexOf('placeholder') === -1; });
  renderImagePreview();
  document.getElementById('formImage').value = '';
}

function editProduct(id) {
  console.log('[Trace] editProduct() — id:', id);
  const product = products.find(p => p.id === id);
  if (product) { console.log('[Trace] editProduct() — found:', product.name); populateForm(product); }
  else { console.warn('[Trace] editProduct() — NOT FOUND, id:', id); }
}

function deleteProduct(id) {
  console.log('[Trace] deleteProduct() — id:', id);
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  console.log('[Trace] deleteProduct() — products after delete:', products.length);
  saveProducts();
  renderAdminList();
  renderProducts();
  renderFilters();
}

var pf = document.getElementById('productForm');
if (pf) pf.addEventListener('submit', function(e) {
  e.preventDefault();
  var name = document.getElementById('formName').value.trim();
  var category0 = document.getElementById('formCategory0').value;
  var category1 = document.getElementById('formCategory1').value;
  var category2 = document.getElementById('formCategory2').value;
  var price = document.getElementById('formPrice').value.trim();
  if (price && price.indexOf('₱') !== 0) {
    var num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) price = '₱' + num.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  var description = document.getElementById('formDesc').value.trim();
  if (!name || !category0 || !category1 || !category2 || !price || !description) {
    var missing = [];
    if (!name) missing.push('Name');
    if (!category0) missing.push('Group');
    if (!category1) missing.push('Subcategory');
    if (!category2) missing.push('Brand');
    if (!price) missing.push('Price');
    if (!description) missing.push('Description');
    showToast('Please fill in: ' + missing.join(', '), 'error');
    console.error('[Save] Validation failed - missing fields:', missing);
    return;
  }

  // Build variants from editor
  var modeEl = document.getElementById('formVariantMode');
  var isDesign = modeEl && modeEl.value === 'design';
  var variants = {};
  var container = document.getElementById('formVariantsContainer');
  if (container) {
    container.querySelectorAll('.variant-row').forEach(function(r) {
      var label;
      if (isDesign) {
        var inp = r.querySelector('.form-variant-design');
        if (!inp || !inp.value.trim()) return;
        label = inp.value.trim();
      } else {
        var sel = r.querySelector('.form-variant-color');
        if (!sel || !sel.value) return;
        label = sel.value;
      }
      var stock = {};
      var sizes = [];
      r.querySelectorAll('.vs-row').forEach(function(sr) {
        var cb = sr.querySelector('.vs-size');
        var st = sr.querySelector('.vs-stock');
        if (cb && cb.checked) {
          sizes.push(cb.value);
          stock[cb.value] = parseInt(st ? st.value : 5) || 0;
        }
      });
      if (sizes.length === 0) {
        var qtyInp = r.querySelector('.variant-qty');
        stock.q = parseInt(qtyInp ? qtyInp.value : 5) || 0;
      }
      var vi = r.dataset.vi;
      var vImages = variantImagesData[vi] || [];
      variants[label] = { sizes: sizes, stock: stock };
      if (vImages.length > 0) variants[label].images = vImages;
    });
  }
  if (Object.keys(variants).length === 0) { showToast('Please add at least one variant.', 'error'); return; }
  var colorOrder = [];
  container.querySelectorAll('.variant-row').forEach(function(r) {
    if (isDesign) {
      var inp = r.querySelector('.form-variant-design');
      if (inp && inp.value.trim() && variants[inp.value.trim()]) colorOrder.push(inp.value.trim());
    } else {
      var sel = r.querySelector('.form-variant-color');
      if (sel && sel.value && variants[sel.value]) colorOrder.push(sel.value);
    }
  });

  var submitBtn = document.getElementById('formSubmitBtn');
  var origText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Uploading...';

  var toUpload = selectedImagesData.filter(function(s) { return s.startsWith('data:'); });
  var keep = selectedImagesData.filter(function(s) { return !s.startsWith('data:'); });

  // Also collect variant image data URLs for upload
  var variantDataUrls = [];
  Object.keys(variantImagesData).forEach(function(vi) {
    var imgs = variantImagesData[vi] || [];
    imgs.forEach(function(src) {
      if (src.startsWith('data:')) {
        if (toUpload.indexOf(src) === -1) {
          toUpload.push(src);
        }
        variantDataUrls.push({ vi: vi, src: src });
      }
    });
  });

  function finish(images) {
    var deposit = document.getElementById('formDeposit') ? document.getElementById('formDeposit').value.trim() : '';
    var originalPrice = document.getElementById('formOriginalPrice') ? document.getElementById('formOriginalPrice').value.trim() : '';
    var savedId;
    if (editingId) {
      var idx = products.findIndex(function(p) { return p.id === editingId; });
      if (idx !== -1) {
        var upd = { name: name, category0: category0, category1: category1, category2: category2, variants: variants, _colorOrder: colorOrder, price: price, description: description, images: images, available: document.getElementById('formAvailable').checked };
        if (deposit) upd.deposit = deposit;
        if (originalPrice) upd.originalPrice = originalPrice;
        else delete upd.originalPrice;
        products[idx] = Object.assign({}, products[idx], upd);
      }
      savedId = editingId;
      console.log('[Save] Updated existing product id=' + savedId + ', images count:', images.length);
    } else {
      var maxId = products.length > 0 ? Math.max.apply(null, products.map(function(p) { return p.id; })) : 0;
      var newId = maxId + 1;
      var newProd = { id: newId, name: name, category0: category0, category1: category1, category2: category2, variants: variants, _colorOrder: colorOrder, price: price, description: description, images: images, available: document.getElementById('formAvailable').checked };
      if (deposit) newProd.deposit = deposit;
      if (originalPrice) newProd.originalPrice = originalPrice;
      products.push(newProd);
      savedId = newId;
      console.log('[Save] Created new product id=' + savedId + ', name="' + name + '", images count:', images.length);
    }
    // Update stockMap so the admin list shows the new total immediately
    if (savedId !== undefined) {
      var p = products.find(function(x) { return x.id === savedId; });
      if (p && p.variants) {
        var t = 0;
        for (var c in p.variants) { var s = p.variants[c].stock || {}; for (var k in s) t += s[k]; }
        stockMap[savedId] = { q: t };
        syncStockToFirestore(savedId);
      }
    }
    saveProducts();
    console.log('[Save] Form submit complete: product id=' + savedId + ', total products=' + products.length + ', variants=' + Object.keys(variants).length);
    showToast('Product "' + name + '" saved! Syncing to GitHub...', 'success');
    resetForm();
    renderAdminList();
    renderProducts();
    renderFilters();
    submitBtn.disabled = false;
    submitBtn.textContent = origText;
  }

  if (toUpload.length === 0) {
    finish(keep.length > 0 ? keep : ['images/products/placeholder.svg']);
    return;
  }

  Promise.all(toUpload.map(function(src) { return uploadImage(src); })).then(function(urls) {
    // Map Cloudinary URLs back to variant images
    var urlMap = {};
    toUpload.forEach(function(src, i) { urlMap[src] = urls[i]; });
    variantDataUrls.forEach(function(m) {
      var idx = variantImagesData[m.vi].indexOf(m.src);
      if (idx !== -1 && urlMap[m.src]) {
        variantImagesData[m.vi][idx] = urlMap[m.src];
      }
    });
    // Determine which of the uploaded URLs belong to product-level images
    var productUploadCount = selectedImagesData.filter(function(s) { return s.startsWith('data:'); }).length;
    var productUrls = urls.slice(0, productUploadCount);
    finish(productUrls.concat(keep));
  }).catch(function(err) {
    console.error('[Save] Image upload failed:', err.message || err);
    showToast('Image upload failed: ' + (err.message || 'unknown error') + '. Saving product without images.', 'warning');
    // Save product without images rather than aborting entirely
    finish(keep.length > 0 ? keep : ['images/products/placeholder.svg']);
  });
});

var fcb = document.getElementById('formCancelBtn');
if (fcb) fcb.addEventListener('click', resetForm);

// Variant image upload handler (delegation)
document.addEventListener('change', function(e) {
  var input = e.target.closest('.variant-image-input');
  if (!input) return;
  var row = input.closest('.variant-row');
  if (!row) return;
  var vi = row.dataset.vi;
  var files = Array.from(input.files);
  var pending = files.length;
  if (pending === 0) return;
  if (!variantImagesData[vi]) variantImagesData[vi] = [];
  files.forEach(function(file) {
    resizeImage(file, 800, 0.8, function(dataUrl) {
      variantImagesData[vi].push(dataUrl);
      pending--;
      if (pending === 0) {
        renderVariantImagePreview(vi);
        input.value = '';
      }
    });
  });
});

// Add variant
var avb = document.getElementById('addVariantBtn');
if (avb) avb.addEventListener('click', function() {
  var container = document.getElementById('formVariantsContainer');
  if (!container) return;
  var idx = container.querySelectorAll('.variant-row').length;
  var allSizes = sortSizes(categoriesConfig.sizes || []);
  var sizesHtml = allSizes.map(function(s) {
    return '<label class="vs-row" style="display:inline-flex;align-items:center;gap:4px;margin:2px 6px 2px 0;font-size:0.8rem;white-space:nowrap"><input type="checkbox" class="vs-size" value="' + s + '"> ' + s + ' <input type="number" class="vs-stock" value="5" min="0" style="width:40px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label>';
  }).join('');
  var div = document.createElement('div');
  div.className = 'variant-row';
  div.dataset.vi = idx;
  div.innerHTML = '<select class="form-variant-color"><option value="">Select color...</option></select><input type="text" class="form-variant-design" style="display:none" placeholder="e.g. D1"><button type="button" class="btn btn-danger btn-sm variant-remove-btn">×</button><label style="margin-left:6px;font-size:0.75rem;color:#555">Stock: <input type="number" class="variant-qty" value="5" min="0" style="width:50px;padding:2px 4px;border:1px solid #ddd;border-radius:4px;font-size:0.75rem"></label><div class="variant-sizes" style="margin-top:6px">' + sizesHtml + '</div><div class="variant-images-section" style="margin-top:6px;padding-top:6px;border-top:1px solid #eee"><label style="font-size:0.75rem;color:#666">Images for this variant:</label><div class="variant-image-preview" data-vi="' + idx + '"></div><button type="button" class="btn btn-sm btn-outline-primary variant-add-image-btn">+ Upload</button><button type="button" class="btn btn-sm btn-outline-secondary variant-select-pimg-btn" style="font-size:0.75rem">From uploads</button><input type="file" class="variant-image-input" accept="image/*" multiple style="display:none"></div></div>';
  container.appendChild(div);
  variantImagesData[idx] = [];
  renderVariantsEditor();
});

// Variant remove via delegation
document.addEventListener('click', function(e) {
  var rmBtn = e.target.closest('.variant-remove-btn');
  if (rmBtn) {
    var row = rmBtn.closest('.variant-row');
    if (row) {
      var container = document.getElementById('formVariantsContainer');
      if (container && container.querySelectorAll('.variant-row').length > 1) {
        row.remove();
        renderVariantsEditor();
      } else {
        showToast('At least one color variant is required.', 'error');
      }
    }
  }
  // Variant add image button
  var addImgBtn = e.target.closest('.variant-add-image-btn');
  if (addImgBtn) {
    var row = addImgBtn.closest('.variant-row');
    if (row) {
      var input = row.querySelector('.variant-image-input');
      if (input) input.click();
    }
  }
  // Variant remove image
  var rmImgBtn = e.target.closest('.btn-variant-remove-image');
  if (rmImgBtn) {
    var vi = rmImgBtn.dataset.vi;
    var idx = parseInt(rmImgBtn.dataset.idx);
    if (vi !== undefined && variantImagesData[vi]) {
      variantImagesData[vi].splice(idx, 1);
      renderVariantImagePreview(vi);
    }
  }
  // Toggle "From uploads" product image selector
  var pimgBtn = e.target.closest('.variant-select-pimg-btn');
  if (pimgBtn) {
    var row = pimgBtn.closest('.variant-row');
    if (row) {
      var vi = row.dataset.vi;
      var grid = row.querySelector('.variant-pimg-grid');
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'variant-pimg-grid';
        grid.setAttribute('data-vi', vi);
        grid.style.cssText = 'margin-top:4px;display:none;max-height:120px;overflow-y:auto';
        var section = row.querySelector('.variant-images-section');
        if (section) section.appendChild(grid);
      }
      var isOpen = grid.style.display !== 'none';
      grid.style.display = isOpen ? 'none' : '';
      if (!isOpen) renderVariantProductImageSelect(vi);
    }
  }
});

// Variant product image checkbox toggle
document.addEventListener('change', function(e) {
  var cb = e.target.closest('.variant-pimg-cb');
  if (!cb) return;
  var vi = cb.dataset.vi;
  var idx = parseInt(cb.dataset.idx);
  if (isNaN(idx)) return;
  if (!variantImagesData[vi]) variantImagesData[vi] = [];
  var src = selectedImagesData[idx];
  if (!src) return;
  if (cb.checked) {
    if (variantImagesData[vi].indexOf(src) === -1) variantImagesData[vi].push(src);
  } else {
    var pos = variantImagesData[vi].indexOf(src);
    if (pos !== -1) variantImagesData[vi].splice(pos, 1);
  }
  renderVariantImagePreview(vi);
  renderVariantProductImageSelect(vi);
});

var fc0 = document.getElementById('formCategory0');
if (fc0) {
  fc0.addEventListener('change', function() {
    updateSubcategoryDropdown();
  });
}
var fc1 = document.getElementById('formCategory1');
if (fc1) {
  fc1.addEventListener('change', function() {
    updateBrandDropdown();
  });
}

var fvm = document.getElementById('formVariantMode');
if (fvm) {
  fvm.addEventListener('change', function() {
    applyVariantMode(this.value);
  });
}

function renderImagePreview() {
  const container = document.getElementById('formImagePreview');
  if (selectedImagesData.length === 0) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = selectedImagesData.map((src, i) => {
    var isVideo = isVideoUrl(src);
    var isMain = i === 0;
    return `<div class="image-wrapper" style="${isMain ? 'border:2px solid #d32f2f;border-radius:4px' : ''}">
      ${isMain ? '<span style="position:absolute;top:2px;left:2px;background:#d32f2f;color:#fff;font-size:11px;padding:1px 6px;border-radius:3px;z-index:2">Main</span>' : ''}
      ${isVideo ? '<video src="' + src + '" muted preload="metadata"></video><span class="video-play-icon">▶</span>' : '<img src="' + src + '">'}
      <button type="button" class="set-main-image" data-index="${i}" style="${isMain ? 'display:none' : ''}" title="Set as main picture">☆</button>
      <button type="button" class="remove-image" data-index="${i}">×</button>
    </div>`;
  }).join('');
  container.querySelectorAll('.remove-image').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      selectedImagesData.splice(idx, 1);
      renderImagePreview();
    });
  });
  container.querySelectorAll('.set-main-image').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      if (idx === 0) return;
      var item = selectedImagesData.splice(idx, 1)[0];
      selectedImagesData.unshift(item);
      renderImagePreview();
    });
  });
  renderAllVariantProductImageSelects();
}

var aib = document.getElementById('addImageBtn');
if (aib) aib.addEventListener('click', () => {
  document.getElementById('formImage').click();
});

function resizeImage(file, maxW, maxQ, cb, aspectRatio) {
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (aspectRatio) {
        var target = aspectRatio[0] / aspectRatio[1];
        if (sw / sh > target) {
          sw = Math.round(sh * target);
          sx = Math.round((img.width - sw) / 2);
        } else {
          sh = Math.round(sw / target);
          sy = Math.round((img.height - sh) / 2);
        }
      }
      let w = sw, h = sh;
      if (w > maxW || h > maxW) {
        const ratio = Math.min(maxW / w, maxW / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      cb(canvas.toDataURL('image/jpeg', maxQ));
    };
    img.onerror = function() {
      cb('images/products/placeholder.svg');
    };
    img.src = ev.target.result;
  };
  reader.onerror = function() {
    cb('images/products/placeholder.svg');
  };
  reader.readAsDataURL(file);
}

var fi = document.getElementById('formImage');
if (fi) fi.addEventListener('change', e => {
  var files = Array.from(e.target.files);
  files.forEach(function(file) {
    if (file.type.startsWith('video/')) {
      var reader = new FileReader();
      reader.onload = function(ev) {
        selectedImagesData.push(ev.target.result);
        renderImagePreview();
      };
      reader.readAsDataURL(file);
    } else {
      resizeImage(file, 800, 0.8, function(dataUrl) {
        selectedImagesData.push(dataUrl);
        renderImagePreview();
      });
    }
  });
  e.target.value = '';
});

// Auto-add ₱ prefix to price input
var fpEl = document.getElementById('formPrice');
if (fpEl) fpEl.addEventListener('input', function(e) {
  var val = this.value;
  if (val && val.indexOf('₱') !== 0) {
    this.value = '₱' + val.replace(/[^0-9.,]/g, '');
  }
});
var fopEl = document.getElementById('formOriginalPrice');
if (fopEl) fopEl.addEventListener('input', function(e) {
  var val = this.value;
  if (val && val.indexOf('₱') !== 0) {
    this.value = '₱' + val.replace(/[^0-9.,]/g, '');
  }
});
var fdpEl = document.getElementById('formDeposit');
if (fdpEl) fdpEl.addEventListener('input', function(e) {
  var val = this.value;
  if (val && val.indexOf('₱') !== 0) {
    this.value = '₱' + val.replace(/[^0-9.,]/g, '');
  }
});

// Import/Export
var eb = document.getElementById('exportBtn');
if (eb) eb.addEventListener('click', () => {
  const data = JSON.stringify(products, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(url);
});

var ib = document.getElementById('importBtn');
if (ib) ib.addEventListener('click', () => {
  document.getElementById('importFileInput').click();
});

var ifi = document.getElementById('importFileInput');
if (ifi) ifi.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      if (data.length > 0 && !data[0].name) throw new Error('Invalid format');
      data = data.map(function(p) {
        if (p.image && !p.images) {
          p.images = [p.image];
          delete p.image;
        }
        if (p.category && !p.category1) {
          p.category1 = p.category;
          delete p.category;
        }
        if (!p.category0) p.category0 = (categoriesConfig.groups[0] || {}).name || '';
        if (!p.category2) p.category2 = '';
        if (!p.sizes) p.sizes = [];
        return p;
      });
      if (confirm(`Replace all ${products.length} products with ${data.length} imported products?`)) {
        products = data;
        saveProducts();
        resetForm();
        renderAdminList();
        renderFilters();
        renderProducts();
        showToast('Products imported successfully!', 'success');
      }
    } catch {
      showToast('Invalid JSON file. Please export a valid products file first.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// GitHub Auto Sync
var GITHUB_OWNER = 'japangoodies';
var GITHUB_REPO = 'yokosoosaka';
var GITHUB_PATH = 'yokoso-website/data/products.json';
var GITHUB_CATEGORIES_PATH = 'yokoso-website/data/categories.json';
var GITHUB_MAINTENANCE_PATH = 'yokoso-website/maintenance.json';
var GITHUB_BRANCH = 'main';



var gti = document.getElementById('githubTokenInput');
if (gti) gti.addEventListener('input', function() {
  localStorage.setItem('github_token', this.value);
});

var ast = document.getElementById('autoSyncToggle');
if (ast) ast.addEventListener('change', function() {
  localStorage.setItem('autoSyncEnabled', this.checked ? 'true' : 'false');
});

function syncToGitHub() {
  var token = localStorage.getItem('github_token');
  if (!token) {
    console.warn('[Sync] No GitHub token found. Cannot sync.');
    showToast('Cannot sync: No GitHub token configured.', 'error');
    return;
  }
  if (window._githubBusy) { window._githubQueued = true; console.log('[Sync] Already syncing, queued another sync.'); return; }
  window._githubBusy = true;
  var statusEl = document.getElementById('syncStatus');
  if (statusEl) { statusEl.textContent = 'Syncing...'; statusEl.style.color = '#666'; }
  var content = JSON.stringify(products, null, 2);
  var encoded = btoa(unescape(encodeURIComponent(content)));
  var onSaleCount = products.filter(function(p) { return p.onSale; }).length;
  console.log('[Sync] Starting sync, products count:', products.length, 'onSale count:', onSaleCount, 'content size:', content.length, 'bytes');
  doGitHubSync(GITHUB_PATH, encoded, 'Auto-sync products from admin panel', statusEl, 0)
    .then(function() {
      console.log('[Sync] GitHub sync completed successfully.');
      showToast('Products synced to GitHub successfully!', 'success');
      // Sync categories, then release lock and handle queue
      var catPromise = localStorage.getItem('github_token') ? syncCategoriesToGitHub(true) : Promise.resolve();
      return catPromise;
    })
    .then(function() {
      window._githubBusy = false;
      if (window._githubQueued) { window._githubQueued = false; syncToGitHub(); }
    })
    .catch(function(err) {
      window._githubBusy = false;
      console.error('[Sync] GitHub sync failed:', err.message);
      if (statusEl) {
        if (err.message.indexOf('HTTP 401') !== -1) {
          statusEl.innerHTML = 'Token expired. <a href="#" onclick="window.open(\'https://github.com/settings/tokens\');return false" style="color:#007bff">Generate new token</a> → paste in Sync Settings.';
          showToast('GitHub token expired. Update in Config tab.', 'error');
        } else {
          statusEl.textContent = 'Sync failed: ' + err.message;
          showToast('GitHub sync failed: ' + err.message + '. Data saved locally only.', 'error');
        }
        statusEl.style.color = '#dc3545';
      } else {
        showToast('GitHub sync failed: ' + err.message, 'error');
      }
      if (window._githubQueued) { window._githubQueued = false; syncToGitHub(); }
    });
}

function doGitHubSync(filePath, encoded, message, statusEl, attempt) {
  var token = localStorage.getItem('github_token');
  if (!token) { return Promise.reject(new Error('No token')); }
  statusEl = statusEl || document.getElementById('syncStatus');
  var baseUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO;
  var authHeaders = { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' };
  // Use Git Blob API (no 1MB limit like Contents API)
  function checkResp(r, label) {
    if (!r.ok) {
      return r.text().then(function(body) {
        console.error('[Sync] ' + label + ' failed:', r.status, body);
        throw new Error(label + ' HTTP ' + r.status + ': ' + body.slice(0, 200));
      });
    }
    return r.json();
  }

  var blobSha, commitSha;
  return fetch(baseUrl + '/git/blobs', {
    method: 'POST', headers: authHeaders,
    body: JSON.stringify({ content: encoded, encoding: 'base64' })
  })
  .then(function(r) { return checkResp(r, 'create blob'); })
  .then(function(blob) {
    blobSha = blob.sha;
    return fetch(baseUrl + '/git/refs/heads/' + GITHUB_BRANCH, { headers: authHeaders });
  })
  .then(function(r) { return checkResp(r, 'get ref'); })
  .then(function(ref) {
    return fetch(baseUrl + '/git/commits/' + ref.object.sha, { headers: authHeaders });
  })
  .then(function(r) { return checkResp(r, 'get commit'); })
  .then(function(commit) {
    commitSha = commit.sha;
    return fetch(baseUrl + '/git/trees/' + commit.tree.sha, { headers: authHeaders });
  })
  .then(function(r) { return checkResp(r, 'get tree'); })
  .then(function(treeObj) {
    var treeItems = (treeObj.tree || []).filter(function(item) { return item.path !== filePath; });
    treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: blobSha });
    return fetch(baseUrl + '/git/trees', {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ base_tree: treeObj.sha, tree: treeItems })
    });
  })
  .then(function(r) { return checkResp(r, 'create tree'); })
  .then(function(tree) {
    return fetch(baseUrl + '/git/commits', {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ message: message, tree: tree.sha, parents: [commitSha] })
    });
  })
  .then(function(r) { return checkResp(r, 'create commit'); })
  .then(function(newCommit) {
    return fetch(baseUrl + '/git/refs/heads/' + GITHUB_BRANCH, {
      method: 'PATCH', headers: authHeaders,
      body: JSON.stringify({ sha: newCommit.sha, force: true })
    });
  })
  .then(function(r) {
    if (!r.ok) {
      return r.text().then(function(body) {
        throw new Error('update ref HTTP ' + r.status + ': ' + body.slice(0, 200));
      });
    }
    return r.json().then(function(refData) {
      console.log('[Sync] Ref updated to', refData.object.sha, 'for', filePath);
      if (filePath === GITHUB_PATH) {
        localStorage.setItem('yokoso_pending_sync', 'false');
        localStorage.setItem('yokoso_sync_time', Date.now().toString());
      }
      if (statusEl) { statusEl.textContent = 'Synced ✓'; statusEl.style.color = '#28a745'; }
      console.log('[Sync] doGitHubSync succeeded for', filePath);
    });
  });
}

function forceSync() {
  console.log('[ForceSync] Starting force sync...');
  var token = localStorage.getItem('github_token');
  if (!token) {
    showToast('No GitHub token configured. Go to Config tab first.', 'error');
    return;
  }
  // Re-save everything fresh to localStorage with a new timestamp
  localStorage.setItem('yokoso_products', JSON.stringify(products));
  var now = Date.now().toString();
  localStorage.setItem('yokoso_local_save_time', now);
  localStorage.setItem('yokoso_pending_sync', 'true');
  console.log('[ForceSync] Saved ' + products.length + ' products to localStorage, time=' + now);
  // Set a force-sync marker so other devices know to discard stale localStorage
  localStorage.setItem('yokoso_force_sync_time', now);
  showToast('Force sync: saving ' + products.length + ' products to GitHub...', 'info');
  var statusEl = document.getElementById('syncStatus');
  if (statusEl) { statusEl.textContent = 'Force syncing...'; statusEl.style.color = '#e94560'; }
  var content = JSON.stringify(products, null, 2);
  var encoded = btoa(unescape(encodeURIComponent(content)));
  doGitHubSync(GITHUB_PATH, encoded, 'Force-sync: ' + products.length + ' products from admin', statusEl, 0)
    .then(function() {
      console.log('[ForceSync] GitHub sync succeeded.');
      // Also sync categories
      syncCategoriesToGitHub();
      showToast('Force sync complete! All devices will get the latest data.', 'success');
      if (statusEl) { statusEl.textContent = 'Force synced ✓'; statusEl.style.color = '#28a745'; }
    })
    .catch(function(err) {
      console.error('[ForceSync] Failed:', err.message);
      showToast('Force sync failed: ' + err.message, 'error');
      if (statusEl) { statusEl.textContent = 'Force sync failed: ' + err.message; statusEl.style.color = '#dc3545'; }
    });
}

function syncCategoriesToGitHub(lockHeld) {
  return new Promise(function(resolve) {
    var token = localStorage.getItem('github_token');
    if (!token) { resolve(); return; }
    if (!lockHeld) {
      if (window._githubBusy) { resolve(); return; }
      window._githubBusy = true;
    }
    var statusEl = document.getElementById('syncStatus');
    var groupStatusEl = document.getElementById('groupImageSyncStatus');
    if (statusEl) { statusEl.textContent = 'Syncing categories...'; statusEl.style.color = '#666'; }
    if (groupStatusEl) { groupStatusEl.textContent = 'Syncing categories to GitHub...'; groupStatusEl.style.color = '#888'; }
    var content = JSON.stringify(categoriesConfig, null, 2);
    var encoded = btoa(unescape(encodeURIComponent(content)));
    doGitHubSync(GITHUB_CATEGORIES_PATH, encoded, 'Auto-sync categories from admin panel', null, 0)
      .then(function() {
        if (statusEl) { statusEl.textContent = 'Categories synced to GitHub ✓'; statusEl.style.color = '#28a745'; }
        if (groupStatusEl) { groupStatusEl.textContent = 'Synced ✓'; groupStatusEl.style.color = '#28a745'; setTimeout(function() { groupStatusEl.textContent = ''; }, 4000); }
      })
      .catch(function(err) {
        console.error('Categories sync failed:', err.message);
        if (statusEl) {
          if (err.message.indexOf('HTTP 401') !== -1) {
            statusEl.innerHTML = 'Token expired. <a href="#" onclick="window.open(\'https://github.com/settings/tokens\');return false" style="color:#007bff">Generate new token</a> → paste in Sync Settings.';
          } else {
            statusEl.textContent = 'Sync failed: ' + err.message;
          }
          statusEl.style.color = '#dc3545';
        }
        if (groupStatusEl) { groupStatusEl.innerHTML = 'Saved locally. GitHub token ' + (err.message.indexOf('HTTP 401') !== -1 ? 'expired — <a href="#" onclick="window.open(\'https://github.com/settings/tokens\');return false" style="color:#007bff">generate new one</a>' : 'sync failed (' + err.message + ')') + '. Check token in <a href="#" onclick="document.getElementById(\'syncSettingsBtn\').click();return false" style="color:#007bff">sync settings</a>.'; groupStatusEl.style.color = '#e67e22'; }
      })
      .then(function() {
        if (!lockHeld) window._githubBusy = false;
        resolve();
      });
  });
}

// Navigation between public and admin view

function showAdminPanel() {
  console.log('[Debug] showAdminPanel START, products.length =', products.length);
  if (!currentUser) {
    openAccountModal();
    var loginError = document.getElementById('accountLoginError');
    if (loginError) loginError.textContent = 'Please log in with an admin account.';
    return;
  }
  if (!currentUser.admin) {
    showToast('This account does not have admin access.', 'error');
    return;
  }
  // Release expired orders (older than 24h)
  releaseExpiredOrders();
  // CDN products are always authoritative — loadProducts() already handles
  // localStorage fallback and pending edits. Don't replace here.
  document.getElementById('maintenanceOverlay').classList.add('active', 'admin-mode');
  document.getElementById('maintenancePublic').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  lockBody();
  var emailInput = document.getElementById('adminEmailInput');
  if (emailInput) emailInput.value = adminEmail;
  switchAdminTab('orders');
  renderAdminFilterDropdowns();
  renderAdminList();
  // Auto-open Import tab if scraped data exists
  var importReady = localStorage.getItem('yokoso_import_ready');
  var importCaption = localStorage.getItem('yokoso_import_caption');
  if (importReady && importCaption) {
    switchAdminTab('import');
  }
}

var eab = document.getElementById('enterAdminBtn');
if (eab) eab.addEventListener('click', showAdminPanel);

var fal = document.getElementById('footerAdminLink');
if (fal) fal.addEventListener('click', e => {
  e.preventDefault();
  showAdminPanel();
});

function renderAdminFilterDropdowns() {
  var groupSelect = document.getElementById('adminFilterGroup');
  var typeSelect = document.getElementById('adminFilterType');
  var brandSelect = document.getElementById('adminFilterBrand');
  var colorSelect = document.getElementById('adminFilterColor');
  if (!typeSelect || !brandSelect) return;
  if (groupSelect) {
    var groups = getGroups();
    groupSelect.innerHTML = '<option value="all">All Groups</option>' + groups.map(function(g) {
      var sel = adminFilterGroup === g.name ? ' selected' : '';
      return '<option value="' + g.name + '"' + sel + '>' + g.name + '</option>';
    }).join('');
  }
  var types = getTypes();
  var brands = getBrands();
  typeSelect.innerHTML = '<option value="all">All Subcategories</option>' + types.map(function(t) {
    return '<option value="' + t + '"' + (adminFilterType === t ? ' selected' : '') + '>' + t + '</option>';
  }).join('');
  brandSelect.innerHTML = '<option value="all">All Brands</option>' + brands.map(function(b) {
    return '<option value="' + b + '"' + (adminFilterBrand === b ? ' selected' : '') + '>' + b + '</option>';
  }).join('');
  if (colorSelect) {
    var colors = (categoriesConfig.colors || []).slice();
    var usedColors = [...new Set(products.filter(function(p) { return p.color; }).map(function(p) { return p.color; }))];
    usedColors.forEach(function(c) { if (colors.indexOf(c) === -1) colors.push(c); });
    colorSelect.innerHTML = '<option value="all">All Colors</option>' + colors.map(function(c) {
      return '<option value="' + c + '"' + (adminFilterColor === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
  }
}

var admSearch = document.getElementById('adminSearch');
if (admSearch) admSearch.addEventListener('input', function() {
  adminSearchVal = this.value;
  productsPage = 1;
  renderAdminList();
});

var afg = document.getElementById('adminFilterGroup');
if (afg) {
  afg.addEventListener('change', function() {
    adminFilterGroup = this.value;
    productsPage = 1;
    renderAdminList();
  });
}

var aft = document.getElementById('adminFilterType');
if (aft) aft.addEventListener('change', function() {
  adminFilterType = this.value;
  productsPage = 1;
  renderAdminList();
});

var afb = document.getElementById('adminFilterBrand');
if (afb) afb.addEventListener('change', function() {
  adminFilterBrand = this.value;
  productsPage = 1;
  renderAdminList();
});

var afc = document.getElementById('adminFilterColor');
if (afc) afc.addEventListener('change', function() {
  adminFilterColor = this.value;
  productsPage = 1;
  renderAdminList();
});

var mcb = document.getElementById('manageCategoriesBtn');
if (mcb) mcb.addEventListener('click', function() { switchAdminTab('categories'); });

var sgp = document.getElementById('subcategoryGroupPicker');
if (sgp) sgp.addEventListener('change', function() {
  selectedSubcategoryGroup = this.value;
  renderSubcategoryTagList();
});

var backBtn = document.getElementById('backToPublicBtn');
if (backBtn) backBtn.addEventListener('click', function() {
  unlockBody();
  document.getElementById('maintenanceOverlay').classList.remove('active', 'admin-mode');
  document.getElementById('maintenancePublic').style.display = '';
  document.getElementById('adminPanel').style.display = 'none';
  adminSearchVal = '';
  adminFilterGroup = 'all';
  adminFilterType = 'all';
  adminFilterBrand = 'all';
  currentSearch = '';
  var si = document.getElementById('searchInput');
  if (si) si.value = '';
  renderAdminList();
  renderFilters();
  mainPage = 1; renderProducts();
});

var selectedSubcategoryGroup = '';

// ---- CATEGORY MANAGEMENT ----

function makeEditableTag(el, list, key) {
  var span = el.querySelector('.admin-tag-label') || el;
  var orig = span.textContent;
  span.contentEditable = true;
  span.focus();
  var range = document.createRange();
  range.selectNodeContents(span);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  function save() {
    span.contentEditable = false;
    var val = span.textContent.trim();
    if (val && val !== orig) {
      var idx = categoriesConfig[key].indexOf(orig);
      if (idx !== -1) {
        categoriesConfig[key][idx] = val;
        saveCategoriesConfig();
        renderCategoryDropdowns();
        renderAdminFilterDropdowns();
      }
    } else {
      span.textContent = orig;
    }
  }
  span.addEventListener('blur', save);
  span.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    if (e.key === 'Escape') { span.textContent = orig; span.blur(); }
  });
}

function renderSubcategoryTagList() {
  var subList = document.getElementById('subcategoryTagList');
  var subPicker = document.getElementById('subcategoryGroupPicker');
  if (!subList || !subPicker) return;
  var selectedGroup = subPicker.value;
  if (!selectedGroup) return;
  var subs = getSubcategories(selectedGroup);
  subList.innerHTML = subs.map(function(s) {
    return '<span class="admin-tag"><span class="admin-tag-label" title="Double-click to rename">' + s + '</span><span class="admin-tag-remove" data-subcategory="' + s + '" data-group="' + selectedGroup + '">×</span></span>';
  }).join('');
  subList.querySelectorAll('.admin-tag-remove').forEach(function(el) {
    el.addEventListener('click', function() {
      var s = this.dataset.subcategory;
      var g = this.dataset.group;
      var arr = categoriesConfig.subcategoryMap[g];
      if (arr) {
        categoriesConfig.subcategoryMap[g] = arr.filter(function(x) { return x !== s; });
        saveCategoriesConfig();
        renderCategoryManagement();
        renderCategoryDropdowns();
        renderAdminFilterDropdowns();
        renderFilters();
      }
    });
  });
  subList.querySelectorAll('.admin-tag-label').forEach(function(el) {
    el.addEventListener('dblclick', function() { makeEditableSubcategoryTag(el.parentNode); });
  });
}

function renderCategoryManagement() {
  console.log('[Trace] renderCategoryManagement() — groups:', (categoriesConfig.groups||[]).map(function(g){return g.name+':'+(g.images?g.images.length:0)}).join(', '), 'subcategories:', Object.keys(categoriesConfig.subcategoryMap||{}).length, 'brands:', (categoriesConfig.brands||[]).length);
  var groupList = document.getElementById('groupTagList');
  var brandList = document.getElementById('brandTagList');
  var colorList = document.getElementById('colorTagList');
  var sizeList = document.getElementById('sizeTagList');
  if (!groupList || !brandList) return;

  // Groups
  groupList.innerHTML = (categoriesConfig.groups || []).map(function(g) {
    return '<span class="admin-tag"><span class="admin-tag-label" title="Double-click to rename">' + g.name + '</span><span class="admin-tag-remove" data-group="' + g.name + '">×</span></span>';
  }).join('');

  // Subcategories picker - only populate if empty or groups changed
  var subPicker = document.getElementById('subcategoryGroupPicker');
  if (subPicker) {
    var groups = getGroups();
    var needsRepopulate = subPicker.options.length !== groups.length;
    if (!needsRepopulate) {
      for (var i = 0; i < groups.length; i++) {
        if (subPicker.options[i].value !== groups[i].name) { needsRepopulate = true; break; }
      }
    }
    if (needsRepopulate) {
      subPicker.innerHTML = groups.map(function(g) {
        return '<option value="' + g.name + '">' + g.name + '</option>';
  }).join('');

  grid.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.btn-add-cart')) return;
      var id = parseInt(this.dataset.id);
      if (!isNaN(id)) openProduct(id);
    });
  });
  grid.querySelectorAll('.btn-add-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = parseInt(this.dataset.id);
      if (!isNaN(id)) addToCart(id);
    });
  });
}
    if (selectedSubcategoryGroup && groups.some(function(g) { return g.name === selectedSubcategoryGroup; })) {
      subPicker.value = selectedSubcategoryGroup;
    } else {
      selectedSubcategoryGroup = groups.length ? groups[0].name : '';
      if (selectedSubcategoryGroup) subPicker.value = selectedSubcategoryGroup;
    }
    renderSubcategoryTagList();
  }

  brandList.innerHTML = (categoriesConfig.brands || []).slice().reverse().map(function(b) {
    return '<span class="admin-tag"><span class="admin-tag-label" title="Double-click to rename">' + b + '</span><span class="admin-tag-remove" data-brand="' + b + '">×</span></span>';
  }).join('');
  if (colorList) {
    colorList.innerHTML = (categoriesConfig.colors || []).slice().reverse().map(function(c) {
      return '<span class="admin-tag"><span class="admin-tag-label" title="Double-click to rename">' + c + '</span><span class="admin-tag-remove" data-color-cat="' + c + '">×</span></span>';
    }).join('');
  }
  if (sizeList) {
    var sortedSizes = (categoriesConfig.sizes || []).slice().sort(function(a, b) {
      var alphaOrder = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5, XXXL: 6, '2XL': 7, '3XL': 8, '4XL': 9, '5XL': 10, '6XL': 11 };
      var aIsAlpha = alphaOrder[a] !== undefined;
      var bIsAlpha = alphaOrder[b] !== undefined;
      if (aIsAlpha && bIsAlpha) return alphaOrder[a] - alphaOrder[b];
      if (aIsAlpha) return -1;
      if (bIsAlpha) return 1;
      var aNum = parseFloat(a);
      var bNum = parseFloat(b);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.localeCompare(b);
    });
    sizeList.innerHTML = sortedSizes.map(function(s) {
      return '<span class="admin-tag"><span class="admin-tag-label" title="Double-click to rename">' + s + '</span><span class="admin-tag-remove" data-size-cat="' + s + '">×</span></span>';
    }).join('');
  }

  // Group remove handlers
  groupList.querySelectorAll('.admin-tag-remove').forEach(function(el) {
    el.addEventListener('click', function() {
      var g = this.dataset.group;
      categoriesConfig.groups = categoriesConfig.groups.filter(function(x) { return x.name !== g; });
      delete categoriesConfig.subcategoryMap[g];
      saveCategoriesConfig();
      renderCategoryManagement();
      renderCategoryDropdowns();
      renderAdminFilterDropdowns();
      renderFilters();
    });
  });

  brandList.querySelectorAll('.admin-tag-remove').forEach(function(el) {
    el.addEventListener('click', function() {
      var b = this.dataset.brand;
      categoriesConfig.brands = categoriesConfig.brands.filter(function(x) { return x !== b; });
      saveCategoriesConfig();
      renderCategoryManagement();
      renderCategoryDropdowns();
      renderAdminFilterDropdowns();
    });
  });

  if (sizeList) {
    sizeList.querySelectorAll('.admin-tag-remove').forEach(function(el) {
      el.addEventListener('click', function() {
        var s = this.dataset.sizeCat;
        categoriesConfig.sizes = categoriesConfig.sizes.filter(function(x) { return x !== s; });
        saveCategoriesConfig();
        renderCategoryManagement();
        renderVariantsEditor();
      });
    });
    sizeList.querySelectorAll('.admin-tag-label').forEach(function(el) {
      el.addEventListener('dblclick', function() { makeEditableTag(el.parentNode, categoriesConfig.sizes, 'sizes'); });
    });
  }

  if (colorList) {
    colorList.querySelectorAll('.admin-tag-remove').forEach(function(el) {
      el.addEventListener('click', function() {
        var c = this.dataset.colorCat;
        categoriesConfig.colors = categoriesConfig.colors.filter(function(x) { return x !== c; });
        saveCategoriesConfig();
        renderCategoryManagement();
        renderVariantsEditor();
      });
    });
    colorList.querySelectorAll('.admin-tag-label').forEach(function(el) {
      el.addEventListener('dblclick', function() { makeEditableTag(el.parentNode, categoriesConfig.colors, 'colors'); });
    });
  }

  // Rename handlers
  groupList.querySelectorAll('.admin-tag-label').forEach(function(el) {
    el.addEventListener('dblclick', function() { makeEditableGroupTag(el.parentNode); });
  });
  brandList.querySelectorAll('.admin-tag-label').forEach(function(el) {
    el.addEventListener('dblclick', function() { makeEditableTag(el.parentNode, categoriesConfig.brands, 'brands'); });
  });

  // Group image preview
  renderGroupImagePreview();
  renderBrandMapUI();
  renderBrandLogoUI();
}

function renderBrandMapUI() {
  var picker = document.getElementById('brandMapSubcategoryPicker');
  if (!picker) return;
  var allSubs = [];
  (categoriesConfig.groups || []).forEach(function(g) {
    (categoriesConfig.subcategoryMap[g.name] || []).forEach(function(s) {
      if (allSubs.indexOf(s) === -1) allSubs.push(s);
    });
  });
  var currentSub = picker.value && allSubs.indexOf(picker.value) !== -1 ? picker.value : (allSubs[0] || '');
  picker.innerHTML = allSubs.map(function(s) {
    return '<option value="' + s + '"' + (s === currentSub ? ' selected' : '') + '>' + s + '</option>';
  }).join('');
  renderBrandMapCheckboxes(currentSub);
}

function renderBrandMapCheckboxes(sub) {
  var container = document.getElementById('brandMapCheckboxes');
  if (!container) return;
  var assigned = categoriesConfig.subcategoryBrands[sub] || [];
  var allBrands = categoriesConfig.brands || [];
  container.innerHTML = allBrands.map(function(b) {
    var checked = assigned.indexOf(b) !== -1 ? ' checked' : '';
    return '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.8rem;color:#ccc;padding:4px 8px;background:rgba(255,255,255,0.05);border-radius:4px"><input type="checkbox" class="brand-map-cb" data-subcategory="' + sub + '" data-brand="' + b + '"' + checked + '>' + b + '</label>';
  }).join('');
}

function makeEditableGroupTag(el) {
  var span = el.querySelector('.admin-tag-label') || el;
  var orig = span.textContent;
  span.contentEditable = true;
  span.focus();
  var range = document.createRange();
  range.selectNodeContents(span);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  function save() {
    span.contentEditable = false;
    var val = span.textContent.trim();
    if (val && val !== orig) {
      // Update subcategoryMap key
      var subs = categoriesConfig.subcategoryMap[orig] || [];
      delete categoriesConfig.subcategoryMap[orig];
      categoriesConfig.subcategoryMap[val] = subs;
      // Update group name
      var grp = categoriesConfig.groups.find(function(g) { return g.name === orig; });
      if (grp) grp.name = val;
      // Update all products with this group
      products.forEach(function(p) {
        if (p.category0 === orig) p.category0 = val;
      });
      saveCategoriesConfig();
      saveProducts();
      renderCategoryManagement();
      renderCategoryDropdowns();
      renderAdminFilterDropdowns();
      renderFilters();
      renderProducts();
    } else {
      span.textContent = orig;
    }
  }
  span.addEventListener('blur', save);
  span.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    if (e.key === 'Escape') { span.textContent = orig; span.blur(); }
  });
}

function makeEditableSubcategoryTag(el) {
  var span = el.querySelector('.admin-tag-label') || el;
  var orig = span.textContent;
  span.contentEditable = true;
  span.focus();
  var range = document.createRange();
  range.selectNodeContents(span);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  var subPicker = document.getElementById('subcategoryGroupPicker');
  var group = subPicker ? subPicker.value : '';
  function save() {
    span.contentEditable = false;
    var val = span.textContent.trim();
    if (val && val !== orig && group) {
      var arr = categoriesConfig.subcategoryMap[group];
      if (arr) {
        var idx = arr.indexOf(orig);
        if (idx !== -1) arr[idx] = val;
      }
      products.forEach(function(p) {
        if (p.category0 === group && p.category1 === orig) p.category1 = val;
      });
      saveCategoriesConfig();
      saveProducts();
      renderCategoryManagement();
      renderCategoryDropdowns();
      renderAdminFilterDropdowns();
      renderFilters();
      renderProducts();
    } else {
      span.textContent = orig;
    }
  }
  span.addEventListener('blur', save);
  span.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    if (e.key === 'Escape') { span.textContent = orig; span.blur(); }
  });
}

function renderGroupImagePreview() {
  var container = document.getElementById('groupImagePreview');
  var targetSelect = document.getElementById('groupImageTarget');
  if (!container || !targetSelect) return;
  var groups = getGroups();
  targetSelect.innerHTML = '<option value="">Add image to...</option>' + groups.map(function(g) {
    return '<option value="' + g.name + '">' + g.name + ' (' + (g.images ? g.images.length : 0) + ' images)</option>';
  }).join('');
  container.innerHTML = groups.map(function(g) {
    var imgs = (g.images || []);
    if (!imgs.length) return '';
    var imgsHtml = imgs.map(function(img, i) {
      return '<div style="position:relative;display:inline-block;margin:4px">' +
        '<img src="' + img + '" style="width:80px;height:80px;object-fit:cover;border-radius:6px;display:block">' +
        '<button class="group-img-remove" data-group="' + g.name + '" data-index="' + i + '" style="position:absolute;top:-4px;right:-4px;width:20px;height:20px;border-radius:50%;border:none;background:#e94560;color:#fff;font-size:12px;line-height:20px;text-align:center;cursor:pointer;padding:0">×</button></div>';
    }).join('');
    return '<div style="margin-bottom:8px"><div style="font-size:0.75rem;font-weight:600;color:#555;margin-bottom:4px">' + g.name + '</div><div style="display:flex;flex-wrap:wrap">' + imgsHtml + '</div></div>';
  }).join('');
  container.querySelectorAll('.group-img-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var gn = this.dataset.group;
      var idx = parseInt(this.dataset.index);
      var grp = categoriesConfig.groups.find(function(g) { return g.name === gn; });
      if (grp && grp.images && grp.images.length > idx) {
        grp.images.splice(idx, 1);
        saveCategoriesConfig();
        renderGroupImagePreview();
        renderCarousel();
      }
    });
  });
}

var groupTargetSelect = document.getElementById('groupImageTarget');

var ugiBtn = document.getElementById('uploadGroupImageBtn');
if (ugiBtn) ugiBtn.addEventListener('click', function() {
  if (!groupTargetSelect || !groupTargetSelect.value) { showToast('Select a group first.', 'info'); return; }
  document.getElementById('groupImageInput').click();
});

var giInput = document.getElementById('groupImageInput');
if (giInput) giInput.addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file || !groupTargetSelect || !groupTargetSelect.value) return;
  var targetGroup = groupTargetSelect.value;
  resizeImage(file, 400, 0.7, function(dataUrl) {
    var grp = categoriesConfig.groups.find(function(g) { return g.name === targetGroup; });
    if (grp) grp.images.push(dataUrl);
    saveCategoriesConfig();
    renderGroupImagePreview();
    renderCarousel();
  });
  e.target.value = '';
});

var giUrl = document.getElementById('groupImageUrl');
if (giUrl) giUrl.addEventListener('change', function() {
  if (!groupTargetSelect || !groupTargetSelect.value) return;
  var url = this.value.trim();
  if (url) {
    var targetGroup = groupTargetSelect.value;
    var grp = categoriesConfig.groups.find(function(g) { return g.name === targetGroup; });
    if (grp) grp.images.push(url);
    saveCategoriesConfig();
    renderGroupImagePreview();
    renderCarousel();
  }
});

// ---- BRAND LOGO UI ----
function renderBrandLogoUI() {
  var picker = document.getElementById('brandLogoPicker');
  if (!picker) return;
  var brands = categoriesConfig.brands || [];
  var current = picker.value && brands.indexOf(picker.value) !== -1 ? picker.value : (brands[0] || '');
  picker.innerHTML = '<option value="">Select brand...</option>' + brands.map(function(b) {
    return '<option value="' + b + '"' + (b === current ? ' selected' : '') + '>' + b + '</option>';
  }).join('');
  renderBrandLogoPreview();
}
function renderBrandLogoPreview() {
  var container = document.getElementById('brandLogoPreview');
  if (!container) return;
  var brands = categoriesConfig.brands || [];
  container.innerHTML = brands.filter(function(b) { return categoriesConfig.brandLogos && categoriesConfig.brandLogos[b]; }).map(function(b) {
    var logo = categoriesConfig.brandLogos[b];
    return '<div style="text-align:center"><img src="' + logo + '" style="width:40px;height:40px;object-fit:contain;border-radius:4px;cursor:pointer" title="Click to remove ' + b + ' logo" data-brand-logo="' + b + '"><div style="font-size:0.65rem;color:#aaa;margin-top:2px">' + b + '</div></div>';
  }).join('');
  container.querySelectorAll('[data-brand-logo]').forEach(function(img) {
    img.addEventListener('click', function() {
      var bn = this.dataset.brandLogo;
      if (confirm('Remove logo for ' + bn + '?')) {
        if (categoriesConfig.brandLogos) delete categoriesConfig.brandLogos[bn];
        saveCategoriesConfig();
        renderBrandLogoPreview();
      }
    });
  });
}

var uploadBrandLogoBtn = document.getElementById('uploadBrandLogoBtn');
if (uploadBrandLogoBtn) uploadBrandLogoBtn.addEventListener('click', function() {
  var picker = document.getElementById('brandLogoPicker');
  if (!picker || !picker.value) { showToast('Select a brand first.', 'info'); return; }
  document.getElementById('brandLogoInput').click();
});

var bli = document.getElementById('brandLogoInput');
if (bli) bli.addEventListener('change', function(e) {
  var file = e.target.files[0];
  var picker = document.getElementById('brandLogoPicker');
  if (!file || !picker || !picker.value) return;
  var targetBrand = picker.value;
  resizeImage(file, 200, 0.7, function(dataUrl) {
    if (!categoriesConfig.brandLogos) categoriesConfig.brandLogos = {};
    categoriesConfig.brandLogos[targetBrand] = dataUrl;
    saveCategoriesConfig();
    renderBrandLogoPreview();
    renderFilters();
  });
  e.target.value = '';
});

var blu = document.getElementById('brandLogoUrl');
if (blu) blu.addEventListener('change', function() {
  var picker = document.getElementById('brandLogoPicker');
  if (!picker || !picker.value) return;
  var url = this.value.trim();
  if (url) {
    var targetBrand = picker.value;
    if (!categoriesConfig.brandLogos) categoriesConfig.brandLogos = {};
    categoriesConfig.brandLogos[targetBrand] = url;
    saveCategoriesConfig();
    renderBrandLogoPreview();
    renderFilters();
  }
});

// ---- CATEGORY MANAGEMENT ADD HANDLERS ----
var agb = document.getElementById('addGroupBtn');
if (agb) agb.addEventListener('click', function() {
  var input = document.getElementById('newGroupInput');
  var val = input.value.trim();
  if (!val) return;
  if ((categoriesConfig.groups || []).some(function(g) { return g.name === val; })) return;
  categoriesConfig.groups.push({ name: val, images: [] });
  categoriesConfig.subcategoryMap[val] = [];
  input.value = '';
  saveCategoriesConfig();
  renderCategoryManagement();
  renderCategoryDropdowns();
  renderAdminFilterDropdowns();
  renderFilters();
});
var ngi = document.getElementById('newGroupInput');
if (ngi) ngi.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); var btn = document.getElementById('addGroupBtn'); if (btn) btn.click(); } });

var asb = document.getElementById('addSubcategoryBtn');
if (asb) asb.addEventListener('click', function() {
  var input = document.getElementById('newSubcategoryInput');
  var val = input.value.trim();
  if (!val) return;
  var picker = document.getElementById('subcategoryGroupPicker');
  var group = picker ? picker.value : '';
  if (!group) return;
  if ((categoriesConfig.subcategoryMap[group] || []).indexOf(val) !== -1) return;
  if (!categoriesConfig.subcategoryMap[group]) categoriesConfig.subcategoryMap[group] = [];
  categoriesConfig.subcategoryMap[group].push(val);
  input.value = '';
  saveCategoriesConfig();
  renderCategoryManagement();
  renderCategoryDropdowns();
  renderAdminFilterDropdowns();
  renderFilters();
});
var nsi2 = document.getElementById('newSubcategoryInput');
if (nsi2) nsi2.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); var btn = document.getElementById('addSubcategoryBtn'); if (btn) btn.click(); } });

var abb = document.getElementById('addBrandBtn');
if (abb) abb.addEventListener('click', function() {
  var input = document.getElementById('newBrandInput');
  var val = input.value.trim();
  if (!val) return;
  if ((categoriesConfig.brands || []).indexOf(val) !== -1) return;
  categoriesConfig.brands.push(val);
  input.value = '';
  saveCategoriesConfig();
  renderCategoryManagement();
  renderCategoryDropdowns();
  renderAdminFilterDropdowns();
});
var nbi = document.getElementById('newBrandInput');
if (nbi) nbi.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); var btn = document.getElementById('addBrandBtn'); if (btn) btn.click(); } });

var ascb = document.getElementById('addSizeCatBtn');
if (ascb) ascb.addEventListener('click', function() {
  var input = document.getElementById('newSizeCatInput');
  var val = input.value.trim();
  if (!val) return;
  if ((categoriesConfig.sizes || []).indexOf(val) !== -1) return;
  categoriesConfig.sizes.push(val);
  input.value = '';
  saveCategoriesConfig();
  renderCategoryManagement();
});
var nsci = document.getElementById('newSizeCatInput');
if (nsci) nsci.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); var btn = document.getElementById('addSizeCatBtn'); if (btn) btn.click(); } });

var acb = document.getElementById('addColorBtn');
if (acb) acb.addEventListener('click', function() {
  var input = document.getElementById('newColorInput');
  var val = input.value.trim();
  if (!val) return;
  if ((categoriesConfig.colors || []).indexOf(val) !== -1) return;
  categoriesConfig.colors.push(val);
  input.value = '';
  saveCategoriesConfig();
  renderCategoryManagement();
  renderVariantsEditor();
  renderAdminFilterDropdowns();
});
var nci = document.getElementById('newColorInput');
if (nci) nci.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); var btn = document.getElementById('addColorBtn'); if (btn) btn.click(); } });

// ---- BRAND MAP UI ----
var bmsp = document.getElementById('brandMapSubcategoryPicker');
if (bmsp) bmsp.addEventListener('change', function() {
  renderBrandMapCheckboxes(this.value);
});

var bmc = document.getElementById('brandMapCheckboxes');
if (bmc) bmc.addEventListener('change', function(e) {
  var cb = e.target.closest('.brand-map-cb');
  if (!cb) return;
  var sub = cb.dataset.subcategory;
  var brand = cb.dataset.brand;
  if (!categoriesConfig.subcategoryBrands[sub]) categoriesConfig.subcategoryBrands[sub] = [];
  var arr = categoriesConfig.subcategoryBrands[sub];
  if (cb.checked) {
    if (arr.indexOf(brand) === -1) arr.push(brand);
  } else {
    categoriesConfig.subcategoryBrands[sub] = arr.filter(function(b) { return b !== brand; });
  }
  saveCategoriesConfig();
});

// ---- HERO CAROUSEL ----
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5000);
})();

// ---- ANALYTICS & REPORTS ----
function parseAnalyticsPeriod() {
  var val = document.getElementById('analyticsPeriod').value;
  if (val === 'all') return 0;
  var days = val === '1y' ? 365 : parseInt(val);
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function loadAnalytics() {
  var base = STOCK_PROXY_URL.replace(/\/+$/, '');
  fetch(base + '/orders?limit=10000&_=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(j) {
      var orders = Array.isArray(j) ? j : (j.docs || []);
      var cutoff = parseAnalyticsPeriod();
      if (cutoff) { orders = orders.filter(function(o) { return new Date(o.createdAt).getTime() >= cutoff; }); }
      renderAnalytics(orders);
    })
    .catch(function(e) {
      ['analyticsTotalRevenue','analyticsTotalOrders','analyticsAvgOrder','analyticsProductsSold','analyticsTotalProfit'].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.textContent = 'Error';
      });
      ['analyticsStatusBreakdown','analyticsRevenueChart','analyticsTopProducts','analyticsTopCustomers','analyticsCategorySales','analyticsLowStock'].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.innerHTML = '<div class="analytics-placeholder">Error loading analytics: ' + escapeHtml(e.message || '') + '</div>';
      });
    });
}

function renderAnalytics(orders) {
  var confirmed = orders.filter(function(o) { return o.status === 'confirmed'; });
  var depositPaid = orders.filter(function(o) { return o.status === 'deposit_paid'; });
  var pending = orders.filter(function(o) { return o.status === 'pending'; });
  var cancelled = orders.filter(function(o) { return o.status === 'cancelled'; });

  // Parse order totals
  var allValues = [];
  var confirmedValues = [];
  confirmed.forEach(function(o) {
    var v = parseFloat(String(o.total || '').replace(/[^0-9.\-]/g, ''));
    if (isNaN(v)) { var items = []; try { items = JSON.parse(o.items || '[]'); } catch(e) {} v = items.reduce(function(s, it) { return s + (parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0) * (it.qty || 0); }, 0); }
    if (v > 0) { allValues.push(v); confirmedValues.push({ order: o, value: v }); }
  });
  depositPaid.forEach(function(o) {
    var v = parseFloat(String(o.total || '').replace(/[^0-9.\-]/g, ''));
    if (isNaN(v)) { var items = []; try { items = JSON.parse(o.items || '[]'); } catch(e) {} v = items.reduce(function(s, it) { return s + (parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0) * (it.qty || 0); }, 0); }
    if (v > 0) allValues.push(v);
  });

  var totalRevenue = allValues.reduce(function(s, v) { return s + v; }, 0);
  var totalOrders = orders.length - cancelled.length;
  var avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  var productsSold = 0;
  var productSales = {};
  var customerData = {};
  var dailyRevenue = {};
  var categorySales = {};
  var totalProfit = 0;

  // Build lookup of originalPrice by product name
  var origPriceMap = {};
  (products || []).forEach(function(p) {
    if (p.originalPrice) {
      var op = parseFloat(String(p.originalPrice).replace(/[^0-9.\-]/g, ''));
      if (!isNaN(op)) origPriceMap[p.name] = op;
    }
  });

  orders.forEach(function(o) {
    if (o.status === 'cancelled') return;
    var items = []; try { items = JSON.parse(o.items || '[]'); } catch(e) {}
    items.forEach(function(it) {
      var qty = parseInt(it.qty, 10) || 1;
      var price = parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0;
      productsSold += qty;
      var pname = it.name || 'Unknown';
      if (!productSales[pname]) productSales[pname] = { qty: 0, revenue: 0, profit: 0 };
      productSales[pname].qty += qty;
      productSales[pname].revenue += price * qty;
      var origPrice = origPriceMap[pname] || 0;
      productSales[pname].profit += (price - origPrice) * qty;
      totalProfit += (price - origPrice) * qty;

      var cat = o.customerName || 'Unknown';
      // Category sales
      if (it.category1) {
        if (!categorySales[it.category1]) categorySales[it.category1] = { qty: 0, revenue: 0, orders: {} };
        categorySales[it.category1].qty += qty;
        categorySales[it.category1].revenue += price * qty;
        categorySales[it.category1].orders[o.id || o.poNumber] = true;
      }
    });

    if (o.customerName || o.customerEmail) {
      var ckey = o.customerEmail || o.customerName || 'unknown';
      if (!customerData[ckey]) { customerData[ckey] = { name: o.customerName || o.customerEmail || 'Unknown', email: o.customerEmail || '', contact: o.customerContact || '', orders: 0, total: 0 }; }
      customerData[ckey].orders++;
      var oval = parseFloat(String(o.total || '').replace(/[^0-9.\-]/g, ''));
      if (isNaN(oval)) {
        var oitems = []; try { oitems = JSON.parse(o.items || '[]'); } catch(e) {}
        oval = oitems.reduce(function(s, it) { return s + (parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0) * (it.qty || 0); }, 0);
      }
      customerData[ckey].total += oval;
    }

    if (o.createdAt) {
      var d = new Date(o.createdAt);
      var dateKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var oval2 = parseFloat(String(o.total || '').replace(/[^0-9.\-]/g, ''));
      if (isNaN(oval2)) {
        var oitems2 = []; try { oitems2 = JSON.parse(o.items || '[]'); } catch(e) {}
        oval2 = oitems2.reduce(function(s, it) { return s + (parseFloat(String(it.price || '').replace(/[^0-9.\-]/g, '')) || 0) * (it.qty || 0); }, 0);
      }
      if (!dailyRevenue[dateKey]) dailyRevenue[dateKey] = 0;
      dailyRevenue[dateKey] += oval2;
    }
  });

  // Render summary cards
  document.getElementById('analyticsTotalRevenue').textContent = '₱' + totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.getElementById('analyticsTotalOrders').textContent = totalOrders;
  document.getElementById('analyticsAvgOrder').textContent = '₱' + avgOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.getElementById('analyticsProductsSold').textContent = productsSold;
  var profitEl = document.getElementById('analyticsTotalProfit');
  if (profitEl) profitEl.textContent = '₱' + totalProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Order status breakdown
  renderAnalyticsStatus(pending.length, depositPaid.length, confirmed.length, cancelled.length);

  // Revenue over time
  renderAnalyticsRevenueChart(dailyRevenue);

  // Top selling products
  renderAnalyticsTopProducts(productSales);

  // Top customers
  renderAnalyticsTopCustomers(customerData);

  // Category sales
  renderAnalyticsCategorySales(categorySales);

  // Low stock alerts
  renderAnalyticsLowStock();
}

function renderAnalyticsStatus(pending, depositPaid, confirmed, cancelled) {
  var el = document.getElementById('analyticsStatusBreakdown');
  var total = pending + depositPaid + confirmed + cancelled;
  if (!total) { el.innerHTML = '<div class="analytics-placeholder">No orders yet.</div>'; return; }
  var items = [
    { label: 'Pending', count: pending, color: '#f57f17' },
    { label: 'Deposit Paid', count: depositPaid, color: '#1976d2' },
    { label: 'Confirmed', count: confirmed, color: '#2e7d32' },
    { label: 'Cancelled', count: cancelled, color: '#c62828' }
  ];
  var html = '';
  items.forEach(function(item) {
    var pct = total > 0 ? (item.count / total * 100) : 0;
    html += '<div class="analytics-bar-wrapper">' +
      '<span class="analytics-bar-label"><span class="analytics-status-dot" style="background:' + item.color + '"></span>' + item.label + '</span>' +
      '<div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:' + pct + '%;background:' + item.color + '"></div></div>' +
      '<span class="analytics-bar-value">' + item.count + ' (' + pct.toFixed(1) + '%)</span></div>';
  });
  el.innerHTML = html;
}

function renderAnalyticsRevenueChart(dailyRevenue) {
  var el = document.getElementById('analyticsRevenueChart');
  var dates = Object.keys(dailyRevenue).sort();
  if (!dates.length) { el.innerHTML = '<div class="analytics-placeholder">No revenue data yet.</div>'; return; }
  var maxRev = 0;
  dates.forEach(function(d) { if (dailyRevenue[d] > maxRev) maxRev = dailyRevenue[d]; });
  var html = dates.slice(-30).map(function(d) {
    var rev = dailyRevenue[d];
    var pct = maxRev > 0 ? (rev / maxRev * 100) : 0;
    return '<div class="analytics-bar-wrapper">' +
      '<span class="analytics-bar-label" style="flex-basis:85px;font-size:0.7rem">' + d.slice(5) + '</span>' +
      '<div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:' + pct + '%;background:#4caf50"></div></div>' +
      '<span class="analytics-bar-value" style="font-size:0.7rem">₱' + rev.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</span></div>';
  }).reverse().join('');
  if (dates.length > 30) html = '<div style="font-size:0.7rem;color:#888;margin-bottom:6px">Showing last 30 days</div>' + html;
  el.innerHTML = html;
}

function renderAnalyticsTopProducts(productSales) {
  var el = document.getElementById('analyticsTopProducts');
  // Collect unique filter values from all products
  var uniq = { g: {}, c1: {}, b: {}, cl: {}, sz: {} };
  (products || []).forEach(function(p) {
    if (p.category0) uniq.g[p.category0] = true;
    if (p.category1) uniq.c1[p.category1] = true;
    if (p.category2) uniq.b[p.category2] = true;
    var color = p.color || '';
    if (color) uniq.cl[color] = true;
    if (p.variants) { Object.keys(p.variants).forEach(function(c) { uniq.cl[c] = true; }); }
    (categoriesConfig.sizes || []).forEach(function(s) { uniq.sz[s] = true; });
  });
  var lists = { g: Object.keys(uniq.g).sort(), c1: Object.keys(uniq.c1).sort(), b: Object.keys(uniq.b).sort(), cl: Object.keys(uniq.cl).sort(), sz: Object.keys(uniq.sz).sort() };

  var all = (products || []).map(function(p) {
    var sale = productSales[p.name] || { qty: 0, revenue: 0, profit: 0 };
    // Collect all sizes this product has across variants
    var pSizes = (categoriesConfig.sizes || []).filter(function(s) {
      if (!p.variants) return false;
      return Object.keys(p.variants).some(function(c) { return (p.variants[c].sizes || []).indexOf(s) !== -1; });
    });
    return { name: p.name, price: p.price || '', originalPrice: p.originalPrice || '', qty: sale.qty, revenue: sale.revenue, profit: sale.profit || 0, g: p.category0 || '', c1: p.category1 || '', b: p.category2 || '', cl: p.color || '', sz: pSizes };
  });
  Object.keys(productSales).forEach(function(k) {
    if (!all.some(function(a) { return a.name === k; }))
      all.push({ name: k, price: '', originalPrice: '', qty: productSales[k].qty, revenue: productSales[k].revenue, profit: productSales[k].profit || 0, g: '', c1: '', b: '', cl: '', sz: [] });
  });
  all.sort(function(a, b) { return b.qty - a.qty; });
  if (!all.length) { el.innerHTML = '<div class="analytics-placeholder">No products found.</div>'; return; }
  el.setAttribute('data-items', JSON.stringify(all));

  var searchVal = (el.getAttribute('data-filter') || '').toLowerCase();
  var fG = el.getAttribute('data-fg') || '';
  var fC1 = el.getAttribute('data-fc1') || '';
  var fB = el.getAttribute('data-fb') || '';
  var fCl = el.getAttribute('data-fcl') || '';
  var fSz = el.getAttribute('data-fsz') || '';
  var fSold = el.getAttribute('data-fsold') === '1';

  var filtered = all.filter(function(p) {
    if (searchVal && p.name.toLowerCase().indexOf(searchVal) === -1) return false;
    if (fG && p.g !== fG) return false;
    if (fC1 && p.c1 !== fC1) return false;
    if (fB && p.b !== fB) return false;
    if (fCl && p.cl !== fCl) return false;
    if (fSz && (!p.sz || p.sz.indexOf(fSz) === -1)) return false;
    if (fSold && p.qty === 0) return false;
    return true;
  });
  var maxQty = filtered.length && filtered[0].qty;

  function opt(id, labelKey, list) {
    var cur = el.getAttribute('data-' + id) || '';
    var h = '<select id="af_' + id + '" onchange="filterAnalyticsAttr(\'' + id + '\',this)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:#fff;font-size:0.75rem">';
    h += '<option value="">' + labelKey + '</option>';
    list.forEach(function(v) { h += '<option value="' + escapeHtml(v) + '"' + (cur === v ? ' selected' : '') + '>' + escapeHtml(v) + '</option>'; });
    h += '</select>';
    return h;
  }

  var html = '<div class="analytics-filter-wrap" style="margin-bottom:10px">' +
    '<div style="display:flex;gap:6px;margin-bottom:6px">' +
    '<input type="text" id="analyticsProductFilter" placeholder="Search products..." value="' + escapeHtml(searchVal) + '" oninput="filterAnalyticsAttr(\'q\',this)" style="padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:#fff;flex:1;font-size:0.8rem">' +
    '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
    opt('fg', 'Group', lists.g) + opt('fc1', 'Subcategory', lists.c1) + opt('fb', 'Brand', lists.b) + opt('fcl', 'Color', lists.cl) + opt('fsz', 'Size', lists.sz) +
    '<label style="display:flex;align-items:center;gap:4px;color:#aaa;font-size:0.75rem;cursor:pointer;user-select:none;margin-left:4px">' +
    '<input type="checkbox"' + (el.getAttribute('data-fsold') === '1' ? ' checked' : '') + ' onchange="filterAnalyticsSoldToggle()"> Only sold</label>' +
    '</div></div>';
  html += '<table class="analytics-table"><thead><tr><th class="rank">#</th><th>Product</th><th class="num">Price</th><th class="num">Orig. Price</th><th class="num">Qty Sold</th><th class="num">Revenue</th><th class="num">Profit</th></tr></thead><tbody>';
  filtered.forEach(function(p, i) {
    var pct = maxQty > 0 ? (p.qty / maxQty * 100) : 0;
    var pn = parseFloat(String(p.price).replace(/[^0-9.\-]/g, ''));
    var on = parseFloat(String(p.originalPrice).replace(/[^0-9.\-]/g, ''));
    var pd = isNaN(pn) ? (p.price || '—') : '₱' + pn.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var od = isNaN(on) ? (p.originalPrice || '—') : '₱' + on.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var tags = [];
    if (p.g) tags.push(escapeHtml(p.g));
    if (p.c1) tags.push(escapeHtml(p.c1));
    if (p.b) tags.push(escapeHtml(p.b));
    html += '<tr>' +
      '<td class="rank">' + (i + 1) + '</td>' +
      '<td>' + escapeHtml(p.name) + (tags.length ? '<br><span style="font-size:0.7rem;color:#888">' + tags.join(' / ') + '</span>' : '') + (p.qty > 0 ? '<div class="analytics-bar-track" style="margin-top:3px;height:6px"><div class="analytics-bar-fill" style="width:' + pct + '%;background:#e94560;height:6px"></div></div>' : '') + '</td>' +
      '<td class="num">' + pd + '</td>' +
      '<td class="num">' + od + '</td>' +
      '<td class="num">' + p.qty + '</td>' +
      '<td class="num">₱' + p.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td>' +
      '<td class="num" style="color:' + (p.profit >= 0 ? '#4caf50' : '#c62828') + '">₱' + p.profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td></tr>';
  });
  // Totals row
  var tQty = 0, tRev = 0, tProf = 0, tCount = filtered.length;
  filtered.forEach(function(p) { tQty += p.qty; tRev += p.revenue; tProf += p.profit || 0; });
  html += '<tfoot><tr style="font-weight:700;border-top:2px solid rgba(255,255,255,0.15)">' +
    '<td class="rank"></td>' +
    '<td>' + tCount + ' product' + (tCount !== 1 ? 's' : '') + '</td>' +
    '<td class="num" style="color:#fff">—</td>' +
    '<td class="num" style="color:#fff">—</td>' +
    '<td class="num" style="color:#fff">' + tQty + '</td>' +
    '<td class="num" style="color:#fff">₱' + tRev.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td>' +
    '<td class="num" style="color:' + (tProf >= 0 ? '#4caf50' : '#c62828') + '">₱' + tProf.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td></tr></tfoot>';
  html += '</tbody></table>';
  el.innerHTML = html;
}

function filterAnalyticsAttr(attr, el) {
  var container = document.getElementById('analyticsTopProducts');
  var val = el.value;
  if (attr === 'q') {
    container.setAttribute('data-filter', val);
  } else {
    container.setAttribute('data-' + attr, val);
  }
  rebuildAnalyticsProductsTable(container);
}

function filterAnalyticsSoldToggle() {
  var container = document.getElementById('analyticsTopProducts');
  var cb = container.querySelector('input[type="checkbox"][onchange="filterAnalyticsSoldToggle()"]');
  container.setAttribute('data-fsold', cb && cb.checked ? '1' : '0');
  rebuildAnalyticsProductsTable(container);
}

function rebuildAnalyticsProductsTable(container) {
  var raw = container.getAttribute('data-items');
  if (!raw) return;
  var all = JSON.parse(raw);
  var searchVal = (container.getAttribute('data-filter') || '').toLowerCase();
  var fG = container.getAttribute('data-fg') || '';
  var fC1 = container.getAttribute('data-fc1') || '';
  var fB = container.getAttribute('data-fb') || '';
  var fCl = container.getAttribute('data-fcl') || '';
  var fSz = container.getAttribute('data-fsz') || '';
  var fSold = container.getAttribute('data-fsold') === '1';
  var filtered = all.filter(function(p) {
    if (searchVal && p.name.toLowerCase().indexOf(searchVal) === -1) return false;
    if (fG && p.g !== fG) return false;
    if (fC1 && p.c1 !== fC1) return false;
    if (fB && p.b !== fB) return false;
    if (fCl && p.cl !== fCl) return false;
    if (fSz && (!p.sz || p.sz.indexOf(fSz) === -1)) return false;
    if (fSold && p.qty === 0) return false;
    return true;
  });
  var maxQty = filtered.length && filtered[0].qty;
  var tbody = container.querySelector('table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  filtered.forEach(function(p, i) {
    var pct = maxQty > 0 ? (p.qty / maxQty * 100) : 0;
    var pn = parseFloat(String(p.price).replace(/[^0-9.\-]/g, ''));
    var on = parseFloat(String(p.originalPrice).replace(/[^0-9.\-]/g, ''));
    var pd = isNaN(pn) ? (p.price || '—') : '₱' + pn.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var od = isNaN(on) ? (p.originalPrice || '—') : '₱' + on.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var tags = [];
    if (p.g) tags.push(escapeHtml(p.g));
    if (p.c1) tags.push(escapeHtml(p.c1));
    if (p.b) tags.push(escapeHtml(p.b));
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="rank">' + (i + 1) + '</td>' +
      '<td>' + escapeHtml(p.name) + (tags.length ? '<br><span style="font-size:0.7rem;color:#888">' + tags.join(' / ') + '</span>' : '') + (p.qty > 0 ? '<div class="analytics-bar-track" style="margin-top:3px;height:6px"><div class="analytics-bar-fill" style="width:' + pct + '%;background:#e94560;height:6px"></div></div>' : '') + '</td>' +
      '<td class="num">' + pd + '</td>' +
      '<td class="num">' + od + '</td>' +
      '<td class="num">' + p.qty + '</td>' +
      '<td class="num">₱' + p.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td>' +
      '<td class="num" style="color:' + (p.profit >= 0 ? '#4caf50' : '#c62828') + '">₱' + p.profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td>';
    tbody.appendChild(tr);
  });
  // Totals row
  var tQty = 0, tRev = 0, tProf = 0, tCount = filtered.length;
  filtered.forEach(function(p) { tQty += p.qty; tRev += p.revenue; tProf += p.profit || 0; });
  var tfoot = container.querySelector('table tfoot');
  if (!tfoot) {
    tfoot = document.createElement('tfoot');
    container.querySelector('table').appendChild(tfoot);
  }
  tfoot.innerHTML = '<tr style="font-weight:700;border-top:2px solid rgba(255,255,255,0.15)">' +
    '<td class="rank"></td>' +
    '<td>' + tCount + ' product' + (tCount !== 1 ? 's' : '') + '</td>' +
    '<td class="num" style="color:#fff">—</td>' +
    '<td class="num" style="color:#fff">—</td>' +
    '<td class="num" style="color:#fff">' + tQty + '</td>' +
    '<td class="num" style="color:#fff">₱' + tRev.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td>' +
    '<td class="num" style="color:' + (tProf >= 0 ? '#4caf50' : '#c62828') + '">₱' + tProf.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td></tr>';
}

function renderAnalyticsTopCustomers(customerData) {
  var el = document.getElementById('analyticsTopCustomers');
  var sorted = Object.keys(customerData).map(function(k) { return customerData[k]; }).sort(function(a, b) { return b.total - a.total; });
  if (!sorted.length) { el.innerHTML = '<div class="analytics-placeholder">No customer data yet.</div>'; return; }
  var html = '<table class="analytics-table"><thead><tr><th class="rank">#</th><th>Customer</th><th class="num">Orders</th><th class="num">Total Spent</th></tr></thead><tbody>';
  sorted.slice(0, 10).forEach(function(c, i) {
    html += '<tr>' +
      '<td class="rank">' + (i + 1) + '</td>' +
      '<td>' + escapeHtml(c.name) + (c.email ? '<br><span style="font-size:0.7rem;color:#888">' + escapeHtml(c.email) + '</span>' : '') + '</td>' +
      '<td class="num">' + c.orders + '</td>' +
      '<td class="num">₱' + c.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</td></tr>';
  });
  html += '</tbody></table>';
  el.innerHTML = html;
}

function renderAnalyticsCategorySales(categorySales) {
  var el = document.getElementById('analyticsCategorySales');
  var sorted = Object.keys(categorySales).map(function(k) { return { name: k, qty: categorySales[k].qty, revenue: categorySales[k].revenue, orders: Object.keys(categorySales[k].orders).length }; }).sort(function(a, b) { return b.revenue - a.revenue; });
  if (!sorted.length) { el.innerHTML = '<div class="analytics-placeholder">No category sales yet.</div>'; return; }
  var maxRev = sorted[0].revenue;
  var html = '';
  sorted.forEach(function(c) {
    var pct = maxRev > 0 ? (c.revenue / maxRev * 100) : 0;
    html += '<div class="analytics-bar-wrapper">' +
      '<span class="analytics-bar-label">' + escapeHtml(c.name) + '</span>' +
      '<div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:' + pct + '%;background:#ab47bc"></div></div>' +
      '<span class="analytics-bar-value" style="font-size:0.75rem">₱' + c.revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</span></div>';
  });
  el.innerHTML = html;
}

function renderAnalyticsLowStock() {
  var el = document.getElementById('analyticsLowStock');
  var lowItems = [];
  products.forEach(function(p) {
    if (p.variants) {
      for (var c in p.variants) {
        var v = p.variants[c];
        if (v.stock) {
          for (var s in v.stock) {
            if (v.stock[s] <= 3) {
              lowItems.push({ product: p, color: c, size: s, stock: v.stock[s] });
            }
          }
        }
      }
    } else {
      var total = getTotalStock(p.id);
      if (total <= 3) {
        lowItems.push({ product: p, color: '', size: '', stock: total });
      }
    }
  });
  lowItems.sort(function(a, b) { return a.stock - b.stock; });
  if (!lowItems.length) { el.innerHTML = '<div style="text-align:center;padding:14px;color:#4caf50;font-size:0.85rem">✅ All products have sufficient stock.</div>'; return; }
  var html = '';
  lowItems.slice(0, 30).forEach(function(item) {
    var label = escapeHtml(item.product.name);
    if (item.color) label += ' (' + escapeHtml(item.color) + (item.size ? '/' + item.size : '') + ')';
    var qtyClass = item.stock === 0 ? 'empty' : 'low';
    html += '<div class="analytics-stock-item">' +
      '<span class="analytics-stock-name">' + label + '</span>' +
      '<span class="analytics-stock-qty ' + qtyClass + '">' + item.stock + '</span></div>';
  });
  el.innerHTML = html;
}

function exportAnalyticsCSV() {
  var el = document.getElementById('analyticsTopProducts');
  var raw = el && el.getAttribute('data-items');
  if (!raw) { showCartNotification('No analytics data yet. Load analytics first.'); return; }
  var all = JSON.parse(raw);
  var searchVal = (el.getAttribute('data-filter') || '').toLowerCase();
  var fG = el.getAttribute('data-fg') || '';
  var fC1 = el.getAttribute('data-fc1') || '';
  var fB = el.getAttribute('data-fb') || '';
  var fCl = el.getAttribute('data-fcl') || '';
  var fSz = el.getAttribute('data-fsz') || '';
  var fSold = el.getAttribute('data-fsold') === '1';
  var filtered = all.filter(function(p) {
    if (searchVal && p.name.toLowerCase().indexOf(searchVal) === -1) return false;
    if (fG && p.g !== fG) return false;
    if (fC1 && p.c1 !== fC1) return false;
    if (fB && p.b !== fB) return false;
    if (fCl && p.cl !== fCl) return false;
    if (fSz && (!p.sz || p.sz.indexOf(fSz) === -1)) return false;
    if (fSold && p.qty === 0) return false;
    return true;
  });
  var rows = [['Product','Group','Subcategory','Brand','Price','Original Price','Qty Sold','Revenue','Profit']];
  filtered.forEach(function(p) {
    var pn = parseFloat(String(p.price).replace(/[^0-9.\-]/g, ''));
    var on = parseFloat(String(p.originalPrice).replace(/[^0-9.\-]/g, ''));
    var pd = isNaN(pn) ? (p.price || '') : pn.toFixed(2);
    var od = isNaN(on) ? (p.originalPrice || '') : on.toFixed(2);
    rows.push([p.name, p.g, p.c1, p.b, pd, od, p.qty, p.revenue.toFixed(2), (p.profit || 0).toFixed(2)]);
  });
  var csv = rows.map(function(r) { return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'product_sales_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  showCartNotification('Product sales exported to CSV.');
}
// ---- END ANALYTICS ----

// ---- INIT ----
function parseURLParams() {
  var params = new URLSearchParams(window.location.search);
  var group = params.get('group');
  if (group) {
    currentGroup = group;
    currentCategory = 'all';
    currentBrand = 'all';
    mainPage = 1;
    document.body.classList.add('catalog-mode');
    var ch = document.getElementById('catalogHeader');
    if (ch) { ch.style.display = 'block'; }
    var ct = document.getElementById('catalogTitle');
    if (ct) {
      ct.textContent = group;
      ct.style.cursor = 'pointer';
      ct.onclick = function() {
        currentGroup = 'all';
        currentCategory = 'all';
        currentBrand = 'all';
        document.body.classList.remove('catalog-mode');
        var ch2 = document.getElementById('catalogHeader');
        if (ch2) ch2.style.display = 'none';
        var cc2 = document.getElementById('categoryCarousel');
        if (cc2) cc2.style.display = '';
        history.pushState({}, '', window.location.pathname);
        renderSubcategoryFilter();
        renderBrandFilter();
        mainPage = 1;
        renderProducts();
      };
    }
    var cc = document.getElementById('categoryCarousel');
    if (cc) { cc.style.display = 'none'; }
  }
}

loadProducts(function() {
  console.log('[Debug] loadProducts callback START, products.length =', products.length);
  if (typeof MAINTENANCE_MODE !== 'undefined' && MAINTENANCE_MODE) {
    document.getElementById('maintenanceOverlay').classList.add('active');
    return;
  }
  loadSession();
  updateAccountUI();
  loadDepositConfig();
  parseURLParams();
  if (currentUser && currentUser.admin) showAdminPanel();
  renderMessengerLink();
  renderFilters();
  renderProducts();
  renderRecentlyViewed();
  updateCartBadge();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function() {});
}

// Cross-device product sync: poll worker every 30s for updates made after page load
function pollWorkerProducts() {
  if (!isProxyReady()) return;
  var lastSync = parseInt(localStorage.getItem('yokoso_last_poll') || '0', 10);
  fetch(proxyUrl('products'))
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (data && data.products && data.products.length > 0 && data.updatedAt > lastSync) {
        var mergeCount = 0;
        data.products.forEach(function(wp) {
          var idx = products.findIndex(function(p) { return p.id === wp.id; });
          if (idx !== -1) {
            products[idx] = wp;
            mergeCount++;
          }
        });
        if (mergeCount > 0) {
          localStorage.setItem('yokoso_last_poll', String(data.updatedAt));
          renderProducts();
          console.log('[Sync] Poll: merged ' + mergeCount + ' products from worker');
        }
      }
    })
    .catch(function() {});
}
setInterval(pollWorkerProducts, 30000);

// PWA install prompt
var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  var banner = document.getElementById('installBanner');
  if (banner) banner.style.display = 'flex';
});

function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function() {
    deferredPrompt = null;
    var banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
  });
}

function dismissInstallBanner() {
  deferredPrompt = null;
  var banner = document.getElementById('installBanner');
  if (banner) banner.style.display = 'none';
}

/* Back to Top Button */
(function() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '&#9650;';
  btn.setAttribute('aria-label', 'Back to top');
  btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  document.body.appendChild(btn);
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* Toast Notifications */
(function() {
  var c = document.createElement('div');
  c.className = 'toast-container';
  c.id = 'toastContainer';
  document.body.appendChild(c);
})();
function showToast(text, type, duration) {
  var c = document.getElementById('toastContainer');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  t.textContent = text;
  c.appendChild(t);
  requestAnimationFrame(function() { t.classList.add('show'); });
  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { t.remove(); }, 300);
  }, duration || 3000);
}

/* Newsletter Form Validation */
(function() {
  var form = document.getElementById('newsletterForm');
  var msg = document.getElementById('newsletterMsg');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('newsletterEmail');
    var val = (email && email.value || '').trim();
    if (!val) { showMsg('Please enter your email.', false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showMsg('Please enter a valid email address.', false); return; }
    showMsg('Thanks for subscribing! 🎌', true);
    email.value = '';
  });
  function showMsg(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'footer-newsletter-msg ' + (ok ? 'success' : 'error');
    if (ok) { setTimeout(function() { msg.textContent = ''; msg.className = 'footer-newsletter-msg'; }, 4000); }
  }
})();

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  var tag = (e.target.tagName || '').toLowerCase();
  var isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

  // ESC — close modals / fullscreen / cart
  if (e.key === 'Escape') {
    var fs = document.getElementById('liveFullscreen');
    if (fs && fs.style.display !== 'none') { closeFullscreen(); return; }
    var modal = document.querySelector('.modal-overlay[style*="display: block"], .modal-overlay.active');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; return; }
    var cart = document.getElementById('cartSlideout');
    if (cart && cart.classList.contains('open')) { toggleCart(); return; }
  }

  // Don't intercept if user is typing
  if (isInput) return;

  // / — focus search
  if (e.key === '/') {
    e.preventDefault();
    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.focus();
    return;
  }

  // Arrow Left/Right — navigate modal images
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    var modalActive = document.querySelector('.modal-overlay[style*="display: block"], .modal-overlay.active');
    if (modalActive && typeof modalStripNav === 'function') {
      e.preventDefault();
      modalStripNav(e.key === 'ArrowLeft' ? -1 : 1);
    }
  }
});

// ========== SMART IMPORT (Facebook Embed) ==========

var importImageData = [];

function populateImportDropdowns() {
  var groupEl = document.getElementById('importCategory0');
  if (!groupEl) return;
  var groups = (categoriesConfig.groups || []).map(function(g) { return g.name; });
  groupEl.innerHTML = '<option value="">—</option>' + groups.map(function(g) { return '<option value="' + g + '">' + g + '</option>'; }).join('');
  var subs = [];
  if (categoriesConfig.subcategoryMap) {
    for (var k in categoriesConfig.subcategoryMap) {
      subs = subs.concat(categoriesConfig.subcategoryMap[k]);
    }
  }
  var uniq = []; subs.forEach(function(s) { if (uniq.indexOf(s) === -1) uniq.push(s); });
  var subEl = document.getElementById('importCategory1');
  if (subEl) subEl.innerHTML = '<option value="">—</option>' + uniq.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');
  var brandEl = document.getElementById('importCategory2');
  if (brandEl) brandEl.innerHTML = '<option value="">—</option>' + (categoriesConfig.brands || []).map(function(b) { return '<option value="' + b + '">' + b + '</option>'; }).join('');
  renderImportSizeChecks();
}

function renderImportSizeChecks(selectedSizes) {
  var container = document.getElementById('importSizes');
  if (!container) return;
  var allSizes = sortSizes(categoriesConfig.sizes || []);
  if (!Array.isArray(selectedSizes)) selectedSizes = [];
  container.innerHTML = allSizes.map(function(s) {
    var checked = selectedSizes.indexOf(s) !== -1 ? ' checked' : '';
    return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:13px;cursor:pointer"><input type="checkbox" class="import-size-cb" value="' + s + '"' + checked + '> ' + s + '</label>';
  }).join('');
}

function checkBookmarkletData() {
  var banner = document.getElementById('importBookmarkletBanner');
  var infoEl = document.getElementById('importBookmarkletInfo');
  var ready = localStorage.getItem('yokoso_import_ready');
  var caption = localStorage.getItem('yokoso_import_caption');
  var images = localStorage.getItem('yokoso_import_images');
  if (!banner || !infoEl || !caption || !ready) return;
  var imgArr = [];
  try { imgArr = JSON.parse(images || '[]'); } catch(e) {}
  infoEl.innerHTML = 'Caption (' + caption.length + ' chars) + ' + imgArr.length + ' images from bookmarklet ready.';
  banner.style.display = 'block';
  // Auto-use the data
  if (caption) {
    var fields = parseCaptionToFields(caption);
    fields.images = imgArr;
    showImportPreview(fields);
  } else {
    showImportPreview({ images: imgArr });
  }
  banner.style.display = 'none';
  localStorage.removeItem('yokoso_import_caption');
  localStorage.removeItem('yokoso_import_images');
  localStorage.removeItem('yokoso_import_url');
  localStorage.removeItem('yokoso_import_ready');
}

document.addEventListener('click', function(e) {
  if (e.target.id === 'importUseBookmarkletData') {
    var caption = localStorage.getItem('yokoso_import_caption');
    var images = localStorage.getItem('yokoso_import_images');
    var imgArr = [];
    try { imgArr = JSON.parse(images || '[]'); } catch(e) {}
    if (caption) {
      var fields = parseCaptionToFields(caption);
      fields.images = imgArr;
      showImportPreview(fields);
    } else {
      showImportPreview({ images: imgArr });
    }
    document.getElementById('importBookmarkletBanner').style.display = 'none';
    localStorage.removeItem('yokoso_import_caption');
    localStorage.removeItem('yokoso_import_images');
    localStorage.removeItem('yokoso_import_url');
  }
  if (e.target.id === 'importClearBookmarkletData') {
    document.getElementById('importBookmarkletBanner').style.display = 'none';
    localStorage.removeItem('yokoso_import_caption');
    localStorage.removeItem('yokoso_import_images');
    localStorage.removeItem('yokoso_import_url');
  }
});

function parseFacebookEmbed(html) {
  var match = html.match(/href=(["'])([^"']+)\1/i);
  if (match) return decodeURIComponent(match[2]);
  match = html.match(/src=(["'])([^"']+)\1/i);
  if (match) {
    var src = match[2];
    var hrefMatch = src.match(/[?&]href=([^&]+)/);
    if (hrefMatch) return decodeURIComponent(hrefMatch[1]);
    return src;
  }
  // Check if it's already a direct URL
  if (html.match(/^https?:\/\/(www\.)?facebook\.com/i)) return html.trim();
  return null;
}

function parseCaptionToFields(caption) {
  console.log('[Trace] parseCaptionToFields() — caption length:', caption ? caption.length : 0, 'first 200 chars:', caption ? caption.substring(0, 200) : 'N/A');
  var result = { name: '', price: '', description: '', sizes: [], hashtags: [], category0: '', category1: '', category2: '' };
  if (!caption) { console.log('[Trace] parseCaptionToFields() — empty caption'); return result; }
  var originalLines = caption.split('\n');
  var lines = [], origIdx = [];
  originalLines.forEach(function(l, i) {
    var t = l.trim();
    if (t) { lines.push(t); origIdx.push(i); }
  });
  // Extract price
  var priceMatch = caption.match(/₱\s*[\d,]+\.?\d*/);
  if (priceMatch) { result.price = priceMatch[0]; }
  else {
    var pesoMatch = caption.match(/([\d,]+\.?\d*)\s*pesos/i);
    if (pesoMatch) result.price = '₱' + pesoMatch[1];
  }
  // Extract sizes
  var sizeMatch = caption.match(/Sizes?\s*:?\s*([\w\s,\/]+)/i);
  if (sizeMatch) {
    result.sizes = sizeMatch[1].split(/[,\/\s]+/).map(function(s) { return s.trim(); }).filter(Boolean);
    console.log('[Trace] parseCaptionToFields() — found sizes:', result.sizes.join(', '));
  }
  // Extract hashtags and map to categories
  var hashtagRegex = /#(\w+)/g;
  var tagMatch;
  var knownGroups = (categoriesConfig.groups || []).map(function(g) { return g.name.toUpperCase(); });
  var knownSubs = [];
  if (categoriesConfig.subcategoryMap) {
    for (var k in categoriesConfig.subcategoryMap) {
      knownSubs = knownSubs.concat(categoriesConfig.subcategoryMap[k]);
    }
  }
  knownSubs = knownSubs.map(function(s) { return s.toUpperCase(); });
  var knownBrands = (categoriesConfig.brands || []).map(function(b) { return b.toUpperCase(); });
  while ((tagMatch = hashtagRegex.exec(caption)) !== null) {
    var tag = tagMatch[1].toUpperCase();
    result.hashtags.push(tagMatch[1]);
    if (!result.category0 && knownGroups.indexOf(tag) !== -1) result.category0 = tagMatch[1];
    else if (!result.category1 && knownSubs.indexOf(tag) !== -1) result.category1 = tagMatch[1];
    else if (!result.category2 && knownBrands.indexOf(tag) !== -1) result.category2 = tagMatch[1];
  }
  // Smart name detection: score each line for likelihood of being a product name
  var productKw = ['JACKET','COAT','CARDIGAN','SHIRT','BLOUSE','TOP','POLO','HOODIE','SWEATER','PANTS','JEANS','SHORTS','SKIRT','DRESS','BAG','SHOES','SNEAKERS','SANDALS','WALLET','WATCH','VEST','JUMPSUIT','LEGGINGS','SWIMWEAR','BIKINI','TEE','PULLOVER','JOGGERS','BELT','HAT','BACKPACK','TOTE','SLIPPERS','BOOTS','HEELS','SNEAKER','SANDAL','GLASSES','SUNGLASSES','WALLET','BAG','CAP','BEANIE','SCARF','HOOD','CREW','SWEATSHIRT','WINDBREAKER','BOMBER','BLAZER','CROP','TANK','ROMPER','SHORTSLEEVE','LONGSLEEVE','POLO','BUTTON','SWIM','BRA','UNDERWEAR','SOCKS','PLUSH','TOY','KEYCHAIN','POUCH'];
  var skipRe = /^(for\s|price|sizes?|deposit|dp\s|yokoso|nasa\s|size\s|₱)/i;
  var nonNameRe = /(price|down|sale|avail|sizes?|comsec|reference|deposit|dp|eta)/i;
  var best = { line: '', score: -999, idx: -1 };
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.length < 4 || line.length > 120) continue;
    if (skipRe.test(line)) continue;
    var score = 0;
    var upper = line.toUpperCase();
    // Heavily penalize concatenated lines (no space between lowercase and uppercase)
    if (/[a-z][A-Z]/.test(line)) continue;
    // ALL CAPS is a strong product name signal
    if (line === upper && line.length > 5) score += 10;
    // Title case (every word starts with capital) is a good signal
    var words = line.split(/\s+/).filter(Boolean);
    var capped = words.filter(function(w) { return w[0] >= 'A' && w[0] <= 'Z'; });
    if (capped.length === words.length && words.length >= 2) score += 5;
    // Contains a known brand name from categories config
    if (knownBrands.some(function(b) { return upper.indexOf(b) !== -1; })) score += 8;
    // Contains a product-type keyword
    if (productKw.some(function(k) { return upper.indexOf(k) !== -1; })) score += 5;
    // No non-name words
    if (!nonNameRe.test(line)) score += 3;
    // Sweet-spot length
    if (line.length >= 10 && line.length <= 60) score += 2;
    // Slight preference for earlier lines
    if (i < 3) score += 1;
    if (score > best.score) { best = { line: line, score: score, idx: i }; }
  }
  if (best.score > 5) {
    result.name = best.line;
  } else {
    // Fallback: first line that's not price/size/hashtag
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.match(/^₱/)) continue;
      if (line.match(/^Sizes?\s*:/i)) continue;
      if (line.match(/^#/)) continue;
      if (line.length > 3 && !result.name) { result.name = line; best.idx = i; break; }
    }
  }
  // Description: everything after the name line in the original caption
  if (result.name && best.idx >= 0) {
    var realIdx = origIdx[best.idx];
    var pos = 0;
    for (var i = 0; i <= realIdx; i++) {
      pos += originalLines[i].length + 1;
    }
    var descEnd = caption.length;
    var sizePos = caption.toLowerCase().indexOf('sizes');
    if (sizePos > pos && sizePos < descEnd) descEnd = sizePos;
    var hashPos = caption.indexOf('#');
    if (hashPos > pos && hashPos < descEnd) descEnd = hashPos;
    result.description = caption.substring(pos, descEnd).trim().replace(/^[\s\n]+/, '');
  }
  console.log('[Trace] parseCaptionToFields() — result:', JSON.stringify({name:result.name, price:result.price, sizes:result.sizes.length, hashtags:result.hashtags.length, category0:result.category0, category1:result.category1, category2:result.category2}));
  return result;
}

function showImportPreview(data) {
  var preview = document.getElementById('importPreview');
  var fallback = document.getElementById('importFallback');
  if (!preview) return;
  preview.style.display = 'block';
  if (fallback) fallback.style.display = 'none';
  document.getElementById('importName').value = data.name || '';
  document.getElementById('importPrice').value = data.price || '';
  document.getElementById('importDesc').value = data.description || '';
  // Set dropdowns
  if (data.category0) { var g = document.getElementById('importCategory0'); if (g) g.value = data.category0; }
  if (data.category1) { var s = document.getElementById('importCategory1'); if (s) s.value = data.category1; }
  if (data.category2) { var b = document.getElementById('importCategory2'); if (b) b.value = data.category2; }
  renderImportSizeChecks(data.sizes);
  // Store images
  importImageData = data.images || [];
  renderImportImageThumbs();
}

function renderImportImageThumbs() {
  var container = document.getElementById('importImages');
  var countEl = document.getElementById('importImageCount');
  if (!container) return;
  if (!importImageData || importImageData.length === 0) {
    container.innerHTML = '<span style="color:#999;font-size:12px">No images</span>';
    if (countEl) countEl.textContent = '0';
    return;
  }
  if (countEl) countEl.textContent = importImageData.length;
  container.innerHTML = importImageData.map(function(img, i) {
    var thumb = typeof img === 'string' && img.startsWith('http') ? img : (typeof img === 'object' && img.url ? img.url : img);
    return '<div style="position:relative;display:inline-block"><img src="' + thumb + '" style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #ddd" onerror="this.style.display=\'none\'"><button type="button" class="import-remove-img" data-idx="' + i + '" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;border:none;background:#dc3545;color:#fff;font-size:12px;line-height:1;cursor:pointer;padding:0">×</button></div>';
  }).join('');
}

document.addEventListener('click', function(e) {
  var rmBtn = e.target.closest('.import-remove-img');
  if (rmBtn) {
    var idx = parseInt(rmBtn.dataset.idx);
    if (!isNaN(idx) && idx >= 0 && idx < importImageData.length) {
      importImageData.splice(idx, 1);
      renderImportImageThumbs();
    }
  }
});

// Local scraper button
document.getElementById('importScraperBtn').addEventListener('click', function() {
  var urlInput = document.getElementById('importScraperUrl');
  var status = document.getElementById('importScraperStatus');
  var url = (urlInput.value || '').trim();
  if (!url) { showToast('Enter a Facebook post URL.', 'info'); return; }
  status.textContent = 'Scraping...';
  status.style.color = '#1976d2';
  fetch('http://localhost:8899/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url })
  }).then(function(r) {
    if (!r.ok) return r.json().then(function(j) { throw new Error(j.error || 'HTTP ' + r.status); });
    return r.json();
  }).then(function(data) {
    status.textContent = 'Done! (' + data.images.length + ' images, ' + data.text.length + ' chars)';
    status.style.color = '#2e7d32';
    var fields = parseCaptionToFields(data.text);
    fields.images = data.images;
    showImportPreview(fields);
  }).catch(function(err) {
    status.textContent = 'Error: ' + err.message + '. Make sure fb-server.py is running on port 8899.';
    status.style.color = '#e94560';
  });
});

// Parse button
var ipb = document.getElementById('importParseBtn');
if (ipb) ipb.addEventListener('click', function() {
  var embed = document.getElementById('importEmbedInput');
  if (!embed || !embed.value.trim()) { showToast('Paste a Facebook embed code first.', 'info'); return; }
  var statusEl = document.getElementById('importParseStatus');
  if (statusEl) statusEl.textContent = 'Parsing...';
  var postUrl = parseFacebookEmbed(embed.value.trim());

  // Show post URL as clickable link in status
  if (postUrl) {
    if (statusEl) statusEl.innerHTML = 'Post URL: <a href="' + postUrl + '" target="_blank" style="color:#1976d2;text-decoration:underline">' + postUrl.substring(0, 60) + '...</a> — ';
  } else {
    if (statusEl) statusEl.textContent = 'Could not extract URL from embed code. ';
  }
  if (statusEl && !statusEl.textContent.match(/Post URL/)) statusEl.innerHTML = '<span style="color:#888">Could not extract URL.</span> ';

  // Try worker endpoint (best-effort)
  var proxyUrl = localStorage.getItem('stock_proxy_url') || '';
  if (proxyUrl && postUrl) {
    var apiUrl = proxyUrl.replace(/\/+$/, '') + '/facebook/parse-post';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: postUrl })
    }).then(function(r) {
      if (!r.ok) return r.json().then(function(j) { throw new Error(j.error || 'HTTP ' + r.status); });
      return r.json();
    }).then(function(resp) {
      if (statusEl) statusEl.textContent = '';
      if (resp.error) { showImportFallback(postUrl); return; }
      var fields = parseCaptionToFields(resp.caption);
      fields.name = fields.name || resp.name || '';
      fields.description = fields.description || resp.caption || '';
      fields.images = resp.images || [];
      showImportPreview(fields);
    }).catch(function() {
      showImportFallback(postUrl);
    });
  } else {
    showImportFallback(postUrl);
    if (!proxyUrl && statusEl) statusEl.textContent = 'Set your Stock Proxy URL in Config tab first. Images will use placeholder.';
  }
});

function showImportFallback(postUrl) {
  var preview = document.getElementById('importPreview');
  var fallback = document.getElementById('importFallback');
  if (preview) preview.style.display = 'none';
  if (fallback) {
    fallback.style.display = 'block';
    // Show post URL link in fallback
    var urlEl = document.getElementById('importFallbackUrl');
    if (urlEl && postUrl) {
      urlEl.innerHTML = 'Open in browser: <a href="' + postUrl + '" target="_blank" style="color:#1976d2;text-decoration:underline">' + postUrl + '</a>';
      urlEl.style.display = 'block';
    } else if (urlEl) {
      urlEl.style.display = 'none';
    }
  }
  // Focus caption textarea
  var capEl = document.getElementById('importManualCaption');
  if (capEl) capEl.focus();
}

// Manual parse button
var impb = document.getElementById('importManualParseBtn');
if (impb) impb.addEventListener('click', function() {
  var captionEl = document.getElementById('importManualCaption');
  var imagesEl = document.getElementById('importManualImages');
  var caption = captionEl ? captionEl.value.trim() : '';
  var imageUrls = imagesEl ? imagesEl.value.trim().split('\n').map(function(l) { return l.trim(); }).filter(Boolean) : [];
  if (!caption && imageUrls.length === 0) { showToast('Paste a caption or image URLs.', 'info'); return; }
  var fields = parseCaptionToFields(caption);
  fields.images = imageUrls;
  // If no name extracted but images exist, let user fill it
  if (!fields.name && !fields.price && imageUrls.length > 0) {
    fields.name = '';
    fields.description = caption;
  }
  showImportPreview(fields);
});

// Save button
var isb = document.getElementById('importSaveBtn');
if (isb) isb.addEventListener('click', function() {
  console.log('[Trace] importSaveBtn clicked');
  var statusEl = document.getElementById('importSaveStatus');
  if (statusEl) statusEl.textContent = 'Processing...';
  var name = document.getElementById('importName').value.trim();
  var price = document.getElementById('importPrice').value.trim();
  var desc = document.getElementById('importDesc').value.trim();
  var category0 = document.getElementById('importCategory0').value;
  var category1 = document.getElementById('importCategory1').value;
  var category2 = document.getElementById('importCategory2').value;
  if (!name || !price) { showToast('Name and price are required.', 'error'); if (statusEl) statusEl.textContent = ''; return; }
  // Collect checked sizes
  var sizeCbs = document.querySelectorAll('.import-size-cb:checked');
  var sizes = Array.from(sizeCbs).map(function(cb) { return cb.value; });
  // Build variants (single default variant if no sizes)
  var variants = {};
  if (sizes.length > 0) {
    var stock = {};
    sizes.forEach(function(s) { stock[s] = 5; });
    variants['Default'] = { sizes: sizes, stock: stock };
  } else {
    variants['Default'] = { sizes: [], stock: { q: 5 } };
  }
  // Process images: resize each one
  var imagesToSave = [];
  var pending = importImageData.length;
  var _saved = false;
  if (pending === 0) { imagesToSave = ['images/products/placeholder.svg']; }
  function finishSave() {
    if (_saved) { console.log('[Trace] import finishSave() — already saved, skipping'); return; }
    console.log('[Trace] import finishSave() — name:', name, 'price:', price, 'imagesToSave count:', imagesToSave.length);
    _saved = true;
    clearTimeout(saveTimeout);
    var maxId = products.length > 0 ? Math.max.apply(null, products.map(function(p) { return p.id; })) : 0;
    var newProd = {
      id: maxId + 1,
      name: name,
      category0: category0 || '',
      category1: category1 || '',
      category2: category2 || '',
      variants: variants,
      price: price.indexOf('₱') === 0 ? price : '₱' + price,
      description: desc || '',
      images: imagesToSave,
      available: true,
      onSale: false
    };
    products.push(newProd);
    saveProducts();
    renderAdminList();
    renderProducts();
    if (statusEl) statusEl.textContent = '✓ Saved as "' + name + '" (ID: ' + newProd.id + ')';
    showToast('Product "' + name + '" saved!', 'success');
    // Reset
    importImageData = [];
    document.getElementById('importEmbedInput').value = '';
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importFallback').style.display = 'none';
  }
  console.log('[Trace] importSaveBtn — pending images:', pending);
  if (pending === 0) { console.log('[Trace] importSaveBtn — no images, saving directly'); finishSave(); return; }
  var proxyUrl = localStorage.getItem('stock_proxy_url') || '';
  var processed = 0;
  var saveTimeout = setTimeout(function() {
    if (!_saved) {
      if (statusEl) statusEl.textContent = 'Image processing timed out. Saving without images.';
      imagesToSave = ['images/products/placeholder.svg'];
      finishSave();
    }
  }, 30000);
  importImageData.forEach(function(img, idx) {
    var url = typeof img === 'object' && img.url ? img.url : (typeof img === 'string' ? img : '');
    if (!url || url.startsWith('data:')) {
      if (url.startsWith('data:')) { imagesToSave[idx] = url; console.log('[Trace] import image', idx, 'is data URL, kept inline'); }
      processed++;
      console.log('[Trace] import image', idx, 'processed (inline/empty), total:', processed, '/', pending);
      if (processed === pending) finishSave();
      return;
    }
    console.log('[Trace] import image', idx, 'downloading from:', url.substring(0, 80));
    // Download through worker proxy
    var downloadUrl = proxyUrl ? proxyUrl.replace(/\/+$/, '') + '/facebook/image?url=' + encodeURIComponent(url) : url;
    fetch(downloadUrl).then(function(r) {
      if (!r.ok) { console.warn('[Trace] import image', idx, 'fetch failed with status:', r.status); return null; }
      return r.blob();
    }).then(function(blob) {
      if (!blob) { console.warn('[Trace] import image', idx, 'no blob, using placeholder'); imagesToSave[idx] = 'images/products/placeholder.svg'; processed++; console.log('[Trace] import image', idx, 'done (placeholder), total:', processed, '/', pending); if (processed === pending) finishSave(); return; }
      var file = new File([blob], 'import_' + idx + '.jpg', { type: blob.type || 'image/jpeg' });
      console.log('[Trace] import image', idx, 'downloaded, blob size:', blob.size, 'resizing...');
      resizeImage(file, 800, 0.8, function(dataUrl) {
        imagesToSave[idx] = dataUrl;
        processed++;
        console.log('[Trace] import image', idx, 'resized, total:', processed, '/', pending);
        if (processed === pending) finishSave();
      });
    }).catch(function(err) {
      console.warn('[Trace] import image', idx, 'error:', err.message);
      imagesToSave[idx] = 'images/products/placeholder.svg';
      processed++;
      console.log('[Trace] import image', idx, 'done (error->placeholder), total:', processed, '/', pending);
      if (processed === pending) finishSave();
    });
  });
});
