"use strict";

import PostMixin from "@/store/mixins/posts";
import ViewersApi from "@/api/viewers";
import { createRequestAction } from "@/store/utils/storeRequest";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  source: ""
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  setSource(state, { source }) {
    state.source = source;
  },
  userBlockSuccess(state, { userId }) {
    state.posts = state.posts.map(viewer => {
      if (viewer.id === userId) {
        return { ...viewer, isBlockedStory: true };
      }

      return viewer;
    });
  },
  userUnblockSuccess(state, { userId }) {
    state.posts = state.posts.map(viewer => {
      if (viewer.id === userId) {
        return { ...viewer, isBlockedStory: false };
      }

      return viewer;
    });
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker, source } = state;
    commit("postsRequest");

    return ViewersApi.getPosts({ limit, offset, marker, source })
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
  blockUser({ commit }, { storyId, userId }) {
    return ViewersApi.blockUser({ userId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function() {
            commit("userBlockSuccess", { storyId, userId });
          });
        }
      })
      .catch(err => {
        commit("userBlockFail", err);
      });
  },
  unblockUser({ commit }, { storyId, userId }) {
    return ViewersApi.unblockUser({ userId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function() {
            commit("userUnblockSuccess", { storyId, userId });
          });
        }
      })
      .catch(err => {
        commit("userUnblockFail", err);
      });
  },
  unblock({ a }, userId) {
    a;
    return ViewersApi.unblockUser({ userId });
  }
};

createRequestAction({
  prefix: "fetchBlocked",
  apiPath: `stories/blocked`,
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "blocked",
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
