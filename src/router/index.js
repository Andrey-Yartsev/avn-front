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
  staticRoutes
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
    name: "ExplorePage",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "feed",
      type: "feed",
      cssName: "explore"
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
    path: "/search/:type/:query",
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
    name: "PasswordConfirmed",
    component: () =>
      import(/* webpackChunkName: "PasswordConfirmedPage" */ "@/components/pages/passwordConfirmed/Index"),
    meta: {
      noAuthHeader: true,
      cssName: "staticPage",
      noAuthSection: true
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
  {
    beforeEnter: Auth.requireAuth,
    path: "/statistics",
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
    path: "/contests",
    name: "ContestPage",
    component: () =>
      import(/* webpackChunkName: "ContestPage" */ "@/components/pages/contest/Index")
  },
  ...authRoutes,
  ...chatRoutes,
  ...settingsRoutes,
  ...exploreRoutes,
  ...staticRoutes,
  ...postRoutes,
  ...mediaRoutes,
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
