/* eslint-disable no-useless-escape */

import Store from "@/store";
import CommonApi from "@/api/common";

export default {
  data() {
    return {
      isSubscribed: false,
      swRegistration: null,
      webPushes: false,
      disableBtn: false
    };
  },
  computed: {
    applicationServerKey() {
      return this.urlB64ToUint8Array(
        Store.state.init.data.webPushSettings.publicKey
      );
    }
  },
  methods: {
    changeWP() {
      this.disableBtn = true;
      if (this.isSubscribed) {
        this.unsubscribeUser();
      } else {
        this.subscribeUser();
      }
    },
    urlB64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    updateBtn() {
      if (Notification.permission === "denied") {
        this.webPushes = false;
        this.disableBtn = true;
      } else {
        this.webPushes = this.isSubscribed;
        this.disableBtn = false;
      }
    },
    updateSubscriptionOnServer(subscription) {
      if (subscription) {
        CommonApi.webPushes(true, subscription)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return Promise.resolve(response);
            } else {
              var error = new Error(response.statusText || response.status);
              error.response = response;
              return Promise.reject(error);
            }
          })
          .then(function(response) {
            return response.json();
          })
          .catch(console.error);
      }
    },
    subscribeUser() {
      this.swRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.applicationServerKey
        })
        .then(subscription => {
          this.updateSubscriptionOnServer(subscription);
          this.isSubscribed = true;
          this.updateBtn();
        })
        .catch(function(err) {
          console.error("Failed to subscribe the user: ", err);
          this.updateBtn();
        });
    },
    unsubscribeUser() {
      this.swRegistration.pushManager
        .getSubscription()
        .then(subscription => {
          if (subscription) {
            return CommonApi.webPushes(false, subscription).then(() => {
              return subscription.unsubscribe();
            });
          }
        })
        .then(() => {
          this.isSubscribed = false;
          this.updateBtn();
        })
        .catch(console.error);
    }
  },
  mounted() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js");
      navigator.serviceWorker.ready
        .then(swReg => {
          this.swRegistration = swReg;
          this.swRegistration.pushManager
            .getSubscription()
            .then(subscription => {
              this.isSubscribed = !(subscription === null);
              this.updateBtn();
            });
        })
        .catch(console.error);
    } else {
      this.webPushes = false;
      this.disableBtn = true;
    }
  }
};
