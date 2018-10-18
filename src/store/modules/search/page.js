"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {};

const mutations = {
  reset(state) {
    state.items = [];
  }
};

const actions = {};

createRequestAction({
  prefix: "search",
  apiPath: "search/{type}",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  resultKey: "items",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query.query = params.query;
    options.query.offset = params.offset || 0;
    options.query.limit = params.limit || 5;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{type}/, params.type);
  },
  resultConvert: function(result) {
    return result.list;
  }
});

actions.follow = ({ commit, dispatch }, userId) => {
  dispatch("user/follow", userId, { root: true }).then(() => {
    commit("extendUser", {
      userId,
      data: { followedBy: true }
    });
  });
};

actions.unfollow = ({ commit, dispatch }, userId) => {
  dispatch("user/unfollow", userId, { root: true }).then(() => {
    commit("extendUser", {
      userId,
      data: { followedBy: false }
    });
  });
};

actions.block = ({ commit, dispatch }, userId) => {
  dispatch("user/block", userId, { root: true }).then(r => {
    if (r.success) {
      commit("extendUser", {
        userId,
        data: { isBlocked: true }
      });
    }
  });
};
actions.unblock = ({ commit, dispatch }, userId) => {
  dispatch("user/unblock", userId, { root: true }).then(r => {
    if (r.success) {
      commit("extendUser", {
        userId,
        data: { isBlocked: false }
      });
    }
  });
};

mutations.extendUser = (state, { userId, data }) => {
  state.items = state.items.map(user => {
    if (user.id === userId) {
      user = { ...user, ...data };
    }
    return user;
  });
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
