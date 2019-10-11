"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  likes: [],
  viewers: [],
  tips: []
};

const actions = {};

const mutations = {
  like(state, like) {
    state.likes.push(like);
  },
  look(state, look) {
    state.viewers.push(look);
  },
  tip(state, tip) {
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

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
