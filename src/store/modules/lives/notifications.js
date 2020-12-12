"use strict";

import playSound from "@/utils/playSound";
import notifications from "@/components/pages/stream/notifications";

const notificationNames = notifications.map(v => v.name);

const state = {};

notificationNames.forEach(name => {
  state[name] = true;
});

const actions = {
  switch({ commit, state, dispatch }, name) {
    commit("setEnabled", { name, isEnabled: !state[name] });
    dispatch("save");
  },
  init({ commit, rootState }) {
    notificationNames.forEach(name => {
      const streamSounds = rootState.auth.user.streamSounds || {};
      const isEnabled = !!streamSounds[name];
      commit("setEnabled", { name, isEnabled });
    });
  },
  play({ state }, name) {
    if (!state[name]) {
      return;
    }
    console.log("play ", name);
    playSound(name);
  },
  save({ dispatch }) {
    const streamSounds = {};
    notificationNames.forEach(name => {
      streamSounds[name] = state[name];
    });
    dispatch("user/extend", { streamSounds }, { root: true });
  },
  setEnabled({ dispatch, commit }, props) {
    commit("setEnabled", props);
    dispatch("save");
  }
};

const mutations = {
  setEnabled(state, { name, isEnabled }) {
    state[name] = isEnabled;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
