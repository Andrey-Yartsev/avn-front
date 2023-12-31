"use strict";

import { createRequestAction } from "../utils/storeRequest";
import PostMixin from "@/store/mixins/posts";
import postModal from "./notif/postModal";

const limit = 20;

const state = {
  type: "",
  loading: false,
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit,
  posts: [],
  unreadCount: 0
};

const mutations = {
  reset(state) {
    state.type = "";
    state.posts = [];
    state.loading = false;
    state.marker = null;
    state.offset = 0;
    state.allDataReceived = false;
    state.limit = limit;
    state.unreadCount = 0;
  },
  checkResult(state, items) {
    if (items.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    // state.marker = marker;
  },
  setUnreadCount(state, count) {
    state.unreadCount = count;
  }
};

const actions = {
  getPosts({ dispatch, commit, state }, params) {
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = state.limit;
    dispatch("fetch", params).then(r => {
      commit("checkResult", r);
      if (!r.unreadCount) {
        dispatch(
          "auth/extendUser",
          { hasNotifications: false },
          { root: true }
        );
      }
      commit("setUnreadCount", r.unreadCount);
    });
  },
  markAllAsRead({ dispatch, commit }) {
    dispatch("_markAllAsRead").then(() => {
      commit("setUnreadCount", 0);
      dispatch("auth/extendUser", { hasNotifications: false }, { root: true });
    });
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/notifications",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "posts",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query = {
      type: params.type,
      query: params.query,
      offset: params.offset || 0,
      limit: params.limit || 5,
      marker: params.marker || ""
    };
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.posts, ...result.list];
  }
});
createRequestAction({
  prefix: "_markAllAsRead",
  apiPath: "users/notifications-read",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations },
  modules: {
    postModal
  }
};
