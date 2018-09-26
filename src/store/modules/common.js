"use strict";

import CommonApi from "@/api/common";

const state = {
  pages: []
};

const mutations = {
  ["pagesRequestSuccess"](state, pages) {
    state.pages = pages;
  }
};

const actions = {
  getPages({ commit }) {
    return (
      CommonApi.getPages()
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(res) {
              commit("pagesRequestSuccess", res);
            });
          }
        })
        // TODO
        .catch(() => {})
    );
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
