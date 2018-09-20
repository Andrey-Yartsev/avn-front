"use strict";

import BrowserStore from "store";
import AuthApi from "@/api/auth";
import Router from "@/router";

const state = {
  loading: false,
  error: null,
  credentials: null
  // user: null,
  // clientInfo: BrowserStore.get('user') || {}
};

const actions = {
  ["AUTH_SET_USER"]({ commit }, data) {
    commit("AUTH_SET_USER", data.user);
    commit("AUTH_SUCCESS", data.user);
    data.next();
  },

  ["AUTH_REQUEST"]({ commit, dispatch }, data) {
    commit("AUTH_REQUEST");

    if (!data.next) {
      data.next = function() {};
    }

    AuthApi.login(data)
      .then(user => {
        commit("AUTH_SET_USER", user);
      })
      .catch(err => {
        commit("AUTH_FAILURE", err);
        data.next("/login");
      });
  },

  ["AUTH_LOGOUT"]({ commit }) {
    commit("AUTH_LOGOUT_SUCCESS");
    Router.push("/login");
  }
};

const mutations = {
  ["AUTH_SET_USER"](state, user) {
    state.user = user;
  },

  ["AUTH_REQUEST"](state) {
    state.loading = true;
  },

  ["AUTH_SUCCESS"](state) {
    // state.user.email = email
    BrowserStore.set("user", state.tempUser);
  },

  ["AUTH_FAILURE"](state, error) {
    state.error = error;
    state.user = null;
    state.loading = false;
    BrowserStore.remove("user");
  },

  ["AUTH_LOGOUT_SUCCESS"](state) {
    state.user = null;
    state.error = null;
    state.loading = false;
    BrowserStore.remove("user");
  }
};

export default {
  state,
  actions,
  mutations
};
