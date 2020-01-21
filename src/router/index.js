import Vue from "vue";
import Router from "vue-router";
import Auth from "./middlewares/auth";
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
    beforeEnter: Auth.requireAuth,
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
    // window.location.reload();
  }
});

export default rtr;
