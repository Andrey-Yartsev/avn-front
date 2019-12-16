import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "SettingsDefaultPage" */ "@/components/pages/settings/default/Index"),
    meta: {
      title: "Settings",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/profile",
    name: "SettingsProfile",
    component: () =>
      import(/* webpackChunkName: "SettingsDefaultPage" */ "@/components/pages/settings/default/Index"),
    meta: {
      title: "Edit Profile",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/security",
    component: () =>
      import(/* webpackChunkName: "SettingsSecurityPage" */ "@/components/pages/settings/security/Index"),
    name: "SettingsSecurity",
    meta: {
      title: "Security",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/notifications",
    name: "SettingsNotifications",
    component: () =>
      import(/* webpackChunkName: "SettingsNotificationPage" */ "@/components/pages/settings/notification/Index"),
    meta: {
      title: "Notifications Settings",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/payments",
    name: "SettingsPaymentsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsPaymentsPage" */ "@/components/pages/settings/payments/Index"),
    meta: {
      title: "Payments",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/credits",
    name: "SettingsCreditsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsCreditsPage" */ "@/components/pages/settings/credits/Index"),
    meta: {
      title: "Credits",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/payouts",
    name: "SettingsPayouts",
    component: () =>
      import(/* webpackChunkName: "SettingsPayoutsPage" */ "@/components/pages/settings/payouts/Index"),
    meta: {
      title: "Payouts",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/premium-links",
    name: "SettingsPremiumLinks",
    component: () =>
      import(/* webpackChunkName: "SettingsPremiumLinksPage" */ "@/components/pages/settings/premiumLinks/Index"),
    meta: {
      title: "Premium Links",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/products",
    name: "SettingsProducts",
    component: () =>
      import(/* webpackChunkName: "SettingsProductsPage" */ "@/components/pages/settings/products/Index"),
    meta: {
      title: "My purchases",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/account/:view?",
    name: "SettingsAccount",
    component: () =>
      import(/* webpackChunkName: "SettingsAccountPage" */ "@/components/pages/settings/account/Index.vue"),
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/avn",
    name: "SettingsNomination",
    component: () =>
      import(/* webpackChunkName: "SettingsNominationPage" */ "@/components/pages/settings/nomination/Index.vue"),
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/gayvn",
    name: "SettingsNominationGay",
    component: () =>
      import(/* webpackChunkName: "SettingsNominationPage" */ "@/components/pages/settings/nomination/Index.vue"),
    meta: {
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/story/:view?",
    name: "SettingsStory",
    component: () =>
      import(/* webpackChunkName: "SettingsStoryPage" */ "@/components/pages/settings/story/Index.vue"),
    meta: {
      cssName: "settings",
      title: "Story Settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/privacy/:view?",
    name: "SettingsPrivacy",
    component: () =>
      import(/* webpackChunkName: "SettingsPrivacyPage" */ "@/components/pages/settings/privacy/Index.vue"),
    meta: {
      title: "Privacy",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/referrals",
    name: "SettingsReferralsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsReferralsPage" */ "@/components/pages/settings/referrals/Index.vue"),
    meta: {
      title: "Referrals",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/trials",
    name: "SettingsTrialsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsTrialsPage" */ "@/components/pages/settings/trials/Index.vue"),
    meta: {
      title: "Free Trials",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/w9",
    name: "W9",
    component: () =>
      import(/* webpackChunkName: "W9" */ "@/components/pages/settings/payouts/W9.vue"),
    meta: {
      title: "W9",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/obs",
    name: "SettingsObsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsObsPage" */ "@/components/pages/settings/obs/Index.vue"),
    meta: {
      title: "OBS",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/subscribers",
    name: "SettingsSubscribersPage",
    component: () =>
      import(/* webpackChunkName: "SettingsSubscribersPage" */ "@/components/pages/settings/subscribers/Index.vue"),
    meta: {
      title: "Subscribers",
      cssName: "settings"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/settings/earnings",
    name: "SettingsEarningsPage",
    component: () =>
      import(/* webpackChunkName: "SettingsEarningsPage" */ "@/components/pages/settings/earnings/Index.vue"),
    meta: {
      title: "Earnings",
      cssName: "settings"
    }
  }
];
