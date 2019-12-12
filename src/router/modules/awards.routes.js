import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireAuthAdmin,
    path: "/avn_awards/nominations",
    name: "AvnAwards",
    component: () =>
      import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      notShowGenderFilter: true
    }
  },
  // {
  //   beforeEnter: Auth.requireAuthAdmin,
  //   path: "/gayvn_awards/nominations",
  //   name: "AvnAwardsGay",
  //   component: () =>
  //     import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/Index"),
  //   meta: {
  //     noAuthSection: true,
  //     staticPage: true,
  //     cssName: "staticPage",
  //     isGay: true,
  //     notShowGenderFilter: true
  //   }
  // },
  {
    beforeEnter: Auth.requireAuthAdmin,
    path: "/nominator/:username/:type/:categories?",
    name: "Nominator",
    component: () =>
      import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      predefined: true,
      notShowGenderFilter: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/avn_awards/voting/:category?",
    component: () =>
      import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/secondTour/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      notShowGenderFilter: true
    }
  },
  // {
  //   beforeEnter: Auth.requireAny,
  //   path: "/gayvn_awards/voting/:category?",
  //   name: "AvnAwards2Gay",
  //   component: () =>
  //     import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/secondTour/Index"),
  //   meta: {
  //     noAuthSection: true,
  //     staticPage: true,
  //     cssName: "staticPage",
  //     isGay: true,
  //     notShowGenderFilter: true
  //   }
  // },
  {
    beforeEnter: Auth.requireAny,
    path: "/vote/:nomineeId/avn_awards/:category",
    component: () =>
      import(/* webpackChunkName: "AvnAwards" */ "@/components/pages/awards/secondTour/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      isGay: false,
      notShowGenderFilter: true,
      directVoting: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/vote",
    redirect: () => {
      if (window.location.host.match(/gayvn/)) {
        return "/gayvn_awards/voting";
      }
      return "/avn_awards/voting";
    }
  }
];
