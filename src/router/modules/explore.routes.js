import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/all",
    name: "ExploreAll",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "all",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/stories",
    name: "ExploreStories",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "stories",
      type: "story",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/photos",
    name: "ExplorePhotos",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "photos",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/media",
    name: "ExploreMedia",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "media",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/clips/:category",
    name: "ExploreStore",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "clips",
      type: "media",
      cssName: "explore"
    }
  },
  {
    path: "/explore/clips",
    redirect: "/explore/clips/all"
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/live",
    name: "ExploreLive",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "lives",
      type: "live",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/videos",
    name: "ExploreVideos",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "videos",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/top",
    name: "ExploreTop",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "topmodels",
      type: "top",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore",
    name: "Explore",
    component: () =>
      import(/* webpackChunkName: "ExplorePage" */ "@/components/pages/explore/Index"),
    meta: {
      page: "feed",
      type: "feed",
      cssName: "explore"
    }
  }
];
