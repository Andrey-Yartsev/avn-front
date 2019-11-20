import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/login",
    name: "LoginPage",
    component: () =>
      import(/* webpackChunkName: "LoginPage" */ "@/components/pages/noAuth/Login"),
    meta: {
      cssName: "login"
    }
  },
  {
    path: "/logout",
    name: "LogoutPage",
    component: () =>
      import(/* webpackChunkName: "LogoutPage" */ "@/components/pages/noAuth/Logout"),
    meta: {
      noLayout: true
    }
  },
  {
    beforeEnter: Auth.twitterAuth,
    path: "/twitter"
  },
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/register",
    name: "RegisterPage",
    component: () =>
      import(/* webpackChunkName: "RegisterPage" */ "@/components/pages/noAuth/SignUp"),
    meta: {
      cssName: "login"
    }
  },
  {
    beforeEnter: Auth.requireNonAuth,
    path: "/register-model",
    name: "RegisterModelPage",
    component: () =>
      import(/* webpackChunkName: "RegisterPage" */ "@/components/pages/noAuth/SignUp"),
    meta: {
      cssName: "login",
      forModels: true
    }
  },
  {
    beforeEnter: Auth.requireAny,
    path: "/forgot",
    name: "ForgotPasswordPage",
    component: () =>
      import(/* webpackChunkName: "ForgotPasswordPage" */ "@/components/pages/noAuth/ForgotPassword"),
    meta: {
      cssName: "forgot"
    }
  }
];
