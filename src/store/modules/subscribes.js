"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";
import PostMixin from "@/store/mixins/posts";
import * as deepMerge from "deepmerge";

const limit = 15;

const state = {
  loading: false,
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit
};

const mutations = {
  reset(state) {
    state.posts = [];
    state.loading = false;
    state.marker = null;
    state.offset = 0;
    state.allDataReceived = false;
    state.limit = limit;
  },
  checkResult(state, { list: posts, marker }) {
    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    state.marker = marker;
  }
};

const actions = {
  getPosts({ dispatch, commit, state }, params) {
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = limit;
    return dispatch("subscribesRequest", params).then(r => {
      commit("checkResult", r);
    });
  },
  getSnapchatPosts({ dispatch, commit, state }, params) {
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = limit;
    return dispatch("subscribesSnapchatRequest", params).then(r => {
      commit("checkResult", r);
    });
  }
};

createRequestAction({
  prefix: "subscribesRequest",
  apiPath: "sales/subscribes",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  resultKey: "posts",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query.query = params.query;
    options.query.offset = params.offset || 0;
    options.query.limit = params.limit || 15;
    options.query.marker = params.marker || "";
    options.query.active =
      params.active === true ? 1 : params.active === false ? 0 : undefined;
    options.query.paid = params.paid ? 1 : 0;
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});

createRequestAction({
  prefix: "subscribesSnapchatRequest",
  apiPath: "sales/subscribes/snapchat",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  resultKey: "posts",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query.query = params.query;
    options.query.offset = params.offset || 0;
    options.query.limit = params.limit || 15;
    options.query.marker = params.marker || "";
    options.query.active =
      params.active === true ? 1 : params.active === false ? 0 : undefined;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{type}/, params.type);
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});

actions.follow = ({ commit, dispatch }, userId) => {
  dispatch("user/follow", userId, { root: true }).then(() => {
    commit("extendUser", {
      userId,
      data: { followedBy: true }
    });
    commit("auth/incrementFollowingCount", null, { root: true });
  });
};

actions.unfollow = ({ commit, dispatch }, userId) => {
  dispatch("user/unfollow", userId, { root: true }).then(() => {
    commit("extendUser", {
      userId,
      data: { followedBy: false }
    });
    commit("auth/decrementFollowingCount", null, { root: true });
  });
};

actions.block = ({ commit, dispatch }, userId) => {
  dispatch("user/block", userId, { root: true }).then(r => {
    if (r.success) {
      commit("extendUser", {
        userId,
        data: {
          isBlocked: true,
          followedOn: false,
          subscribedOn: false
        }
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

actions.mute = ({ commit, dispatch }, user) => {
  dispatch(`user/mute`, user.id, { root: true }).then(r => {
    if (r.success) {
      commit("extendUser", {
        userId: user.id,
        data: {
          isMuted: true
        }
      });
    }
  });
};
actions.unmute = ({ commit, dispatch }, user) => {
  dispatch(`user/unmute`, user.id, { root: true }).then(r => {
    if (r.success) {
      commit("extendUser", {
        userId: user.id,
        data: {
          isMuted: false
        }
      });
    }
  });
};

mutations.extendUser = (state, { userId, data }) => {
  state.posts = state.posts.map(user => {
    if (user.id === userId) {
      user = deepMerge(user, data);
    }
    return user;
  });
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
