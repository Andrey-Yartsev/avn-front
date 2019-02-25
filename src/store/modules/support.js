"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {
  searchText: null
};

const actions = {
  search({ commit }, searchText) {
    commit("setSearchText", searchText);
  }
};

const mutations = {
  setSearchText(state, searchText) {
    state.setSearchText = searchText;
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "supports",
  requestType: "no-token",
  resultKey: "items",
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
  actions,
  mutations
};
