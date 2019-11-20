import Vue from "vue";
import "intersection-observer";
import VueScrollTo from "vue-scrollto";
import VueMq from "vue-mq";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
import VeeValidate, { Validator } from "vee-validate";
import VueObserveVisibility from "vue-observe-visibility";
import VueMask from "v-mask";
import VTooltip from "v-tooltip";
import BrowserStore from "store";
import "unfetch/polyfill";
import "url-search-params-polyfill";
import VueAnalytics from "vue-analytics";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import initSentry from "@/utils/sentry";
import "@/utils/libs/iconfont";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
require("./utils/registerServiceWorker");

Vue.use(VueMask);

Vue.use(VTooltip, {
  autoHide: true
});

Vue.use(VueObserveVisibility);

Vue.use(PerfectScrollbar);

VTooltip.enabled = window.innerWidth > 990;

// uncomment to see the logs
// import Logger from "js-logger";
// Logger.useDefaults();

if (process.env.NODE_ENV !== "development") {
  initSentry(Vue);
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

const queryString = require("query-string");
const queryParams = queryString.parse(window.location.search);

if (queryParams.auth_token) {
  BrowserStore.set("token", queryParams.auth_token);
  //window.history.pushState({}, document.title, window.location.pathname);
} else if (queryParams.gender) {
  BrowserStore.set("genderCategory", queryParams.gender);
  //window.history.pushState({}, document.title, window.location.pathname);
}

Vue.use(VueAnalytics, {
  id: "UA-2521515-51",
  router
});

Validator.extend("subscription-price", {
  getMessage: () => "Required two numbers past the decimal",
  validate: value => {
    const m = value.toString().match(/^\d+\.(\d+)?$/);
    if (!m) {
      return true;
    }
    return m[1].length === 2;
  }
});

const MyApp = new Vue({
  router,
  template: "<App/>",
  store,
  components: { App }
}).$mount("#app");

MyApp.$root.showTips = true;
MyApp.$root.isAvnApp = process.env.VUE_APP_NAME === "avn";
