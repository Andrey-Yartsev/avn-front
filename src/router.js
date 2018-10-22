import Vue from "vue";
import Router from "vue-router";

import HomePage from "./components/pages/home/Index";
import ExplorePage from "./components/pages/explore/Index";
import NotificationsPage from "./components/pages/notification/Index";
import LoginPage from "./components/pages/noAuth/Login";
import SignUpPage from "./components/pages/noAuth/SignUp";
import ForgotPasswordPage from "./components/pages/noAuth/ForgotPassword";
import SettingsDefaultPage from "./components/pages/settings/default/Index";
import SettingsSecurityPage from "./components/pages/settings/security/Index";
import SettingsNotificationPage from "./components/pages/settings/notification/Index";
import ProfilePage from "./components/pages/profile/Index";
import PostPage from "./components/pages/post/Index";
import NotFoundPage from "./components/pages/notFound/Index";
import Chat from "./components/chat/Chat";
import ChatNewMessage from "./components/chat/NewMessage";
import SearchPage from "./components/pages/search/Index";
import StoryPage from "./components/pages/story/Index";

import Auth from "./auth";
import Profile from "./profile";

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
    beforeEnter: Auth.dummy,
    path: "/forgot",
    component: ForgotPasswordPage,
    meta: {
      cssName: "forgot",
      noAuthHeader: true
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/",
    component: HomePage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat",
    component: Chat,
    meta: {
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/no-messages",
    component: Chat,
    meta: {
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/new",
    component: ChatNewMessage,
    meta: {
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/home",
    name: "ChatHome",
    component: Chat,
    meta: {
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/:userId",
    component: Chat,
    meta: {
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/notifications/:type?",
    component: NotificationsPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/search/:type/:query",
    component: SearchPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/notifications",
    component: SettingsNotificationPage,
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings",
    component: SettingsDefaultPage,
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/profile",
    component: SettingsDefaultPage,
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/security",
    component: SettingsSecurityPage,
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/notifications",
    component: SettingsNotificationPage,
    meta: {
      cssName: "settings"
    }
  },
  // PUBLIC ZONE
  {
    beforeEnter: Auth.dummy,
    path: "/not-found",
    component: NotFoundPage,
    meta: {
      noAuthHeader: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/post/:postId",
    component: PostPage
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore",
    component: ExplorePage,
    meta: {
      page: "all",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/stories",
    component: ExplorePage,
    meta: {
      page: "stories",
      type: "story"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/photos",
    component: ExplorePage,
    meta: {
      page: "photos",
      type: "media"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/live",
    component: ExplorePage,
    meta: {
      page: "lives",
      type: "live"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/videos",
    component: ExplorePage,
    meta: {
      page: "videos",
      type: "media"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/stories/:userId",
    component: StoryPage
  },
  // PROFILE ZONE
  {
    beforeEnter: Profile.init,
    path: "*",
    component: ProfilePage,
    meta: {
      cssName: "userProfile"
    }
  }
];

export default new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  routes
});
