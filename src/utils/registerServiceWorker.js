if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.register("/sw.push.js");
}
