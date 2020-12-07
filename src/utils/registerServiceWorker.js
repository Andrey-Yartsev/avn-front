export default () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        if (
          registration.active &&
          registration.active.scriptURL.indexOf("sw.pushManager.js") > -1
        ) {
          continue;
        }
        registration.unregister();
      }
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.register("/sw.pushManager.js");
      }
    });
  }
};
