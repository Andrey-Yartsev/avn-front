"use strict";

import CommonApi from "@/api/common";

const state = {
  pages: [],
  storyList: []
};

const mutations = {
  pagesRequestSuccess(state, pages) {
    state.pages = pages;
  },
  setStoryList(state, { storyList }) {
    state.storyList = storyList;
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
  },
  setStoryList({ commit }, { storyList }) {
    commit("setStoryList", { storyList });
  },

  resetStoryList({ commit }) {
    commit("setStoryList", { storyList: [] });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
