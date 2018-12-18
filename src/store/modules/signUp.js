"use strict";

import InitApi from "@/api/init";
import UserApi from "@/api/user";
import Router from "@/router";

const state = {
  showCaptcha: false,
  signUpError: null
};

const actions = {
  init({ commit }) {
    InitApi.fetch().then(async response => {
      response = await response.json();
      commit("showCaptcha", response.showCaptchaOnRegistration);
    });
  },
  signUp({ commit, dispatch }, data) {
    commit("signUpError", null);
    UserApi.signUp(data).then(async response => {
      response = await response.json();
      if (response.error) {
        commit("signUpError", response.error.message);
        return;
      }
      dispatch("auth/setToken", response.accessToken, { root: true }).then(
        () => {
          dispatch("profile/fetch", null, { root: true }).then(() => {
            Router.push("/settings/profile?signup=true");
          });
        }
      );
    });
  },
  signUpFromModal({ commit, dispatch }, data) {
    commit("signUpError", null);
    UserApi.signUp(data).then(async response => {
      response = await response.json();
      if (response.error) {
        commit("signUpError", response.error.message);
        return;
      }
      dispatch("auth/setToken", response.accessToken, { root: true }).then(
        () => {
          dispatch("profile/fetch", null, { root: true }).then(() => {
            commit("modal/hideSafe", { name: "signup" }, { root: true });
          });
        }
      );
    });
  }
};

const mutations = {
  showCaptcha(state, showCaptcha) {
    state.showCaptcha = showCaptcha;
  },
  signUpError(state, error) {
    state.signUpError = error;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
