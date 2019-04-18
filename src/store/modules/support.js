"use strict";

import { createRequestAction } from "../utils/storeRequest";
import accordion from "./support/accordion";

const state = {
  searchText: null,
  ratedIds: []
};

const actions = {
  search({ commit }, searchText) {
    commit("setSearchText", searchText);
  },
  rate({ dispatch, commit }, data) {
    dispatch("_rate", data).then(() => {
      commit("addRatedId", data.articleId);
    });
  }
};

const mutations = {
  setSearchText(state, searchText) {
    state.setSearchText = searchText;
  },
  addRatedId(state, id) {
    state.ratedIds.push(id);
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

createRequestAction({
  prefix: "_rate",
  apiPath: "supports/articles/{articleId}/rating",
  requestType: "token",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{articleId}/, params.articleId);
  },
  paramsToOptions: function(params, options) {
    options.data = {
      rating: params.like ? 5 : 1
    };
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    accordion
  }
};
