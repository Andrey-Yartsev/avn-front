const state = {
  currentVersion: null,
  newVersion: null
};
const mutations = {
  setNewVersion(state, newVersion) {
    if (state.currentVersion == null) {
      state.currentVersion = newVersion;
      state.newVersion = newVersion;
    } else {
      state.newVersion = newVersion;
    }
  },
  versionUpdated(state) {
    state.currentVersion = state.newVersion;
    state.newVersion = null;
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
