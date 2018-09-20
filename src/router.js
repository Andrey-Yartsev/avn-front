import Vue from "vue";
import Router from "vue-router";

import IndexPage from "./components/Pages/Index";
import ExplorePage from "./components/Pages/Explore/Index";
import ExploreStoriesPage from "./components/Pages/Explore/Stories";
import ExploreVideosPage from "./components/Pages/Explore/Videos";
import ExplorePhotosPage from "./components/Pages/Explore/Photos";
import ExploreLivePage from "./components/Pages/Explore/Live";
import MessagesPage from "./components/Pages/Messages/Index";
import NotificationsPage from "./components/Pages/Notifications/Index";
import LoginPage from "./components/Login";

import Auth from "@/auth.js";

Vue.use(Router);

const routes = [
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/login",
    component: LoginPage
  },
  {
    path: "/logout",
    beforeEnter: Auth.logout
  },
  {
    // beforeEnter: Auth.requireAuth,
    path: "/",
    component: IndexPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/explore",
    component: ExplorePage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/explore/stories",
    component: ExploreStoriesPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/explore/photos",
    component: ExplorePhotosPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/explore/live",
    component: ExploreLivePage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/explore/videos",
    component: ExploreVideosPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat",
    component: MessagesPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/notifications",
    component: NotificationsPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/login",
    component: LoginPage
  }
];

export default new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  routes
});
