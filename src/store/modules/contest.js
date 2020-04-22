"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

//contests
//contests/1/nominees
//contests/1/prizes
//contests/1/ranks
//nominees/1/cancel?id=1
//contests/2/categories
//contests/2/categories/1/nominees
//contests/2/categories/1/prizes

import categories from "@/mock/contest/nominees";
import nominees from "@/mock/contest/nominees";
import prizes from "@/mock/contest/nominees";

const state = {
  categories: [],
  nominees: [],
  prizes: []
};

const actions = {
  fetchCategories({ commit }) {
    return new Promise(accept => {
      commit("setMockCategories");
      accept();
    });
  },
  fetchNominees({ commit }) {
    return new Promise(accept => {
      commit("setMockNominees");
      accept();
    });
  },
  fetchPrizes({ commit }) {
    return new Promise(accept => {
      commit("setMockPrizes");
      accept();
    });
  }
};
const mutations = {
  setMockCategories(state) {
    state.categories = categories;
  },
  setMockNominees() {
    state.nominees = nominees;
  },
  setMockPrizes() {
    state.prizes = prizes;
  }
};

createRequestAction({
  prefix: "fetchContests",
  apiPath: "contests/list",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: []
});

createRequestAction({
  prefix: "fetchNominees",
  apiPath: "contests/nominees/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

createRequestAction({
  prefix: "fetchPrizes",
  apiPath: "contests/prizes/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

createRequestAction({
  prefix: "vote",
  apiPath: "contests/vote/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
