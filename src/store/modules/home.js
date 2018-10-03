"use strict";

import HomeApi from "@/api/home";
import PostComments from "../mixins/postComments";

const state = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  postReportReasons: []
};

const mutations = {
  ["resetPageState"]() {
    state.loading = false;
    state.error = null;
    state.posts = [];
    state.allDataReceived = false;
    state.limit = 10;
    state.offset = 0;
    state.marker = "";
    state.postReportReasons = [];
  },

  ["postsRequestSuccess"](state, { list: posts, marker }) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
    state.marker = state.marker.length ? state.marker : marker;
  },

  ["postsRequestFail"](state, err) {
    state.error = err;
    state.loading = false;
  },

  ["postsRequest"](state) {
    state.loading = true;
  },

  ["postLikeSuccess"](state, { postId, isFavorite, favoritesCount }) {
    state.posts = state.posts.map(post => {
      if (postId === post.id) {
        return {
          ...post,
          isFavorite,
          favoritesCount
        };
      }

      return post;
    });
  },

  ["deletePost"](state, data) {
    state.posts = state.posts.filter(post => data.postId !== post.id);
  },

  ["getPostReportReasonsSuccess"](state, data) {
    state.postReportReasons = data;
  },

  ["commentsRequestFail"](/* state, err */) {
    // TODO;
  }
};

const actions = {
  resetPage({ commit }) {
    commit("resetPageState");
  },

  getPosts({ commit }) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return HomeApi.getPosts({ limit, offset, marker })
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

  likePost({ commit }, { postId, addLike }) {
    return HomeApi.likePost({ postId, addLike })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function({ isFavorite, favoritesCount }) {
            commit("postLikeSuccess", {
              postId,
              isFavorite,
              favoritesCount
            });
          });
        }
      })
      .catch(() => {});
  },

  sendPostComment({ commit }, { postId, text }) {
    return HomeApi.sendPostComment({ postId, text })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(comment) {
            commit("postSendCommentsRequestSuccess", {
              postId,
              comment
            });
          });
        }
      })
      .catch(err => {
        commit("sendPostCommentFail", err);
      });
  },

  deletePost({ commit }, { postId }) {
    return HomeApi.deletePost({ postId })
      .then(response => {
        if (response.status === 200) {
          commit("deletePost", {
            postId
          });
        }
      })
      .catch(() => {});
  },

  getPostReportReasons({ commit }, { type }) {
    return HomeApi.getPostReportReasons({ type })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("getPostReportReasonsSuccess", res);
          });
        }
      })
      .catch(() => {});
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...actions, ...PostComments.actions },
  mutations: { ...mutations, ...PostComments.mutations }
};
