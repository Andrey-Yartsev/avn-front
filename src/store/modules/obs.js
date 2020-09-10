"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  isRunning: false,
  started: false,
  trigStart: 0,
  likes: [],
  viewers: [],
  tips: []
};

const actions = {
  tryStart({ state, commit, dispatch, rootState }, { user, isActive }) {
    if (!state.isRunning) {
      return;
    }
    if (!isActive) {
      return;
    }
    if (!rootState.auth.user) {
      return;
    }
    if (rootState.auth.user.id !== user.id) {
      return;
    }
    if (state.started) {
      return;
    }
    dispatch("fetch").then(() => {
      commit("trigStart");
    });
  },
  stopped({ state, commit, dispatch }, stream) {
    if (!state.started) {
      return;
    }
    if (state.stream.id !== stream.id) {
      return;
    }
    commit("started", false);
    commit("fetchError", {
      code: 106
    });
    dispatch("reset");
  },
  reset({ commit }) {
    commit("reset");
    commit("lives/resetCurrentLive", null, { root: true });
  }
};

const mutations = {
  isRunning(state, isRunning) {
    state.isRunning = isRunning;
  },
  trigStart(state) {
    state.trigStart++;
  },
  started(state, stream) {
    state.started = !!stream;
    state.stream = stream;
  },
  like(state, like) {
    if (!state.started) {
      return;
    }
    state.likes.push(like);
  },
  look(state, look) {
    if (!state.started) {
      return;
    }
    state.viewers.push(look);
  },
  unlook(state, look) {
    if (!state.started) {
      return;
    }
    state.viewers = state.viewers.filter(
      viewer => viewer.user.id !== look.user.id
    );
  },
  tip(state, tip) {
    if (!state.started) {
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
