"use strict";

import { createRequestAction } from "../utils/storeRequest";
import menu from "./support/menu";

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
  defaultLoading: true,
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "fetchTrending",
  apiPath: "supports/articles/trending",
  requestType: "no-token",
  resultKey: "common",
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
  mutations,
  modules: {
    menu
  }
};
