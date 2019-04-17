"use strict";

import { createRequestAction } from "../../utils/storeRequest";
import PostMixin from "@/store/mixins/posts";

const limit = 9;

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
  extendUser(state, { userId, data }) {
    state.posts = state.posts.map(user => {
      if (user.id === userId) {
        user = { ...user, ...data };
      }
      return user;
    });
  },
  checkResult(state, { list: posts, marker }) {
    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    state.marker = marker;
    state.loading = false;
  }
};

const actions = {
  getPosts({ dispatch, commit, state }) {
    const { limit, offset, marker } = state;
    commit("postsRequest");
    dispatch("topModelsRequest", { limit, offset, marker }).then(r => {
      commit("checkResult", r);
    });
  },
  follow({ commit, dispatch }, userId) {
    dispatch("user/follow", userId, { root: true }).then(() => {
      commit("extendUser", {
        userId,
        data: { followedBy: true }
      });
    });
  },
  unfollow({ commit, dispatch }, userId) {
    dispatch("user/unfollow", userId, { root: true }).then(() => {
      commit("extendUser", {
        userId,
        data: { followedBy: false }
      });
    });
  },
  block({ commit, dispatch }, userId) {
    dispatch("user/block", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendUser", {
          userId,
          data: { isBlocked: true }
        });
      }
    });
  },
  unblock({ commit, dispatch }, userId) {
    dispatch("user/unblock", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendUser", {
          userId,
          data: { isBlocked: false }
        });
      }
    });
  }
};

createRequestAction({
  prefix: "topModelsRequest",
  apiPath: "users/performers/top",
  requestType: "any",
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
    options.query = options.query || {};
    options.query.offset = params.offset || 0;
    options.query.limit = params.limit || 5;
    options.query.marker = params.marker || "";
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
