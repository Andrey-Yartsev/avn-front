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
    // .filter(post => {
    //   return (
    //     post.media.length > 1
    //     // && post.media[0].type === "gif"
    //     // post.media[0].canView === true
    //   );
    // });
    state.loading = false;
  },

  ["postsRequestFail"](state, err) {
    state.error = err;
    state.loading = false;
  },

  ["postsRequest"](state) {
    state.loading = true;
  },

  ["postCommentsRequest"](data) {
    state.posts = state.posts.map(post => {
      if (data.postId === post.id) {
        post.comments = post.comments || { loading: true, list: [] };
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
        comments: {
          ...post.comments,
          list: [...post.comments.list, data],
          loading: false
        }
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
  getPostComments({ commit }, data) {
    commit("postCommentsRequest", data);
    return HomeApi.getPostComments(data)
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postCommentsRequestSuccess", {
              postId: data.postId,
              data: res.list
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
