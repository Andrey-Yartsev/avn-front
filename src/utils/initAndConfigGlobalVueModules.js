import VueScrollTo from "vue-scrollto";
import VueMq from "vue-mq";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
import VeeValidate from "vee-validate";
import VueObserveVisibility from "vue-observe-visibility";
import VueMask from "v-mask";
import VTooltip from "v-tooltip";
import BrowserStore from "store";
import VueAnalytics from "vue-analytics";
import initSentry from "@/utils/sentry";
import "intersection-observer";
import "unfetch/polyfill";
import "url-search-params-polyfill";
import "@/utils/libs/iconfont";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

export default props => {
  const { vm, router } = props;

  vm.use(VueMask);

  vm.use(VTooltip, {
    autoHide: true
  });
  VTooltip.enabled = window.innerWidth > 990;

  vm.use(VueObserveVisibility);

  vm.use(PerfectScrollbar);

  // uncomment to see the logs
  // import Logger from "js-logger";
  // Logger.useDefaults();

  if (process.env.NODE_ENV !== "development") {
    initSentry(vm);
  }

  vm.use(VueAwesomeSwiper);

  vm.use(VueScrollTo);

  vm.use(VueClipboard);

  vm.use(VueMq, {
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

  vm.use(VueAnalytics, {
    id: "UA-2521515-51",
    router
  });

  vm.use(VeeValidate);
};
