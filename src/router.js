import Vue from "vue";
import Router from "vue-router";

import IndexPage from "./components/pages/Index";
import ExplorePage from "./components/pages/explore/Index";
import ExploreStoriesPage from "./components/pages/explore/Stories";
import ExploreVideosPage from "./components/pages/explore/Videos";
import ExplorePhotosPage from "./components/pages/explore/Photos";
import ExploreLivePage from "./components/pages/explore/Live";
import MessagesPage from "./components/pages/messages/Index";
import NotificationsPage from "./components/pages/notifications/Index";
import LoginPage from "./components/Login";
import SettingsDefaultPage from "./components/pages/settings/Index";

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
    beforeEnter: Auth.requireAuth,
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
    path: "/settings",
    component: SettingsDefaultPage,
    name: "settings"
    // children: [
    //   {
    //     path: "",
    //     redirect: () => ({
    //       path: "/settings/default"
    //     }),
    //     component: SettingsDefaultPage,
    //     name: "settings",
    //   }
    // ]
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/profile",
    component: SettingsDefaultPage,
    name: "SettingsProfile"
  }
];

export default new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  routes
});
