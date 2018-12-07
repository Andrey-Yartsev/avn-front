"use strict";

import LivesApi from "@/api/lives";
import PostMixin from "@/store/mixins/posts";

const initState = {
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  profile: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  deletedPost: undefined,
  currentLive: {
    likesCount: 0,
    looksCount: 0
  }
};

const state = { ...initState };

const mutations = {
  addNewOne(state, live) {
    state.posts = [live, ...state.posts];
  },

  addLike(state) {
    state.currentLive.likesCount += 1;
  },

  look(state) {
    state.currentLive.looksCount += 1;
  },

  unlook(state) {
    state.currentLive.looksCount -= 1;
  },

  removeStream(state, live) {
    state.posts = state.posts.filter(post => {
      return post.id !== live.id;
    });
  },

  resetCurrentLive() {
    state.currentLive = {
      ...initState.currentLive
    };
  },

  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

const actions = {
  getPosts({ commit }, userId) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return LivesApi.getPosts({ userId, limit, offset, marker })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
