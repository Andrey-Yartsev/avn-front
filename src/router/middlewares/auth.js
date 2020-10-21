"use strict";

import Store from "@/store";
import BrowserStore from "store";
import Twitter from "@/utils/twitter";
import Logger from "js-logger";

const trialLogger = Logger.get("trial");
const queryString = require("query-string");

const saveTrialCode = () => {
  const queryParams = queryString.parse(window.location.search);
  if (queryParams.trialCode) {
    trialLogger.info("save trial code to store:" + queryParams.trialCode);
    BrowserStore.set("trialCode", queryParams.trialCode);
    return true;
  }
  return false;
};

const Auth = {
  get loggedIn() {
    return Store.state.auth.user;
  },

  init(to, from, next) {
    BrowserStore.remove("onLoginSubsProfile"); // using only in twitter route
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

  firstEnter(to, from, next) {
    global.storyFirstEnter = !from.matched.length;
    return Auth.requireAny(to, from, next);
  },

  requireAuth(to, from, next) {
    BrowserStore.remove("onLoginSubsProfile"); // using only in twitter route
    const trialCodeExists = saveTrialCode();

    const params = queryString.parse(location.search);
    if (params.token && params.url) {
      Store.dispatch("auth/setToken", params.token);
      window.location = params.url;
      return;
    }
    if (Auth.loggedIn) {
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      if (to.path === "/settings/magazine") {
        BrowserStore.set("magazineRedirect", true);
      }
      if (to.path === "/settings/magazine/one-click") {
        BrowserStore.set("magazineModalRedirect", true);
      }
      return next("/login");
    }
    Store.dispatch("auth/setToken", token);
    Store.dispatch("profile/fetch")
      .then(() => {
        if (trialCodeExists) {
          return next("/");
        }
        next();
      })
      .catch(error => {
        if (error.code === 102) {
          Store.dispatch("auth/resetUser").then(() => {
            Store.dispatch("auth/setOtpAuth", true).then(() => {
              if (to.path === "/settings/magazine") {
                BrowserStore.set("magazineRedirect", true);
              }
              if (to.path === "/settings/magazine/one-click") {
                BrowserStore.set("magazineModalRedirect", true);
              }
              next("/login");
            });
          });
        } else {
          Store.dispatch("auth/logout").then(() => {
            if (to.path === "/settings/magazine") {
              BrowserStore.set("magazineRedirect", true);
            }
            if (to.path === "/settings/magazine/one-click") {
              BrowserStore.set("magazineModalRedirect", true);
            }
            next("/login");
          });
        }
      });
  },

  requireAuthOrExplore(to, from, next) {
    const savedData = BrowserStore.get("nomUserRegData");
    BrowserStore.remove("onLoginSubsProfile"); // using only in twitter route
    const trialCodeExists = saveTrialCode();

    const params = queryString.parse(location.search);
    if (params.token && params.url) {
      Store.dispatch("auth/setToken", params.token);
      window.location = params.url;
      return;
    }
    if (Auth.loggedIn) {
      if (savedData) {
        return next("/avn_awards/nominations");
      }
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      return next("/explore");
    }
    Store.dispatch("auth/setToken", token);
    Store.dispatch("profile/fetch")
      .then(() => {
        if (trialCodeExists) {
          return next("/");
        }
        if (savedData) {
          return next("/avn_awards/nominations");
        }
        next();
      })
      .catch(error => {
        if (error.code === 102) {
          Store.dispatch("auth/resetUser").then(() => {
            Store.dispatch("auth/setOtpAuth", true).then(() =>
              next("/explore")
            );
          });
        } else {
          Store.dispatch("auth/logout").then(() => {
            next("/explore");
          });
        }
      });
  },

  requireNonAuth(to, from, next) {
    BrowserStore.remove("onLoginSubsProfile"); // using only in twitter route
    saveTrialCode();

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

  requireAuthAdmin(to, from, next) {
    BrowserStore.remove("onLoginSubsProfile"); // using only in twitter route
    const trialCodeExists = saveTrialCode();

    const params = queryString.parse(location.search);
    if (params.token && params.url) {
      Store.dispatch("auth/setToken", params.token);
      window.location = params.url;
      return;
    }
    if (
      Auth.loggedIn &&
      (Auth.loggedIn.adminReturnUrl || Auth.loggedIn.showVote)
    ) {
      return next();
    }
    const token = BrowserStore.get("token");
    if (!token) {
      return next("/login");
    }
    Store.dispatch("auth/setToken", token);
    Store.dispatch("profile/fetch")
      .then(() => {
        if (
          trialCodeExists ||
          (!Auth.loggedIn.adminReturnUrl && !Auth.loggedIn.showVote)
        ) {
          return next("/");
        }
        next();
      })
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

  requireAny(to, from, next) {
    BrowserStore.remove("onLoginSubsProfile");
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
        if (!r) {
          return next(
            "/login?error=" + encodeURIComponent("Twitter connection error")
          );
        }
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

        const username = BrowserStore.get("onLoginSubsProfile");
        if (username) {
          Store.commit("profile/home/setOnLoginAction", "subscribe");
          BrowserStore.remove("onLoginSubsProfile");
          return next("/" + username);
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
