import { createRequestAction } from "../utils/storeRequest";

const state = {
  show: false,
  username: null
};

const cache = {};

const actions = {
  open({ state, commit, dispatch }, username) {
    if (state.username === username) {
      return;
    }
    commit("open");
    dispatch("fetch", username).catch(() => {});
  },
  hide({ commit }) {
    commit("hide");
  },
  fetch({ commit, dispatch }, username) {
    if (cache[username]) {
      commit("setResult", username);
      return;
    }
    return dispatch("_fetch", username).then(result => {
      cache[username] = result;
    });
  }
};

const mutations = {
  open(state, username) {
    state.show = true;
    state.username = username;
  },
  hide(state) {
    state.show = false;
  },
  setResult(state, username) {
    state._fetchResult = cache[username];
  }
};

createRequestAction({
  requestType: "any",
  prefix: "_fetch",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  },
  localError: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
