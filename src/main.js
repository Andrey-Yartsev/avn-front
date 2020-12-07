import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import initAndConfigGlobalVueModules from "@/utils/initAndConfigGlobalVueModules";
import registerServiceWorker from "@/utils/registerServiceWorker";

registerServiceWorker();
initAndConfigGlobalVueModules({ vm: Vue, router });

const MyApp = new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");

window.MyApp = MyApp;
