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
  source: "",
  currentLive: {
    likesCount: 0,
    looksCount: 0,
    comments: [],
    statistic: {
      stream_comment_search_all: {
        data: []
      },
      stream_tip_search_all: {
        data: []
      },
      stream_like_search_all: {
        data: []
      },
      stream_look_search_all: {
        data: []
      }
    }
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

  comment(state, comment) {
    state.currentLive.comments = [...state.currentLive.comments, comment];
  },

  statistic(state, data) {
    state.currentLive.statistic[data.code] = data;
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
  },
  setSource(state, { source }) {
    state.source = source;
  },
  setLimit(state, { limit }) {
    state.limit = limit;
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker, source } = state;
    commit("postsRequest");

    return LivesApi.getPosts({ limit, offset, marker, source })
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
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  },
  setLimit({ commit }, { limit }) {
    commit("setLimit", { limit });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
