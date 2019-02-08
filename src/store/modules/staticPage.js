"use strict";

import StaticApi from "@/api/static";

const initState = {
  content: {}
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  setContent(state, content) {
    state.content = content;
  }
};

const actions = {
  getContent({ commit }, source) {
    return StaticApi.getContent({ source })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("setContent", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
