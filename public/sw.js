/* eslint-disable no-undef */
"use strict";

self.addEventListener("install", function() {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function(event) {
  var data = JSON.parse(event.data.text());

  const title = data.title;
  console.log(data);
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
