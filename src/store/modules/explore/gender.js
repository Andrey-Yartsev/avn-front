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
    BrowserStore.set("genderCategory", category);
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
