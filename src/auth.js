"use strict";

import Store from "@/store";
import BrowserStore from "store";
import Twitter from "@/utils/twitter";

const Auth = {
  get loggedIn() {
    return Store.state.auth.user;
  },

  logout(to, from, next) {
    Store.dispatch("auth/logout").then(() => {
      next("/login");
    });
  },

  init(to, from, next) {
    if (Auth.loggedIn) {
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      return next();
    }
    Store.dispatch("auth/setToken", token);
    return Store.dispatch("profile/fetch")
      .then(() => next())
      .catch(error => {
        if (error.code === 102) {
          Store.dispatch("auth/resetUser").then(() => {
            Store.dispatch("auth/setOtpAuth", true).then(() => next("/login"));
          });
        } else {
          Store.dispatch("auth/logout").then(() => {
            next("/login");
          });
        }
      });
  },

  requireAuth(to, from, next) {
    if (Auth.loggedIn) {
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      return next("/login");
    }
    Store.dispatch("auth/setToken", token);
    Store.dispatch("profile/fetch")
      .then(() => next())
      .catch(error => {
        if (error.code === 102) {
          Store.dispatch("auth/resetUser").then(() => {
            Store.dispatch("auth/setOtpAuth", true).then(() => next("/login"));
          });
        } else {
          Store.dispatch("auth/logout").then(() => {
            next("/login");
          });
        }
      });
  },

  requireNonAuth(to, from, next) {
    const token = BrowserStore.get("token");
    if (token) {
      Store.dispatch("auth/setToken", token);
      Store.dispatch("profile/fetch")
        .then(() => next("/"))
        .catch(next);
    } else {
      Store.commit("profile/setFetchLoading", false);
      next();
    }
  },

  requireAny(to, from, next) {
    if (Auth.loggedIn) {
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      Store.dispatch("profile/setFetchLoading", false);
      return next();
    }
    Store.dispatch("auth/setToken", token);
    Store.dispatch("profile/fetch")
      .then(() => next())
      .catch(error => {
        if (error.code === 102) {
          Store.dispatch("auth/resetUser").then(() => {
            Store.dispatch("auth/setOtpAuth", true).then(() => next());
          });
        } else {
          Store.dispatch("auth/logout").then(() => {
            next();
          });
        }
      });
  },

  twitterAuth(to, from, next) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const secret = urlParams.get("secret");
    if (token && secret) {
      Twitter.getAuthToken(token, secret).then(r => {
        if (r.error && r.error.message) {
          return next("/login?error=" + encodeURIComponent(r.error.message));
        }
        if (!r.accessToken) {
          throw new Error("Twitter login error");
        }
        Store.dispatch("auth/setToken", r.accessToken);
        if (r.otpEnable) {
          Store.dispatch("auth/setOtpAuth", true);
          return next("/login");
        }
        next("/");
      });
    }
  },

  dummy(to, from, next) {
    Store.dispatch("profile/setFetchLoading", false);
    next();
  }
};

export default Auth;
