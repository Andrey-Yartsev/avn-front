const SW_VERSION = 1;
// service worker for enable 'add to home page' message on android chrome
self.addEventListener('fetch', function(event) {
  if (!event.request.headers.get('range')) {
    event.respondWith(fetch(event.request));
  }
});

