"use strict";

// import BrowserStore from "store";
import HomeApi from "@/api/home";

const state = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0
};

const mutations = {
  ["postsRequestSuccess"](state, posts) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
  },

  ["postsRequestFail"](state, err) {
    state.error = err;
    state.loading = false;
  },

  ["postsRequest"](state) {
    state.loading = true;
  },

  ["postCommentsRequest"](state, { postId }) {
    state.posts = state.posts.map(post => {
      if (postId === post.id) {
        return {
          ...post,
          comments: post.comments || [],
          commentsLoading: true
        };
      }

      return post;
    });
  },

  ["postCommentsRequestSuccess"](state, data) {
    state.posts = state.posts.map(post => {
      if (data.postId !== post.id) {
        return post;
      }

      return {
        ...post,
        comments: [...post.comments, ...data.list],
        commentsLoading: false
      };
    });
  },

  ["commentsRequestFail"](/* state, err */) {
    // TODO;
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset } = state;
    commit("postsRequest");

    return HomeApi.getPosts({ limit, offset })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res.list);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  getPostComments({ commit }, { postId }) {
    commit("postCommentsRequest", { postId });
    return HomeApi.getPostComments({ postId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(list) {
            commit("postCommentsRequestSuccess", {
              postId,
              list
            });
          });
        }
      })
      .catch(err => {
        commit("commentsRequestFail", err);
      });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
