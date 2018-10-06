import { createRequestAction } from "../utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetchChats",
  apiPath: "chats",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      withoutHistory: true
    }
  },
  resultKey: "chats"
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
