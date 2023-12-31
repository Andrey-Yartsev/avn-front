/* eslint-disable no-undef */
"use strict";

const SW_VERSION = 1; 

self.addEventListener("install", function() {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function(event) {
  var data = JSON.parse(event.data.text());

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon || "/static/img/avn-push.jpg"
  };
  if (data.data) {
    options.data = data.data;
  }
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    return clients.openWindow(event.notification.data.url);
  }
});

// add fetch handler only to android devices
if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
  console.log('Add Service Worker fetch proxy to android');
  self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
  });
}

