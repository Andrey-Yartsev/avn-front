"use strict";

import StoriesApi from "@/api/stories";
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
  user: {}
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  userPostsRequestSuccess(state, { list: posts, marker, user }) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
    state.marker = state.marker.length ? state.marker : marker;
    state.user = user;
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return StoriesApi.getPosts({ limit, offset, marker })
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
  },
  getUserPosts({ commit }, { userId }) {
    commit("postsRequest");

    return StoriesApi.getUserStory({ userId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("userPostsRequestSuccess", res);
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
