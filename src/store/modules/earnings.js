"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";
import PostMixin from "@/store/mixins/posts";
import * as deepMerge from "deepmerge";

const limit = 10;

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
    dispatch("earningsRequest", params).then(r => {
      commit("checkResult", r);
    });
  }
};

createRequestAction({
  prefix: "earningsRequest",
  apiPath: "sales/users/",
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
    // options.query.offset = params.offset || 0;
    // options.query.limit = params.limit || 5;
    options.query.marker = params.marker || "";
    options.query.sortBy = params.sortBy || "";
    options.query.sort = params.sort || "";
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});

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
