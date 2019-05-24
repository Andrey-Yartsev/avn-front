import Vue from "vue";
import "intersection-observer";
import VueScrollTo from "vue-scrollto";
import VueMq from "vue-mq";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
import VeeValidate from "vee-validate";
import * as Sentry from "@sentry/browser";
import VueObserveVisibility from "vue-observe-visibility";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import "unfetch/polyfill";
import "url-search-params-polyfill";
import "@/iconfont";

import VTooltip from "v-tooltip";

Vue.use(VTooltip, {
  autoHide: true
});

Vue.use(VueObserveVisibility);

VTooltip.enabled = window.innerWidth > 990;

// uncomment to see the logs
// import Logger from "js-logger";
// Logger.useDefaults();

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://3309a55a4d2549f2b4aa2aa1c67589fc@bug.stars.avn.com/2",
    integrations: [
      new Sentry.Integrations.Vue({
        Vue,
        attachProps: true
      }),
      new Sentry.Integrations.RewriteFrames()
    ],
    environment: process.env.VUE_APP_LOG_MODE
  });
}

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
