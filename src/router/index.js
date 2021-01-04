import Vue from "vue";
import Router from "vue-router";
import Auth from "./middlewares/auth";
import Store from "@/store";
import {
  authRoutes,
  profileRoutes,
  chatRoutes,
  postRoutes,
  mediaRoutes,
  settingsRoutes,
  exploreRoutes,
  staticRoutes,
  awardsRoutes
} from "./modules";

Vue.use(Router);

const routes = [
  {
    beforeEnter: Auth.requireAuthOrExplore,
    path: "/",
    name: "HomePage",
    component: () =>
      import(/* webpackChunkName: "HomePage" */ "@/components/pages/home/Index"),
    meta: {
      home: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/hashtag/:tag",
    redirect: to => {
      const { params } = to;
      return { path: `/search/users/${params.tag}/hashtag` };
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/notifications/:type?",
    name: "NotificationsPage",
    component: () =>
      import(/* webpackChunkName: "NotificationsPage" */ "@/components/pages/notification/Index"),
    meta: {
      cssName: "notifications",
      notifications: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/search/:type/:query/:isHashtag?",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "SearchPage" */ "@/components/pages/search/Index"),
    meta: {
      cssName: "search"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/stream",
    name: "StreamPage",
    component: () =>
      import(/* webpackChunkName: "StreamPage" */ "@/components/pages/stream/Index"),
    meta: {
      cssName: "stream"
    }
  },
  {
    beforeEnter: Auth.dummy,
    path: "/not-found",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFoundPage" */ "@/components/pages/notFound/Index"),
    meta: {
      noAuthHeader: true,
      cssName: "staticPage",
      noAuthSection: true
    }
  },
  {
    beforeEnter: Auth.dummy,
    path: "/password-confirmed",
    name: "ConfirmPage",
    component: () =>
      import(/* webpackChunkName: "ConfirmPage" */ "@/components/pages/confirm/Index"),
    meta: {
      noAuthHeader: true,
      cssName: "staticPage",
      noAuthSection: true,
      confirmType: "password"
    }
  },
  {
    beforeEnter: Auth.dummy,
    path: "/email-confirm-error",
    name: "ConfirmPage",
    component: () =>
      import(/* webpackChunkName: "ConfirmPage" */ "@/components/pages/confirm/Index"),
    meta: {
      noAuthHeader: true,
      cssName: "staticPage",
      noAuthSection: true,
      confirmType: "email"
    }
  },
  {
    beforeEnter: Auth.firstEnter,
    path: "/stories/:userId",
    name: "StoryPage",
    component: () =>
      import(/* webpackChunkName: "StoryPage" */ "@/components/pages/story/Index"),
    meta: {
      staticPage: true,
      cssName: "storiesPage"
    }
  },
  {
    beforeEnter: Auth.firstEnter,
    path: "/collections/:userId",
    name: "CollectionsPage",
    component: () =>
      import(/* webpackChunkName: "StoryPage" */ "@/components/pages/story/Index"),
    meta: {
      staticPage: true,
      cssName: "storiesPage",
      collections: true
    }
  },
  // {
  //   beforeEnter: Auth.requireAuth,
  //   path: "/statistics/debug",
  //   name: "StatisticPage2",
  //   component: () =>
  //     import(/* webpackChunkName: "StatPage" */ "@/components/statistics/Debug"),
  //   meta: {
  //     cssName: "statistics"
  //   }
  // },
  // {
  //   beforeEnter: Auth.requireAuth,
  //   path: "/statistics/debug-posts",
  //   name: "StatisticPage3",
  //   component: () =>
  //     import(/* webpackChunkName: "StatPage" */ "@/components/statistics/DebugPosts"),
  //   meta: {
  //     cssName: "statistics"
  //   }
  // },
  {
    beforeEnter: Auth.requireAuth,
    path: "/statistics/:_currentPeriodType?",
    name: "StatisticPage",
    component: () =>
      import(/* webpackChunkName: "StatPage" */ "@/components/statistics/Page"),
    meta: {
      cssName: "statistics"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/stream/obs",
    name: "StreamObsPage",
    component: () =>
      import(/* webpackChunkName: "StreamObsPage" */ "@/components/pages/stream/obs/Index"),
    meta: {
      cssName: "obs",
      noLayout: true
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/magazine",
    name: "MagazinePage",
    redirect: "/settings/magazine"
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/contests/:contestId/:nomineeId",
    name: "SingleNomineePage",
    component: () =>
      import(/* webpackChunkName: "SingleNomineePage" */ "@/components/pages/contest/SingleNominee"),
    meta: {
      cssName: "contests"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/contests/:contestId?",
    name: "ContestPage",
    component: () =>
      import(/* webpackChunkName: "ContestPage" */ "@/components/pages/contest/Index"),
    meta: {
      cssName: "contests"
    }
  },
  ...authRoutes,
  ...chatRoutes,
  ...settingsRoutes,
  ...exploreRoutes,
  ...staticRoutes,
  ...postRoutes,
  ...mediaRoutes,
  ...awardsRoutes,
  ...profileRoutes
];

const rtr = new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  routes
});

rtr.onError(error => {
  if (/Loading chunk .* failed./i.test(error.message)) {
    console.log("catch chunk error");
    window.location.reload();
  }
});

let routeLoadId = 0;

rtr.beforeEach((to, from, next) => {
  Store.commit("route/setLoadingName", to.name);
  next();
});

rtr.afterEach(() => {
  clearTimeout(routeLoadId);
  Store.commit("route/setLoadingName", null);
});

export default rtr;
