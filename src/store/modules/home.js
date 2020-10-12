"use strict";

import PostMixin from "@/store/mixins/posts";
import { createRequestAction } from "@/store/utils/storeRequest";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  source: "feed",
  deletedPost: undefined,
  newFeedPosts: 0
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  newFeedPost(state) {
    state.newFeedPosts += 1;
  },
  filterPosts(state, payload) {
    state.posts = state.posts.filter(post => post.author.id !== payload);
  }
};

const actions = {
  updatePost({ commit }, updatedPost) {
    commit("updatePost", updatedPost);
  },
  spamPost({ commit, dispatch }, authorId) {
    dispatch("_spamPost", authorId)
      .then(() => {
        commit("filterPosts", authorId);
      })
      .catch(err => {
        console.log(err);
      });
  },
  unspamPost({ dispatch }, authorId) {
    dispatch("_unspamPost", authorId);
  }
};

createRequestAction({
  prefix: "_spamPost",
  apiPath: "users/{authorId}/posts/block",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{authorId}/, params);
  },
  localError: true
});

createRequestAction({
  prefix: "_unspamPost",
  apiPath: "users/{authorId}/posts/block",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{authorId}/, params);
  },
  localError: true
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
