import "./components";
import "@/main";
import Auth from "@/router/auth";
import router from "@/router";
import SettingsCreditsPage from "@/components/pages/settings/credits/Index";
import profileRoute from "@/router/profileRoute";

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

// Google Analytics

window.ga("set", "page", router.currentRoute.path);
window.ga("send", "pageview");

router.afterEach(to => {
  window.ga("set", "page", to.path);
  window.ga("send", "pageview");
});
