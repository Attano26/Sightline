/* Sightline offline worker.

   What this does, in plain terms: it keeps a copy of the app on the device so it
   opens without a connection, and it tells the page when a newer version exists
   so the person can take it when they are ready.

   The one rule that matters here: a new version is NEVER applied while someone is
   mid simulation. It is downloaded quietly, the page shows a small bar, and the
   swap happens only when they tap it. Changing the interface under someone who is
   reading an answer is worse than them running an old version for ten minutes.

   Bump VERSION on every deploy. That is what tells every installed copy that
   something changed. */
const VERSION = "sightline-2026-08-25-a";

const ASSETS = [
  "./",
  "./index.html",
  "./sightline.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // Do not skip waiting here. The page decides when to swap.
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never touch anything off this origin. Google Fonts and the Gemini API must
  // go straight to the network, and caching an API call would be actively wrong.
  if (url.origin !== self.location.origin) return;

  // Network first for the app itself, so a fresh copy wins whenever there is a
  // connection, and the cache is the fallback rather than the default.
  const isPage = req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/");
  if (isPage) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match("./sightline.html")))
    );
    return;
  }

  // Cache first for icons and the manifest, which change rarely.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});

self.addEventListener("message", e => {
  if (e.data === "applyUpdate") self.skipWaiting();
});
