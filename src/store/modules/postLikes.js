"use strict";

import { createRequestAction } from "../utils/storeRequest";

const limit = 20;

const state = {
  likes: [],
  loading: false,
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit
};

const mutations = {
  reset(state) {
    state.likes = [];
    state.loading = false;
    state.marker = null;
    state.offset = 0;
    state.allDataReceived = false;
    state.limit = limit;
  },
  setState(state, { list, marker }) {
    if (list.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    state.marker = marker;
  }
};

const actions = {
  fetchUsers({ dispatch, commit }, params) {
    dispatch("fetch", params).then(r => {
      commit("setState", r);
    });
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "/posts/{postId}/favorites",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  resultKey: "likes",
  defaultResultValue: [],
  paramsToOptions: function(params, options, state) {
    options.query.offset = state.offset || 0;
    options.query.limit = state.limit || limit;
    options.query.marker = state.marker || "";
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{postId}/, params.postId);
  },
  resultConvert: function(result, state) {
    return [...state.likes, ...result.list];
  }
});

// actions.follow = ({ commit, dispatch }, userId) => {
//   dispatch("user/follow", userId, { root: true }).then(() => {
//     commit("extendUser", {
//       userId,
//       data: { followedBy: true }
//     });
//   });
// };

// actions.unfollow = ({ commit, dispatch }, userId) => {
//   dispatch("user/unfollow", userId, { root: true }).then(() => {
//     commit("extendUser", {
//       userId,
//       data: { followedBy: false }
//     });
//   });
// };

// actions.block = ({ commit, dispatch }, userId) => {
//   dispatch("user/block", userId, { root: true }).then(r => {
//     if (r.success) {
//       commit("extendUser", {
//         userId,
//         data: { isBlocked: true }
//       });
//     }
//   });
// };
// actions.unblock = ({ commit, dispatch }, userId) => {
//   dispatch("user/unblock", userId, { root: true }).then(r => {
//     if (r.success) {
//       commit("extendUser", {
//         userId,
//         data: { isBlocked: false }
//       });
//     }
//   });
// };

// mutations.extendUser = (state, { userId, data }) => {
//   state.posts = state.posts.map(user => {
//     if (user.id === userId) {
//       user = { ...user, ...data };
//     }
//     return user;
//   });
// };

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
