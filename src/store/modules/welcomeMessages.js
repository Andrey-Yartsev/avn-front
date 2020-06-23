import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};

const actions = {};

const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/welcomeMessages",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "save",
  apiPath: "users/welcomeMessages",
  state,
  mutations,
  actions,
  throw400: true,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
