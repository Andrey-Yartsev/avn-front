import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter:
      process.env.VUE_APP_IS_AWARDS_ACTIVE === "true"
        ? Auth.requireAny
        : Auth.requireAuthAdmin,
    path: "/avn_awards/nominations",
    name: "AvnAwards",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsNominations" */ "@/components/pages/awards/PreNominationClosed"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      notShowGenderFilter: true
    }
  },
  {
    beforeEnter:
      process.env.VUE_APP_IS_AWARDS_ACTIVE === "true"
        ? Auth.requireAny
        : Auth.requireAuthAdmin,
    path: "/gayvn_awards/nominations",
    name: "AvnAwardsGay",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsNominations" */ "@/components/pages/awards/PreNominationClosed"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      isGay: true,
      notShowGenderFilter: true
    }
  },
  {
    beforeEnter:
      process.env.VUE_APP_IS_AWARDS_ACTIVE === "true"
        ? Auth.requireAny
        : Auth.requireAuthAdmin,
    path: "/nominator/:username/:type/:categories?",
    name: "Nominator",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsNominations" */ "@/components/pages/awards/PreNominationClosed"),
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
      import(/* webpackChunkName: "AvnAwardsVotingCategory" */ "@/components/pages/awards/secondTour/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      notShowGenderFilter: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/gayvn_awards/voting/:category?",
    name: "AvnAwards2Gay",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsVotingCategory" */ "@/components/pages/awards/secondTour/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      isGay: true,
      notShowGenderFilter: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/vote/:nomineeId/avn_awards/:category",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsVotingCategory" */ "@/components/pages/awards/secondTour/Index"),
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
    path: "/vote/:nomineeId/gayvn_awards/:category",
    component: () =>
      import(/* webpackChunkName: "AvnAwardsVotingCategory" */ "@/components/pages/awards/secondTour/Index"),
    meta: {
      noAuthSection: true,
      staticPage: true,
      cssName: "staticPage",
      isGay: true,
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
