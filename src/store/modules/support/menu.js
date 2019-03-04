"use strict";

const state = {
  level1Opened: false,
  level2Opened: false,
  level3Opened: false
};

const mutations = {
  setOpened(state, { level, opened }) {
    if ([1, 2, 3].indexOf(level) === -1) {
      throw new Error("Level is not supported");
    }
    const k = "level" + level + "Opened";
    state[k] = opened;
  }
};

const actions = {
  back({ commit, state }) {
    if (state.level3Opened) {
      commit("setOpened", {
        level: 3,
        opened: false
      });
      return;
    }
    if (state.level2Opened) {
      commit("setOpened", {
        level: 2,
        opened: false
      });
      return;
    }
    if (state.level1Opened) {
      commit("setOpened", {
        level: 1,
        opened: false
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
