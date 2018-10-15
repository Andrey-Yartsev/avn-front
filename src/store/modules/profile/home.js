"use strict";

import UserApi from "@/api/user";
import SubscriptionsApi from "@/api/subscriptions";
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
  marker: ""
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },

  fetchProfile(state) {
    state.profileLoading = true;
  },

  fetchProfileSuccess(state, profile) {
    state.profile = profile;
  },

  fetchProfileFail(state, error) {
    state.profileLoading = false;
    state.profileError = error;
  }
};

const actions = {
  fetchProfile({ commit }, username) {
    commit("resetPageState");
    return new Promise((accept, reject) => {
      UserApi.fetchProfile(username).then(async response => {
        if (response.status === 200) {
          response = await response.json();
          commit("fetchProfileSuccess", response);
          accept(response);
          return;
        }
        response = await response.json();
        commit("fetchProfileFail", response);
        reject(response);
      });
    });
  },

  getPosts({ commit }, userId) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return UserApi.getPosts({ userId, limit, offset, marker })
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

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
