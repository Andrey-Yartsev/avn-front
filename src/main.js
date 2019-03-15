import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import VueMq from "vue-mq";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
import VeeValidate from "vee-validate";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import "@/iconfont";

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);
Vue.use(VueScrollTo);
Vue.use(VueClipboard);
Vue.use(VeeValidate);

Vue.use(VueMq, {
  breakpoints: {
    mobile: 990,
    desktop: Infinity
  }
});

const MyApp = new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");

MyApp.$root.showTips = true;
MyApp.$root.isTeamApp = process.env.VUE_APP_NAME === "teams";
MyApp.$root.isAvnApp = process.env.VUE_APP_NAME === "avn";
