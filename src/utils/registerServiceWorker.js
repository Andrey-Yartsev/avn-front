function isSafari() {
  const is_safari = navigator.userAgent.toLowerCase().indexOf("safari/") > -1;
  return is_safari;
}

if ("serviceWorker" in navigator && !isSafari()) {
  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for (let registration of registrations) {
  //     registration.unregister();
  //   }
  // });

  navigator.serviceWorker.register("/serviceWorker.js").then(function() {
    console.log("Service worker registered!");
  });
}
