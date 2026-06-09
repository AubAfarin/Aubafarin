const CACHE = "aub-afarin-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/Logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-192-maskable.png",
  "/icon-512-maskable.png",
  "/apple-touch-icon.png",
  "/manifest.json"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(function(r) {
        var rc = r.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
        return r;
      })
      .catch(function() {
        return caches.match(e.request).then(function(r) {
          return r || caches.match("/index.html");
        });
      })
  );
});
