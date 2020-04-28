"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  categories: [],
  nominees: [],
  prizes: []
};

const actions = {};
const mutations = {};

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
  },
  paramsToOptions: function(params, options) {
    options.data = {};
    options.data.nominee = params.nominee;
    options.data.userId = params.userId;
    options.data.paymentType = "vote";
    options.data.votes = params.votes;
    if (window.okev) {
      options.data.sentry = JSON.stringify(window.okev.all());
    }
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
