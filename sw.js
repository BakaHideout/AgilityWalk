/* ==========================================================================
   Agility Walk — service worker
   Bump CACHE_VERSION every time you push a new build to GitHub. Changing
   this file at all (even just the number below) is what makes browsers
   detect an update, download it in the background, and let index.html
   show the "Update available" banner.
========================================================================== */
const CACHE_VERSION = "v8";
const CACHE_NAME = "agility-walk-" + CACHE_VERSION;

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache)=> cache.addAll(APP_SHELL))
  );
  // don't auto-activate — wait for the page to ask (SKIP_WAITING),
  // so the update banner can show first instead of swapping silently
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then((keys)=>
      Promise.all(keys.filter((k)=> k !== CACHE_NAME).map((k)=> caches.delete(k)))
    ).then(()=> self.clients.claim())
  );
});

self.addEventListener("message", (event)=>{
  if(event.data && event.data.type === "SKIP_WAITING"){
    self.skipWaiting();
  }
});

// stale-while-revalidate: serve from cache instantly (works offline),
// refresh the cache in the background so the *next* load or update
// check can pick up new content
self.addEventListener("fetch", (event)=>{
  if(event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return; // let CDN/script requests pass straight through

  event.respondWith(
    caches.open(CACHE_NAME).then((cache)=>
      cache.match(event.request).then((cached)=>{
        const network = fetch(event.request).then((response)=>{
          if(response && response.status === 200){
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(()=> cached);
        return cached || network;
      })
    )
  );
});
