"use strict";

import PostMixin from "@/store/mixins/posts";

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
  newFeedPosts: 0,
  tag: ""
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
  setTag(state, tagName) {
    state.tag = tagName;
  }
};

const actions = {
  updatePost({ commit }, updatedPost) {
    commit("updatePost", updatedPost);
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
