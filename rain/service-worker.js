const uniqueSN="741880";let urlsToCache=["/rain/","/rain/manifest.json","/rain/script.js","/rain/assets/rain.mp3","/rain/assets/bg.webp"];self.addEventListener("install",function(e){e.waitUntil(caches.open("741880").then(function(e){return e.addAll(urlsToCache)}),caches.keys().then(function(e){e.forEach(function(e){"741880"!==e&&caches.delete(e)})}))}),self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(n){return n||fetch(e.request)}))});