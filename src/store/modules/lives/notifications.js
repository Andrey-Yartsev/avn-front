"use strict";
/* eslint-disable */

// import playSound from "@/utils/playSound";
import notifications from "@/components/pages/stream/utils/notifications";
// import soundsPreloader from "@/utils/soundsPreloader";

const notificationNames = notifications.map(v => v.name);

const state = {};

notificationNames.forEach(name => {
  state[name] = true;
});

let saveTimeoutId = 0;

const audios = {};
const sounds = notificationNames.map(name => {
  return {
    name,
    path: `/static/sound/${name}.wav`
  };
});

const preloadSounds = () => {
  sounds.forEach(({ path, name }) => {
    audios[name] = new Audio(path);
    audios[name].play().catch(e => {});
    audios[name].pause();
    audios[name].currentTime = 0;
  });
  removeListeners();
};

const removeListeners = () => {
  document.body.removeEventListener("touchstart", preloadSounds, false);
  document.body.removeEventListener("click", preloadSounds, false);
};

const playSound = name => {
  audios[name].play();
};

const actions = {
  switch({ commit, state, dispatch }, name) {
    commit("setEnabled", { name, isEnabled: !state[name] });
    dispatch("save");
  },
  init({ commit, rootState }) {
    if (!rootState.auth.user) {
      return;
    }
    notificationNames.forEach(name => {
      const streamSounds = rootState.auth.user.streamSounds || {};
      const isEnabled = !!streamSounds[name];
      commit("setEnabled", { name, isEnabled });
    });
    document.body.addEventListener("touchstart", preloadSounds, false);
    document.body.addEventListener("click", preloadSounds, false);
  },
  play({ state, rootState }, name) {
    if (!rootState.auth.user) {
      alert("Can't play by non authorized user");
      return;
    }
    if (!state[name]) {
      return;
    }
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
    clearTimeout(saveTimeoutId);
    saveTimeoutId = setTimeout(() => {
      dispatch("save");
    }, 100);
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
