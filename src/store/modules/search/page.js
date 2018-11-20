"use strict";

import { createRequestAction } from "../../utils/storeRequest";
import PostMixin from "@/store/mixins/posts";

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
  searchSetNextState(state, { list: posts, marker }) {
    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    state.marker = marker;
  }
};

const actions = {
  search({ dispatch, commit }, params) {
    params.limit = limit;
    dispatch("searchRequest", params).then(r => {
      commit("searchSetNextState", r);
    });
  },
  searchNext({ dispatch, commit, state }, params) {
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = limit;
    dispatch("searchRequest", params).then(r => {
      // const ids = state.posts.map(v => v.id);
      // const names = state.posts.map(v => v.name);
      // r.list.map(v => {
      //   if (ids.indexOf(v.id) !== -1) {
      //     console.log("User " + v.name + " id=" + v.id + " in list");
      //     console.log(names);
      //   }
      // });
      // return;
      commit("searchSetNextState", r);
    });
  }
};

createRequestAction({
  prefix: "searchRequest",
  apiPath: "search/{type}",
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
    options.query.limit = params.limit || 5;
    options.query.marker = params.marker || "";
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
  state.posts = state.posts.map(user => {
    if (user.id === userId) {
      user = { ...user, ...data };
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
