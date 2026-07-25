/* ===========================================================
   sw.js — service worker for offline support.
   Caches the app shell on install, and opportunistically caches
   anything else (including the CDN barcode libraries) as it's
   fetched, so repeat offline visits keep working.
   Note: service workers only run over https:// or localhost —
   they are ignored (harmlessly) when opened via file://.
   =========================================================== */
const CACHE_NAME = 'giftly-erp-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './auth.js',
  './barcode.js',
  './app.js',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if(response && response.status === 200){
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
