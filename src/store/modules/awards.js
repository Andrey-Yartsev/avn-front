"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};

const mutations = {
  reset(state) {
    state.searchResult = [];
  },
  saveData(state, payload) {
    state.savedData = payload;
  },
  clearSavedData() {
    state.savedData = null;
  }
};

createRequestAction({
  prefix: "fetchCategories",
  requestType: "any",
  apiPath: "ballot/categories/{eventId}",
  state,
  mutations,
  actions,
  resultKey: "categories",
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{eventId}/, params);
  }
});

createRequestAction({
  prefix: "nominate",
  apiPath: "ballot/nominate/{eventId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{eventId}/, params.eventId);
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  }
});

createRequestAction({
  prefix: "search",
  apiPath: "search/users",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    if (!params.offset) {
      params.offset = 0;
    }
    if (!params.limit) {
      params.limit = 5;
    }
    options.query = params;
    return options;
  },
  resultConvert: function(res) {
    return res.list || [];
  }
});

createRequestAction({
  prefix: "fetchUser",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  },
  localError: true,
  requestType: "no-token"
});

createRequestAction({
  prefix: "fetchNominees",
  apiPath: "ballot/nominees/{eventId}/{categoryId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

createRequestAction({
  prefix: "vote",
  apiPath: "ballot/vote/{eventId}/{categoryId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = { nominee: params.id };
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

createRequestAction({
  prefix: "unvote",
  apiPath: "ballot/vote/{eventId}/{categoryId}/{nomineeId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    r = r.replace(/{nomineeId}/, params.id);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
