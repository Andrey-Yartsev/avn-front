import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {};

const mutations = {};

createRequestAction({
  prefix: "block",
  apiPath: "users/{userId}/block",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  resultKey: "block",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "unblock",
  apiPath: "users/{userId}/block",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  resultKey: "unblock",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "report",
  apiPath: "users/{userId}/report",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      reasonId: params.reasonId
    };
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.userId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
