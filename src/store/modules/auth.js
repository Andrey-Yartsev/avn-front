"use strict";

import BrowserStore from "store";
import AuthApi from "@/api/auth";
import Router from "@/router";

const state = {
  loading: false,
  error: null,
  showCaptcha: false,
  user: null
};

const actions = {
  setUser({ commit }, user) {
    commit("setUser", user);
  },

  login({ commit }, data) {
    commit("request");

    AuthApi.login(data)
      .then(user => {
        commit("setUser", user);
        commit("showCaptcha", false);
        BrowserStore.set("user", user);
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
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
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
