// ==UserScript==
// @name         JapanGoodies Facebook Importer
// @namespace    https://japangoodies.pages.dev/
// @version      1.0
// @description  Adds an Import button to Facebook posts — copies data to clipboard for the JapanGoodies admin panel
// @author       JapanGoodies
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

(function() {
  'use strict';

  var STORAGE_KEY = 'jgi_pending_import';

  function addButton() {
    if (document.getElementById('jgi-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'jgi-btn';
    btn.textContent = '📥 Import';
    btn.title = 'Copy post data to clipboard for JapanGoodies import';
    btn.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:999999',
      'padding:10px 20px',
      'background:#1976d2',
      'color:#fff',
      'border:none',
      'border-radius:8px',
      'font-size:15px',
      'font-weight:bold',
      'cursor:pointer',
      'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
      'font-family:sans-serif',
      'transition:transform .15s, box-shadow .15s',
    ].join(';');
    btn.onmouseenter = function() {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)';
    };
    btn.onmouseleave = function() {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    };
    btn.onclick = collectAndCopy;
    document.body.appendChild(btn);
  }

  function collectAndCopy() {
    var data = { url: location.href, images: [], text: '' };
    var seen = {};

    document.querySelectorAll('img').forEach(function(img) {
      if (!img.src) return;
      if (img.src.indexOf('emoji') > -1) return;
      if (img.src.indexOf('fbcdn') === -1 && img.src.indexOf('scontent') === -1) return;
      var base = img.src.split('?')[0];
      if (seen[base]) return;
      seen[base] = true;
      try {
        if (img.offsetParent !== null || img.complete) data.images.push(img.src);
      } catch(e) {}
    });

    var article = document.querySelector('[role="article"]');
    if (article) {
      var texts = [];
      article.querySelectorAll('p, span, div').forEach(function(el) {
        var t = (el.textContent || '').trim();
        if (t.length > 30) texts.push(t);
      });
      if (texts.length > 0) {
        data.text = texts.filter(function(v,i,a){return a.indexOf(v)===i;}).join('\n---\n');
      } else {
        data.text = article.textContent.trim().substring(0, 3000);
      }
    }

    var str = JSON.stringify(data, null, 2);

    try {
      GM_setClipboard(str);
      flash('✅ Copied!');
    } catch(e) {
      var ta = document.createElement('textarea');
      ta.value = str;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); flash('✅ Copied!'); }
      catch(e2) { prompt('Copy manually:', str); flash('❌ Copy failed'); }
      document.body.removeChild(ta);
    }

    console.log('[JGI] Import data:', str);
  }

  function flash(msg) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = [
      'position:fixed',
      'top:20px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:999999',
      'background:#1b1b1b',
      'color:#fff',
      'padding:12px 28px',
      'border-radius:8px',
      'font-size:15px',
      'font-family:sans-serif',
      'box-shadow:0 4px 20px rgba(0,0,0,0.3)',
      'transition:opacity .3s',
    ].join(';');
    document.body.appendChild(el);
    setTimeout(function() {
      el.style.opacity = '0';
      setTimeout(function() { document.body.removeChild(el); }, 400);
    }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }

  var observer = new MutationObserver(function() {
    if (!document.getElementById('jgi-btn')) addButton();
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
})();
