"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {};

const mutations = {
  updateHeaderStream(state, data) {
    state.data.headerStream = data;
  },
  updateContestsStatus(state, data) {
    state.data.enableContests = data.enableContests;
  },
  updateVotingStatus(state, data) {
    const key = Object.keys(data)[0];
    state.data[key] = data[key];
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "init",
  requestType: "no-token",
  resultKey: "data",
  defaultLoading: true,
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultConvert: function(res) {
    res.categoryUser = res.categoryUser.map(v => {
      if (v.name === "gay") {
        v.name = "Gay Guys";
      }
      return v;
    });
    res.categoryView = res.categoryView.map(v => {
      if (v.name === "gay") {
        v.name = "Gay Guys";
      }
      return v;
    });
    return res;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
