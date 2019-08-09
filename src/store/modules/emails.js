import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {};

const mutations = {};

createRequestAction({
  prefix: "resend",
  apiPath: `emails/resend`,
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      email: params
    };
    return options;
  },
  localError: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
