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
    path: "/subscribers",
    name: "SubscribersPage",
    component: () =>
      import(/* webpackChunkName: "FollowersPage" */ "@/components/pages/followers/Index"),
    meta: {
      title: "subscribers",
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
    beforeEnter: Profile.init,
    path: "/:username/one-click/tip/:tipAmount",
    redirect: {
      name: "ProfilePage",
      component: () =>
        import(/* webpackChunkName: "ProfilePage" */ "@/components/pages/profile/NotFoundWrapper"),
      meta: route => ({
        cssName: "userProfile",
        profile: true,
        tipAmount: route.params.tipAmount
      })
    }
  },
  {
    beforeEnter: Profile.media,
    path: "/:username/media/:accessToken",
    name: "ProfilePageAccessToken",
    component: () =>
      import(/* webpackChunkName: "ProfilePage" */ "@/components/pages/profile/NotFoundWrapper"),
    meta: {
      cssName: "userProfile",
      profile: true
    }
  },
  {
    beforeEnter: Profile.contests,
    path: "/:username/c/:contestId?/:nomineeId?",
    name: "ContestPage",
    component: () =>
      import(/* webpackChunkName: "ContestPage" */ "@/components/pages/contest/Index"),
    meta: {
      cssName: "contests"
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
