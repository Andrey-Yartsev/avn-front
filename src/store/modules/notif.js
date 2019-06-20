"use strict";

import { createRequestAction } from "../utils/storeRequest";
import PostMixin from "@/store/mixins/posts";

const state = {
  type: "",
  loading: false,
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit: 20,
  posts: []
};

const mutations = {
  reset(state) {
    state.type = "";
    state.posts = [];
    state.loading = false;
    state.marker = null;
    state.offset = 0;
    state.allDataReceived = false;
    state.limit = 20;
  },
  checkResult(state, items) {
    if (items.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    // state.marker = marker;
  }
};

const actions = {
  getPosts({ dispatch, commit, state }, params) {
    params.type = params.type;
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = state.limit;
    dispatch("fetch", params).then(r => {
      commit("checkResult", r);
    });
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/notifications",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "posts",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query = {
      type: params.type,
      query: params.query,
      offset: params.offset || 0,
      limit: params.limit || 5,
      marker: params.marker || ""
    };
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result];
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
