import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";

import "./iconfont";

Vue.config.productionTip = false;

new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");
