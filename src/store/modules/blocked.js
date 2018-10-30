import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  unblock({ dispatch, commit }, userId) {
    dispatch("user/unblock", userId, { root: true }).then(() => {
      commit("remove", userId);
    });
  }
};

const mutations = {
  remove(state, id) {
    state.users = state.users.filter(v => v.id !== id);
  }
};

createRequestAction({
  prefix: "fetchUsers",
  apiPath: `users/blocked`,
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "users",
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
