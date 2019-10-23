import "./components";
import "@/main";
import Auth from "@/router/auth";
import router from "@/router";
// import SettingsCreditsPage from "@/components/pages/settings/credits/Index";
const SettingsCreditsPage = () =>
  import(/* webpackChunkName: "SettingsCreditsPage" */ "@/components/pages/settings/credits/Index");
import profileRoute from "@/router/profileRoute";

import VueAnalytics from "vue-analytics";
import Vue from "vue";

router.addRoutes([
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/credits",
    component: SettingsCreditsPage,
    meta: {
      title: "Credits",
      cssName: "settings"
    }
  }
]);

profileRoute(router);

Vue.use(VueAnalytics, {
  id: "UA-2521515-51",
  router
});
