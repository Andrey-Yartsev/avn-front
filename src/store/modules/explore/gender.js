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
  setGuestCategory({ commit }, genderCategory) {
    commit("setCategory", genderCategory);
    BrowserStore.set("genderCategory", genderCategory);
  },
  suggestGayContext({ dispatch }) {
    if (window.location.hostname.match(/gayvn/)) {
      return;
    }
    const doNotSuggestGeyContext = BrowserStore.get("doNotSuggestGeyContext");
    if (doNotSuggestGeyContext) {
      return;
    }
    dispatch(
      "modal/show",
      {
        name: "gayContextConfirm"
      },
      { root: true }
    );
  },
  doNotSuggest() {
    BrowserStore.set("doNotSuggestGeyContext", true);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
