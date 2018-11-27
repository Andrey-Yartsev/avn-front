"use strict";

import BrowserStore from "store";
import UserApi from "@/api/user";
import Router from "@/router";

const state = {
  loading: false,
  loginInProgress: false,
  error: null,
  showCaptcha: false,
  token: "",
  user: null,
  otpAuth: false
};

const defaultUser = {
  userSettings: {
    nightMode: false
  }
};

const actions = {
  setToken({ commit }, token) {
    BrowserStore.set("token", token);
    commit("setToken", token);
  },

  resetUser({ commit }) {
    commit("resetUser");
  },

  setUser({ commit }, user) {
    commit("setUser", user);
  },

  extendUser({ state, dispatch }, user) {
    dispatch("setUser", { ...state.user, ...user });
  },

  login({ commit, dispatch }, data) {
    commit("request");
    UserApi.login(data)
      .then(user => {
        dispatch("setToken", user.accessToken);
        if (user.isOtpNeeded) {
          dispatch("setOtpAuth", true);
          Router.push("/login");
          return;
        }
        dispatch("profile/fetch", null, { root: true });
        commit("showCaptcha", false);
      })
      .then(() => {
        commit("requestSuccess");
        Router.push("/", () => {
          commit("loginFinished");
        });
      })
      .catch(error => {
        if (error.code === 101) {
          commit("showCaptcha", true);
          commit("loginFinished");
        } else {
          commit("requestFailure", error.message);
          commit("loginFinished");
        }
        Router.push("/login");
      });
  },

  logout({ commit, dispatch }) {
    commit("logout");
    dispatch("payouts/reset", null, { root: true });
  },

  setOtpAuth({ commit }, flag) {
    commit("setOtpAuth", flag);
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },

  setUser(state, user) {
    state.user = Object.assign({}, defaultUser, user);
  },

  resetUser() {
    state.user = null;
  },

  request(state) {
    state.error = null;
    state.loading = true;
    state.loginInProgress = true;
  },

  requestSuccess(state) {
    state.loading = false;
  },

  requestFailure(state, error) {
    state.error = error;
    state.user = null;
    state.loading = false;
    BrowserStore.remove("user");
  },

  loginFinished(state) {
    state.loginInProgress = false;
  },

  logout(state) {
    state.user = null;
    state.token = "";
    state.error = null;
    state.loading = false;
    state.otpAuth = false;
    BrowserStore.remove("token");
  },

  showCaptcha(state, show) {
    state.showCaptcha = show;
  },

  setOtpAuth(state, flag) {
    state.otpAuth = flag;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
