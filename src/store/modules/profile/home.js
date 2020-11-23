"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

import UserApi from "@/api/user";
import PostMixin from "@/store/mixins/posts";

const initState = {
  loading: false,
  error: null,
  profile: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  source: "",
  deletedPost: undefined,
  postPinChanged: 0,
  postPinCount: 0,
  onPageAction: null,
  onLoginAction: null,
  beforeLoginProfileUsername: null,
  onTipRouteAction: null,
  stashed: false
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  resetPosts(state) {
    // state.source = "";
    state.loading = false;
    state.posts = [];
    state.offset = 0;
    state.marker = "";
    state.allDataReceived = false;
  },
  setSource(state, source) {
    state.source = source;
  },
  setLive(state, { id, currentStream }) {
    if (state.profile && state.profile.id === id) {
      state.profile.currentStream = currentStream;
    }
  },
  setPostPinCount(state, n) {
    state.postPinCount = n;
  },
  postPinChanged(state, n) {
    state.postPinChanged++;
    state.postPinCount += n;
  },
  setOnPageAction(state, action) {
    state.onPageAction = action;
  },
  resetOnPageAction(state) {
    state.onPageAction = null;
  },
  setOnLoginAction(state, action) {
    state.onLoginAction = action;
  },
  resetOnLoginAction(state) {
    state.onLoginAction = null;
  },
  addPost(state, payload) {
    state.posts.push(payload);
  },
  setOnTipRouteAction(state, data) {
    state.onTipRouteAction = { ...data };
  },
  resetOnTipRouteAction(state) {
    state.onTipRouteAction = null;
  },
  switchStashedPostView(state, { reset }) {
    state.stashed = reset ? false : !state.stashed;
  }
};

const actions = {
  getPosts({ commit, state }) {
    const userId = state.profile.id;
    const { limit, offset, marker, source, stashed } = state;
    commit("postsRequest");

    return UserApi.getPosts({ userId, limit, offset, marker, source, stashed })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("setPostPinCount", res.list.filter(v => v.isPinned).length);
            commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  updatePost({ commit }, updatedPost) {
    commit("updatePost", updatedPost);
  },
  addPost({ commit }, newPost) {
    commit("addPost", newPost);
  },
  setSource({ commit }, source) {
    commit("setSource", source);
  },
  follow({ dispatch, commit }, userId) {
    dispatch("_follow", userId).then(() => {
      commit(
        "auth/addItemToUserConnectedData",
        { key: "follow", id: userId },
        { root: true }
      );
      dispatch("extend", { followedBy: true });
    });
  },
  unfollow({ dispatch, commit }, userId) {
    dispatch("_unfollow", userId).then(() => {
      commit(
        "auth/removeItemFromUserConnectedData",
        { key: "follow", id: userId },
        { root: true }
      );
      dispatch("extend", { followedBy: false });
    });
  },
  mute({ dispatch }, user) {
    dispatch(`user/mute`, user.id, { root: true }).then(r => {
      if (r.success) {
        dispatch("extend", {
          id: user.id,
          isMuted: true
        });
      }
    });
  },
  unmute({ dispatch }, user) {
    dispatch(`user/unmute`, user.id, { root: true }).then(r => {
      if (r.success) {
        dispatch("extend", {
          id: user.id,
          isMuted: false
        });
      }
    });
  },
  extend({ commit, state }, data) {
    if (data.followedBy !== undefined) {
      if (data.followedBy === false) {
        if (!data.isSubscribed) {
          data.canWrite = false;
        }
      } else {
        data.canWrite = true;
      }
    }
    commit("profile", { ...state.profile, ...data });
  },
  reload({ dispatch, state }) {
    dispatch("fetchProfile", state.profile.username).then(() => {
      // dispatch("profile/setFetchLoading", false, { root: true });
    });
  },
  block({ commit, dispatch }, userId) {
    dispatch("user/block", userId, { root: true }).then(r => {
      if (r.success) {
        commit("profile", {
          ...state.profile,
          isBlocked: true,
          followedOn: false,
          subscribedOn: false
        });
      }
    });
  },
  unblock({ commit, dispatch }, userId) {
    dispatch("user/unblock", userId, { root: true }).then(r => {
      if (r.success) {
        commit("profile", { ...state.profile, isBlocked: false });
      }
    });
  },
  paidBlock({ commit, dispatch }, { userId, price }) {
    dispatch("user/paidBlock", { userId, price }, { root: true }).then(r => {
      if (r.success) {
        dispatch(
          "global/flashToast",
          {
            text: "User blocked"
          },
          { root: true }
        );
        commit("profile", {
          ...state.profile,
          isPaidBlocked: true
        });
      }
    });
  },
  paidUnblock({ commit, dispatch }, userId) {
    dispatch("user/paidUnblock", userId, { root: true }).then(r => {
      if (r.success) {
        dispatch(
          "global/flashToast",
          {
            text: "User unblocked"
          },
          { root: true }
        );
        commit("profile", { ...state.profile, isPaidBlocked: false });
      }
    });
  },
  pin({ commit, dispatch }, postId) {
    if (window.location.hash) {
      window.location.hash = "";
    }
    dispatch("_pin", postId).then(() => {
      commit("postPinChanged", 1);
    });
  },
  unpin({ commit, dispatch }, postId) {
    dispatch("_unpin", postId).then(() => {
      commit("postPinChanged", -1);
    });
  },
  repost({ dispatch }, data) {
    return dispatch("_repost", data)
      .then(() => {
        dispatch(
          "global/flashToast",
          { text: "Reposted successfully" },
          {
            root: true
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
};

createRequestAction({
  requestType: "any",
  prefix: "fetchProfile",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  resultKey: "profile",
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  },
  localError: true
});

createRequestAction({
  prefix: "_pin",
  apiPath: "posts/{id}/pin",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  }
});

createRequestAction({
  prefix: "_unpin",
  apiPath: "posts/{id}/pin",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  }
});

createRequestAction({
  prefix: "_follow",
  apiPath: "subscriptions/follow",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      userId: params
    };
    return options;
  }
});

createRequestAction({
  prefix: "_unfollow",
  apiPath: "subscriptions/unfollow",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      userId: params
    };
    return options;
  }
});

createRequestAction({
  prefix: "_repost",
  apiPath: "posts/{id}/repost",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.postId);
  },
  paramsToOptions: function(params, options) {
    options.data = {
      text: params.text
    };
    return options;
  }
});

createRequestAction({
  prefix: "getUnlockExpiredContentLink",
  apiPath: "posts/accessLink",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "unlockExpiredContent",
  apiPath: "posts/accessLink",
  state,
  mutations,
  actions,
  throw400: true,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
