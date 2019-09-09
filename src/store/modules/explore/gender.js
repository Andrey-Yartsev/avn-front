"use strict";

import BrowserStore from "store";

let genderCategory = parseInt(BrowserStore.get("genderCategory"));

if (!genderCategory) {
  genderCategory = 1;
}

const state = {
  category: genderCategory
};

const mutations = {
  setCategory(state, category) {
    state.category = category;
  }
};

const actions = {
  initGuestCategory({ commit }) {
    commit("setCategory", genderCategory);
  },
  setGuestCategory({ commit }) {
    commit("setCategory", genderCategory);
    BrowserStore.set("genderCategory", genderCategory);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
