import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import VueMq from "vue-mq";
import VueAwesomeSwiper from "vue-awesome-swiper";

import App from "./App.vue";

import router from "./router";
import store from "./store";

import "./iconfont";

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);
Vue.use(VueScrollTo);
Vue.use(VueMq, {
  breakpoints: {
    mobile: 576,
    tablet: 990,
    desktop: Infinity
  }
});

new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");
