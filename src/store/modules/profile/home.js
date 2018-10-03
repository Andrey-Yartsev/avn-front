"use strict";

import UserApi from "@/api/user";
import SubscriptionsApi from "@/api/subscriptions";

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
  // resetPageState(state) {
  //   state = { ...initState };
  // },

  fetchProfile(state) {
    state.profileLoading = true;
  },

  fetchProfileSuccess(state, profile) {
    state.profile = profile;
  },

  fetchProfileFail(state, error) {
    state.profileLoading = false;
    state.profileError = error;
  },

  // follow() {},

  postsRequestSuccess(state, { list: posts, marker }) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
    state.marker = state.marker.length ? state.marker : marker;
  },

  postsRequestFail(state, err) {
    state.error = err;
    state.loading = false;
  },

  postsRequest(state) {
    state.loading = true;
  }
};

const actions = {
  resetPage({ commit }) {
    commit("resetPageState");
  },

  fetchProfile({ commit }, username) {
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

  getPosts({ commit }) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return UserApi.getPosts({ limit, offset, marker })
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
  actions,
  mutations
};
