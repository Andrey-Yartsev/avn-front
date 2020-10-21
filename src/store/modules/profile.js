"use strict";

import UserApi from "@/api/user";
import home from "./profile/home.js";
import links from "./profile/links.js";
import media from "./profile/media.js";
import groups from "./profile/groups.js";

const state = {
  loading: false,
  error: null,
  fetchLoading: true,
  fetchError: true,
  changed: false,
  changeTrigger: false
};

const actions = {
  fetch({ commit, dispatch }, options) {
    return new Promise((resolve, reject) => {
      if (!options) options = {};
      commit("setFetchLoading", true);
      UserApi.fetch().then(async response => {
        response = await response.json();
        commit("setFetchLoading", false);
        if (response.error) {
          if (response.error.code === 102) {
            dispatch("auth/setOtpAuth", true, { root: true });
          }
          commit("setFetchError", response.error);
          reject(response.error);
          return;
        }
        dispatch("auth/setUser", response, { root: true });
        dispatch("auth/getUserConnectedData", null, { root: true });
        resolve();
      });
    });
  },
  async fetchSilent({ dispatch }) {
    let response = await UserApi.fetch();
    response = await response.json();
    dispatch("auth/setUser", response, { root: true });
  },
  update({ dispatch }, user) {
    return dispatch("_update", {
      user,
      silent: false
    });
  },
  updateSilent({ dispatch }, user) {
    dispatch("_update", {
      user,
      silent: true,
      extendBeforeUpdate: true
    });
  },
  extendSilent({ dispatch, rootState }, data) {
    dispatch("_update", {
      user: { ...rootState.auth.user, ...data },
      silent: true,
      extendBeforeUpdate: true
    });
  },
  _update(
    { commit, dispatch, rootState },
    { user, silent, extendBeforeUpdate }
  ) {
    commit("setError", null);
    commit("setLoading", true);
    if (extendBeforeUpdate) {
      dispatch("auth/extendUser", user, { root: true });
    }
    return new Promise((accept, reject) => {
      UserApi.update(user)
        .then(async response => {
          const r = await response.json();
          if (r.error) {
            commit("setError", r.error);
            if (!silent) {
              dispatch(
                "global/flashToast",
                {
                  text: r.error.message,
                  type: "error"
                },
                {
                  root: true
                }
              );
            }
            commit("setLoading", false);
            return;
          }
          if (!extendBeforeUpdate) {
            dispatch("auth/extendUser", r, { root: true });
          }
          if (rootState.profile.home.profile) {
            if (rootState.profile.home.profile.id === rootState.auth.user.id) {
              dispatch("profile/home/extend", r, { root: true });
            }
          }
          if (!silent) {
            dispatch(
              "global/flashToast",
              { text: "Changes saved successfully" },
              {
                root: true
              }
            );
          }
          commit("setLoading", false);
          accept(r);
        })
        .catch(error => {
          dispatch("global/setError", error, { root: true });
          commit("setError", error);
          commit("setLoading", false);
          reject(error);
        });
    });
  },
  extend({ rootState, dispatch }, data) {
    console.log(data);
    return dispatch("update", { ...rootState.auth.user, ...data });
  },
  setFetchLoading({ commit }, flag) {
    commit("setFetchLoading", flag);
  },
  afterLogin({ dispatch, rootState }) {
    if (!window.location.hostname.match(/gayvn/)) {
      return;
    }
    const category = 3;
    if (
      rootState.auth.user.category !== category ||
      rootState.auth.user.categoryView !== category
    ) {
      setTimeout(() => {
        dispatch("updateSilent", {
          ...rootState.auth.user,
          ...{
            category,
            categoryView: category
          }
        });
        dispatch(
          "global/flashToast",
          {
            text:
              "Your Default Viewing Preference & Primary Content Audience was switched to Gay Guys"
          },
          { root: true }
        );
      }, 4000);
    }
  }
};

const mutations = {
  setError(state, error) {
    state.error = error;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setFetchLoading(state, loading) {
    state.fetchLoading = loading;
  },
  setFetchError(state, error) {
    state.fetchError = error;
  },
  setChanged(state, changed) {
    state.changed = changed;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    home,
    links,
    media,
    groups
  }
};
