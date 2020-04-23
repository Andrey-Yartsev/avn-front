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
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
