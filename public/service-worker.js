const CACHE_NAME = "v1";
const URLs = ["/", "/card", "/tags", "/pin", "/fav"];
const STATIC_ASSETS = [
  "assets/bg-texture.png",
  "assets/login-banner.jpg",
  "assets/logo.png",
  "assets/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
  "assets/Montserrat/Montserrat-VariableFont_wght.ttf",
  "assets/Montserrat/OFL.txt",
  "assets/Montserrat/README.txt",
  "assets/Montserrat/static/Montserrat-Black.ttf",
  "assets/Montserrat/static/Montserrat-BlackItalic.ttf",
  "assets/Montserrat/static/Montserrat-Bold.ttf",
  "assets/Montserrat/static/Montserrat-BoldItalic.ttf",
  "assets/Montserrat/static/Montserrat-ExtraBold.ttf",
  "assets/Montserrat/static/Montserrat-ExtraBoldItalic.ttf",
  "assets/Montserrat/static/Montserrat-ExtraLight.ttf",
  "assets/Montserrat/static/Montserrat-ExtraLightItalic.ttf",
  "assets/Montserrat/static/Montserrat-Italic.ttf",
  "assets/Montserrat/static/Montserrat-Light.ttf",
  "assets/Montserrat/static/Montserrat-LightItalic.ttf",
  "assets/Montserrat/static/Montserrat-Medium.ttf",
  "assets/Montserrat/static/Montserrat-MediumItalic.ttf",
  "assets/Montserrat/static/Montserrat-Regular.ttf",
  "assets/Montserrat/static/Montserrat-SemiBold.ttf",
  "assets/Montserrat/static/Montserrat-SemiBoldItalic.ttf",
  "assets/Montserrat/static/Montserrat-Thin.ttf",
  "assets/Montserrat/static/Montserrat-ThinItalic.ttf",
  "assets/Mulish/Mulish-Italic-VariableFont_wght.ttf",
  "assets/Mulish/Mulish-VariableFont_wght.ttf",
  "assets/Mulish/OFL.txt",
  "assets/Mulish/README.txt",
  "assets/Mulish/static/Mulish-Black.ttf",
  "assets/Mulish/static/Mulish-BlackItalic.ttf",
  "assets/Mulish/static/Mulish-Bold.ttf",
  "assets/Mulish/static/Mulish-BoldItalic.ttf",
  "assets/Mulish/static/Mulish-ExtraBold.ttf",
  "assets/Mulish/static/Mulish-ExtraBoldItalic.ttf",
  "assets/Mulish/static/Mulish-ExtraLight.ttf",
  "assets/Mulish/static/Mulish-ExtraLightItalic.ttf",
  "assets/Mulish/static/Mulish-Italic.ttf",
  "assets/Mulish/static/Mulish-Light.ttf",
  "assets/Mulish/static/Mulish-LightItalic.ttf",
  "assets/Mulish/static/Mulish-Medium.ttf",
  "assets/Mulish/static/Mulish-MediumItalic.ttf",
  "assets/Mulish/static/Mulish-Regular.ttf",
  "assets/Mulish/static/Mulish-SemiBold.ttf",
  "assets/Mulish/static/Mulish-SemiBoldItalic.ttf",
  "assets/MuseoModerno/MuseoModerno-Italic-VariableFont_wght.ttf",
  "assets/MuseoModerno/MuseoModerno-VariableFont_wght.ttf",
  "assets/MuseoModerno/OFL.txt",
  "assets/MuseoModerno/README.txt",
  "assets/MuseoModerno/static/MuseoModerno-Black.ttf",
  "assets/MuseoModerno/static/MuseoModerno-BlackItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Bold.ttf",
  "assets/MuseoModerno/static/MuseoModerno-BoldItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-ExtraBold.ttf",
  "assets/MuseoModerno/static/MuseoModerno-ExtraBoldItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-ExtraLight.ttf",
  "assets/MuseoModerno/static/MuseoModerno-ExtraLightItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Italic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Light.ttf",
  "assets/MuseoModerno/static/MuseoModerno-LightItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Medium.ttf",
  "assets/MuseoModerno/static/MuseoModerno-MediumItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Regular.ttf",
  "assets/MuseoModerno/static/MuseoModerno-SemiBold.ttf",
  "assets/MuseoModerno/static/MuseoModerno-SemiBoldItalic.ttf",
  "assets/MuseoModerno/static/MuseoModerno-Thin.ttf",
  "assets/MuseoModerno/static/MuseoModerno-ThinItalic.ttf",
  "assets/signup-banner.jpg",
  "assets/sound/computer-mouse-click-352734.mp3",
  "assets/Stickers/confuse.png",
  "assets/Stickers/error.png",
  "assets/Stickers/nervous.png",
  "assets/Stickers/nothing.png",
  "assets/Stickers/ok.png",
  "assets/Stickers/success.png",
  "favicon.ico",
  "gEzG0w1WVY.lottie",
  "icons/apple-touch-icon.png",
  "icons/favicon.ico",
  "icons/icon-192-maskable.png",
  "icons/icon-192.png",
  "icons/icon-512-maskable.png",
  "icons/icon-512.png",
  "icons/README.txt",
  "info.html",
  "logo.png",
  "manifest.json",
  "scripts/context_menu.js",
  "scripts/home.js",
  "scripts/index.js",
  "scripts/shortcut.js",
  "service-worker.js",
  "style/css/createSnippet.css",
  "style/css/createSnippet.css.map",
  "style/css/forgot.css",
  "style/css/forgot.css.map",
  "style/css/import_export.css",
  "style/css/import_export.css.map",
  "style/css/index.css",
  "style/css/index.css.map",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...URLs]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.respondWith(
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
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then(async (networkRes) => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkRes.clone());
          return networkRes;
        })
      );
    })
  );
});
