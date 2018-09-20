"use strict";

import Store from "@/store";
import BrowserStore from "store";

const Auth = {
  get loggedIn() {
    return Store.state.auth.user;
  },

  logout(to, from, next) {
    if (!Auth.loggedIn) {
      return next("/login");
    }

    Store.dispatch("auth/logout", {
      next
    });
  },

  authenticate(data) {
    Store.dispatch("auth/login", data);
  },

  requireAuth(to, from, next) {
    if (Auth.loggedIn) {
      return next();
    }

    const user = BrowserStore.get("user");

    if (!user) {
      return next({
        path: "/login"
      });
    }

    Store.dispatch("auth/setUser", user).then(() => next());
  },

  requireNonAuth(to, from, next) {
    if (Auth.loggedIn) {
      return next({
        path: "/"
      });
    }
    next();
  }
};

export default Auth;
