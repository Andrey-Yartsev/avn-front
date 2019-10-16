"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  started: false,
  trigStart: 0,
  likes: [],
  viewers: [],
  tips: []
};

const actions = {
  tryStart({ commit, dispatch, rootState }, { user, isActive }) {
    if (!isActive) {
      return;
    }
    if (!rootState.auth.user) {
      return;
    }
    if (rootState.auth.user.id !== user.id) {
      return;
    }
    dispatch("fetch").then(() => {
      commit("trigStart");
    });
  },
  stopped({ state, commit }) {
    if (!state.started) {
      return;
    }
    commit("started", false);
    commit("fetchError", {
      code: 106
    });
  }
};

const mutations = {
  trigStart(state) {
    state.trigStart++;
  },
  started(state, started) {
    state.started = started;
  },
  like(state, like) {
    if (!state.joined) {
      return;
    }
    state.likes.push(like);
  },
  look(state, look) {
    if (!state.joined) {
      return;
    }
    state.viewers.push(look);
  },
  unlook(state, look) {
    if (!state.joined) {
      return;
    }
    state.viewers = state.viewers.filter(
      viewer => viewer.user.id !== look.user.id
    );
  },
  tip(state, tip) {
    if (!state.joined) {
      return;
    }
    state.tips.push(tip);
  },
  reset(state) {
    state.likes = [];
    state.viewers = [];
    state.tips = [];
  }
};

createRequestAction({
  prefix: "fetch",
  requestType: "token",
  apiPath: "streams/obs/chat",
  resultKey: "stream",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  localError: true
});

createRequestAction({
  prefix: "stop",
  requestType: "token",
  apiPath: "streams/{id}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  }
});

createRequestAction({
  prefix: "update",
  requestType: "token",
  apiPath: "streams/obs/chat",
  resultKey: "stream",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "block",
  apiPath: "streams/block",
  requestType: "token",
  defaultLoading: true,
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "kick",
  apiPath: "streams/kick",
  requestType: "token",
  defaultLoading: true,
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
