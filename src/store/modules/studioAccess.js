"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";
import PostMixin from "@/store/mixins/posts";
import mockData from "@/mock/studioAccess";

const limit = 15;

const state = {
  loading: false,
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit,
  posts: []
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
  getUsers({ dispatch, commit, state }) {
    const params = {
      offset: state.offset,
      marker: state.marker || "",
      limit: limit
    };
    return dispatch("_getUsers", params)
      .then(r => {
        commit("checkResult", r);
      })
      .catch(() => {
        commit("checkResult", mockData);
      });
  },
  login({ dispatch }, userId) {
    return dispatch("_login", userId)
      .then(res => {
        return res;
      })
      .catch(() => {
        console.log("err");
      });
  },
  logout({ dispatch }, userId) {
    return dispatch("_logout", userId)
      .then(res => {
        return res;
      })
      .catch(() => {
        console.log("err");
      });
  }
};

createRequestAction({
  prefix: "_getUsers",
  apiPath: "studioAccess",
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
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});
createRequestAction({
  prefix: "_login",
  apiPath: "studioAccess/login/{userId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  defaultResultValue: [],
  paramsToPath: function(userId, path) {
    return path.replace(/{userId}/, userId);
  }
});

createRequestAction({
  prefix: "_logout",
  apiPath: "studioAccess/logout/{userId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  defaultResultValue: [],
  paramsToPath: function(userId, path) {
    return path.replace(/{userId}/, userId);
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
