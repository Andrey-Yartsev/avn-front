import Vue from "vue";
import Router from "vue-router";

import HomePage from "./components/pages/home/Index";
import ExplorePage from "./components/pages/explore/Index";
import ExploreStoriesPage from "./components/pages/explore/Stories";
import ExploreVideosPage from "./components/pages/explore/Videos";
import ExplorePhotosPage from "./components/pages/explore/Photos";
import ExploreLivePage from "./components/pages/explore/Live";
import MessagesPage from "./components/pages/messages/Index";
import NotificationsPage from "./components/pages/notifications/Index";
import LoginPage from "./components/pages/noAuth/Login";
import SignUpPage from "./components/pages/noAuth/SignUp";
import SettingsDefaultPage from "./components/pages/settings/default/Index";
import SettingsSecurityPage from "./components/pages/settings/security/Index";

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
    beforeEnter: Auth.twitterAuth,
    path: "/twitter"
  },
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/register",
    component: SignUpPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/",
    component: HomePage
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
    component: SettingsDefaultPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/profile",
    component: SettingsDefaultPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/security",
    component: SettingsSecurityPage
  }
];

export default new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  routes
});
