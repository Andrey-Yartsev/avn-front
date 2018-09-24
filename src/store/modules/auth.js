"use strict";

import BrowserStore from "store";
import AuthApi from "@/api/auth";
import Router from "@/router";
import Twitter from "@/utils/twitter";

const state = {
  loading: false,
  error: null,
  showCaptcha: false,
  user: null
};

const defaultUser = {
  userSettings: {
    nightMode: false
  }
};

const actions = {
  setUser({ commit }, user) {
    commit("setUser", user);
    BrowserStore.set("user", user);
  },

  extendUser({ state, dispatch }, user) {
    dispatch("setUser", Object.assign({}, state.user, user));
  },

  login({ commit, dispatch }, data) {
    commit("request");

    AuthApi.login(data)
      .then(user => {
        dispatch("setUser", user);
        commit("showCaptcha", false);
      })
      .then(() => Router.push("/"))
      .catch(error => {
        if (error.code === 101) {
          commit("showCaptcha", true);
        }
        commit("requestFailure", error.message);
        Router.push("/login");
      });
  },

  logout({ commit }) {
    commit("logout");
    Router.push("/login");
  },

  tryTwitterLogin({ dispatch }) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const secret = urlParams.get("secret");
    if (token && secret) {
      Twitter.getAuthToken(token, secret).then(user => {
        dispatch("setUser", user).then(() => {
          Router.push("/");
        });
      });
    }
  }
};

const mutations = {
  setUser(state, user) {
    state.user = Object.assign({}, defaultUser, user);
  },

  request(state) {
    state.error = null;
    state.loading = true;
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

  logout(state) {
    state.user = null;
    state.error = null;
    state.loading = false;
    BrowserStore.remove("user");
  },

  showCaptcha(state, show) {
    state.showCaptcha = show;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
