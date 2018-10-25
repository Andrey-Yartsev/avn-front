"use strict";

import StoriesApi from "@/api/stories";
import PostMixin from "@/store/mixins/posts";
import router from "@/router";

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
  user: {},
  source: "feed"
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
  },
  setSource(state, { source }) {
    state.source = source;
  },
  deletePost(state, data) {
    state.posts = state.posts.filter(post => data.postId !== post.id);
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker, source } = state;
    commit("postsRequest");

    return StoriesApi.getPosts({ limit, offset, marker, source })
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
  },
  watch(opt, { postId }) {
    return StoriesApi.watchStory({ postId });
  },
  savePost(opt, { data, userId }) {
    return StoriesApi.savePost(data)
      .then(response => {
        if (response.status === 200) {
          const url = `/stories/${userId}`;
          if (router.history.current.fullPath !== url) {
            router.push(url);
          } else {
            window.location.reload();
          }
        }
      })
      .catch(() => {});
  },
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  },
  deletePost({ commit }, { postId }) {
    return StoriesApi.deletePost({ postId })
      .then(response => {
        if (response.status === 200) {
          commit("deletePost", {
            postId
          });
        }
      })
      .catch(() => {});
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
