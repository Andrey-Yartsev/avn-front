import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireAny,
    path: "/terms",
    name: "StaticTerms",
    component: () =>
      import(/* webpackChunkName: "StaticPage" */ "@/components/pages/static/Index"),
    meta: {
      apiPoint: "terms",
      staticPage: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/dmca",
    name: "StaticDmca",
    component: () =>
      import(/* webpackChunkName: "StaticPage" */ "@/components/pages/static/Index"),
    meta: {
      apiPoint: "dmca",
      staticPage: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/privacy",
    name: "StaticPrivacy",
    component: () =>
      import(/* webpackChunkName: "StaticPage" */ "@/components/pages/static/Index"),
    meta: {
      apiPoint: "privacy",
      staticPage: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/contact",
    name: "StaticContacts",
    component: () =>
      import(/* webpackChunkName: "ContactsPage" */ "@/components/pages/static/Contacts"),
    meta: {
      staticPage: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/help",
    name: "StaticHelp",
    component: () =>
      import(/* webpackChunkName: "HelpCenterArticlePage" */ "@/components/pages/helpCenter/Articles"),
    meta: {
      staticPage: true,
      cssName: "support"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/help/search/:text",
    name: "StaticHelpSearch",
    component: () =>
      import(/* webpackChunkName: "HelpCenterSearchPage" */ "@/components/pages/helpCenter/Search"),
    meta: {
      staticPage: true,
      cssName: "support"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/help/article/:id",
    name: "StaticHelpArticle",
    component: () =>
      import(/* webpackChunkName: "HelpCenterArticlePage" */ "@/components/pages/helpCenter/Articles"),
    meta: {
      staticPage: true,
      cssName: "support"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/2257",
    name: "Static2257",
    component: () =>
      import(/* webpackChunkName: "StaticPage" */ "@/components/pages/static/Index"),
    meta: {
      apiPoint: "2257",
      staticPage: true,
      cssName: "staticPage"
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/usc2257",
    name: "StaticUsc2257",
    component: () =>
      import(/* webpackChunkName: "StaticPage" */ "@/components/pages/static/Index"),
    meta: {
      apiPoint: "usc2257",
      staticPage: true,
      cssName: "staticPage"
    }
  }
];
