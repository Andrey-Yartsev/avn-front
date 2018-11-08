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
import SettingsPayoutsPage from "./components/pages/settings/payouts/Index";
import SettingsPaymentsPage from "./components/pages/settings/payments/Index";
import SettingsAccountPage from "./components/pages/settings/account/Index.vue";
import SettingsStoryPage from "./components/pages/settings/story/Index.vue";
import SettingsPrivacyPage from "./components/pages/settings/privacy/Index.vue";
import SettingsReferralsPage from "./components/pages/settings/referrals/Index.vue";
import ProfilePage from "./components/pages/profile/Index";
import PostPage from "./components/pages/post/Index";
import NotFoundPage from "./components/pages/notFound/Index";
import Chat from "./components/chat/Chat";
import ChatNewMessage from "./components/chat/NewMessage";
import SearchPage from "./components/pages/search/Index";
import StoryPage from "./components/pages/story/Index";
import AddPostPage from "./components/pages/addPost/Index";
import StreamPage from "./components/pages/stream/Index";

import Auth from "./auth";
import Profile from "./profile";

Vue.use(Router);

const routes = [
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/login",
    component: LoginPage,
    meta: {
      cssName: "login"
    }
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
    component: SignUpPage,
    meta: {
      cssName: "forgot"
    }
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
    path: "/addPost",
    component: AddPostPage,
    meta: {
      cssName: "addPost"
    }
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
    component: NotificationsPage,
    meta: {
      cssName: "notifications"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/search/:type/:query",
    component: SearchPage
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings",
    component: SettingsDefaultPage,
    name: "Settings",
    meta: {
      title: "Settings",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/profile",
    component: SettingsDefaultPage,
    name: "SettingsProfile",
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/security",
    component: SettingsSecurityPage,
    name: "SettingsSecurity",
    meta: {
      title: "Security",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/notifications",
    component: SettingsNotificationPage,
    name: "SettingsNotifications",
    meta: {
      title: "Notifications Settings",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/payments",
    component: SettingsPaymentsPage,
    meta: {
      title: "Payments",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/payouts",
    component: SettingsPayoutsPage,
    name: "SettingsPayouts",
    meta: {
      title: "Payouts",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/account/:view?",
    component: SettingsAccountPage,
    name: "SettingsAccount",
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/story",
    component: SettingsStoryPage,
    name: "SettingsStory",
    meta: {
      cssName: "settings",
      title: "Story Settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/privacy",
    component: SettingsPrivacyPage,
    name: "SettingsPrivacy",
    meta: {
      title: "Privacy",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/referrals",
    component: SettingsReferralsPage,
    meta: {
      title: "Referrals",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/stream",
    component: StreamPage
  },
  // PUBLIC ZONE
  {
    beforeEnter: Auth.dummy,
    path: "/not-found",
    component: NotFoundPage,
    meta: {
      noAuthHeader: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/post/:postId",
    component: PostPage,
    meta: {
      cssName: "post"
    }
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
      type: "story",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/photos",
    component: ExplorePage,
    meta: {
      page: "photos",
      type: "media",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/live",
    component: ExplorePage,
    meta: {
      page: "lives",
      type: "live",
      cssName: "explore"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/explore/videos",
    component: ExplorePage,
    meta: {
      page: "videos",
      type: "media",
      cssName: "explore"
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
    path: "/:username/:page?",
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
