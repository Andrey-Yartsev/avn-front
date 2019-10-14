"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  joined: false,
  likes: [],
  viewers: [],
  tips: []
};

const actions = {};

const mutations = {
  joined(state, joined) {
    state.joined = joined;
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
