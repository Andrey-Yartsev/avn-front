import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import App from "./App.vue";

import router from "./router";
import store from "./store";

import "./iconfont";

Vue.config.productionTip = false;

Vue.use(VueScrollTo);

new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");
