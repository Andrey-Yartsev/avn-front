import Auth from "../middlewares/auth";
import Profile from "../middlewares/profile";

export const routes = [
  {
    beforeEnter: Auth.requireAuth,
    path: "/followers",
    name: "FollowersPage",
    component: () =>
      import(/* webpackChunkName: "FollowersPage" */ "@/components/pages/followers/Index"),
    meta: {
      title: "followers",
      cssName: "following"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/following",
    name: "FollowingPage",
    component: () =>
      import(/* webpackChunkName: "FollowersPage" */ "@/components/pages/followers/Index"),
    meta: {
      title: "following",
      cssName: "following"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/likes",
    name: "LikesPage",
    component: () =>
      import(/* webpackChunkName: "LikesPage" */ "@/components/pages/likes/Index"),
    meta: {
      title: "likes",
      cssName: "likes"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/subscribers",
    name: "SubscribersPage",
    component: () =>
      import(/* webpackChunkName: "SubscribersPage" */ "@/components/pages/subscribers/Index"),
    meta: {
      title: "subscribes",
      cssName: "following"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/earnings",
    name: "EarningsPage",
    component: () =>
      import(/* webpackChunkName: "EarningsPage" */ "@/components/pages/earnings/Index"),
    meta: {
      title: "earnings",
      cssName: "following"
    }
  },
  {
    beforeEnter: Profile.init,
    path: "/:username/:page?",
    name: "ProfilePage",
    component: () =>
      import(/* webpackChunkName: "ProfilePage" */ "@/components/pages/profile/NotFoundWrapper"),
    meta: {
      cssName: "userProfile",
      profile: true
    }
  }
];
