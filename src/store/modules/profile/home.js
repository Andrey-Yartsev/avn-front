"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

import UserApi from "@/api/user";
import SubscriptionsApi from "@/api/subscriptions";
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
  source: ""
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },

  setSource(state, source) {
    state.source = source;
  }
};

const actions = {
  getPosts({ commit }, userId) {
    const { limit, offset, marker, source } = state;
    commit("postsRequest");

    return UserApi.getPosts({ userId, limit, offset, marker, source })
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

  setSource({ commit }, source) {
    commit("setSource", source);
  },

  follow({ dispatch }, userId) {
    return new Promise((accept, reject) => {
      SubscriptionsApi.follow(userId).then(async response => {
        if (response.status === 200) {
          response = await response.json();
          dispatch("extend", { followedBy: true });
          accept(response);
          return;
        }
        reject(await response.json());
      });
    });
  },

  unfollow({ dispatch }, userId) {
    return new Promise((accept, reject) => {
      SubscriptionsApi.unfollow(userId).then(async response => {
        if (response.status === 200) {
          response = await response.json();
          dispatch("extend", { followedBy: false });
          accept(response);
          return;
        }
        reject(await response.json());
      });
    });
  },

  extend({ commit, state }, data) {
    commit("fetchProfileSuccess", { ...state.profile, ...data });
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
  }
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
