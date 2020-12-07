"use strict";

import BrowserStore from "store";
import playSound from "@/utils/playSound";

const notificationNames = ["newLook"];

const state = {};

notificationNames.forEach(name => {
  state[name] = false;
});

const actions = {
  switch({ commit, state }, name) {
    commit("setEnabled", { name, isEnabled: !state[name] });
  },
  init({ commit }) {
    notificationNames.forEach(name => {
      const isEnabled = !!BrowserStore.get("livesNotification" + name);
      commit("setEnabled", { name, isEnabled });
    });
  },
  play({ state }, name) {
    if (!state[name]) {
      return;
    }
    playSound(name);
  }
};

const mutations = {
  setEnabled(state, { name, isEnabled }) {
    state[name] = isEnabled;
    BrowserStore.set("livesNotification" + name, isEnabled);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
