import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  unblock({ dispatch }, userId) {
    return dispatch("home/unspamPost", userId, { root: true });
  }
};

const mutations = {};

createRequestAction({
  prefix: "fetchBlocked",
  apiPath: `users/blocked`, // need to change when EP ready
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "blocked",
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
