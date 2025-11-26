const CACHE_NAME = "v1";
const URLs = ["/", "/card", "/tags", "/pin", "/fav"];

const STATIC_ASSETS = [
  "/assets/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
  "/assets/Montserrat/Montserrat-VariableFont_wght.ttf",
  "/assets/Montserrat/OFL.txt",
  "/assets/Montserrat/README.txt",

  // Mulish
  "/assets/Mulish/Mulish-Italic-VariableFont_wght.ttf",
  "/assets/Mulish/Mulish-VariableFont_wght.ttf",
  "/assets/Mulish/OFL.txt",
  "/assets/Mulish/README.txt",

  // MuseoModerno (fixed typo here!)
  "/assets/MuseoModerno/MuseoModerno-Italic-VariableFont_wght.ttf",
  "/assets/MuseoModerno/MuseoModerno-VariableFont_wght.ttf",
  "/assets/MuseoModerno/OFL.txt",
  "/assets/MuseoModerno/README.txt",

  "/assets/signup-banner.jpg",
  "/assets/sound/computer-mouse-click-352734.mp3",

  "/assets/Stickers/confuse.png",
  "/assets/Stickers/error.png",
  "/assets/Stickers/nervous.png",
  "/assets/Stickers/nothing.png",
  "/assets/Stickers/ok.png",
  "/assets/Stickers/success.png",

  "/favicon.ico",

  "/manifest.json",

  "/scripts/context_menu.js",
  "/scripts/home.js",
  "/scripts/index.js",
  "/scripts/shortcut.js",

  "/style/css/ad_search.css",
  "/style/css/ad_search.css.map",

  "/style/css/card.css",
  "/style/css/card.css.map",

  "/style/css/chip.css",
  "/style/css/chip.css.map",

  "/style/css/createSnippet.css",
  "/style/css/createSnippet.css.map",

  "/style/css/folder.css",
  "/style/css/folder.css.map",

  "/style/css/folders.css",
  "/style/css/folders.css.map",

  "/style/css/forgot.css",
  "/style/css/forgot.css.map",

  "/style/css/import_export.css",
  "/style/css/import_export.css.map",

  "/style/css/index.css",
  "/style/css/index.css.map",

  "/style/css/login.css",
  "/style/css/login.css.map",

  "/style/css/Notification.css",
  "/style/css/Notification.css.map",

  "/style/css/notificationBar.css",
  "/style/css/notificationBar.css.map",

  "/style/css/profile.css",
  "/style/css/profile.css.map",

  "/style/css/searchBox.css",
  "/style/css/searchBox.css.map",

  "/style/css/settings.css",
  "/style/css/settings.css.map",

  "/style/css/signup.css",
  "/style/css/signup.css.map",

  "/style/css/tableCards.css",
  "/style/css/tableCards.css.map",

  "/style/css/tags.css",
  "/style/css/tags.css.map",

  "/style/css/toast.css",
  "/style/css/toast.css.map",
  "/gEzG0w1WVY.lottie",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...URLs, ...STATIC_ASSETS]);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only cache GET requests
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((networkRes) => {
          // ignore third-party URLs
          if (!req.url.startsWith(self.location.origin)) {
            return networkRes;
          }

          // cache response
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          // fallback for offline for pages
          if (req.mode === "navigate") return caches.match("/");
        });
    })
  );
});
