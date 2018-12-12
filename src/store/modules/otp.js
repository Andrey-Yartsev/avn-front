import OtpApi from "@/api/otp";

const state = {
  initCodesError: null,
  qrUrl: "",
  code: "",
  currentCode: ""
};

const actions = {
  fetchInitCodes({ commit }) {
    OtpApi.fetchInitCodes().then(async response => {
      response = await response.json();
      if (response.error) {
        commit("setInitCodesError", response.error.message);
        return;
      }
      commit("setInitCodes", response);
    });
  },
  updateProfile({ dispatch }, code) {
    OtpApi.setCode(code).then(async response => {
      response = await response.json();
      if (response.error) {
        dispatch("global/flashToast", response.error.message, {
          root: true
        });
        return;
      }
      dispatch("global/flashToast", "Code saved successfully", {
        root: true
      });
      dispatch("profile/extend", { otpEnable: true }, { root: true });
    });
  },
  login({ dispatch }, code) {
    return new Promise((resolve, reject) => {
      OtpApi.setCode(code).then(async response => {
        response = await response.json();
        if (response.error) {
          dispatch("global/flashToast", response.error.message, {
            root: true
          });
          reject(response.error);
          return;
        }
        dispatch("profile/fetch", null, { root: true }).then(resolve);
      });
    });
  },
  deleteCode({ dispatch }, code) {
    OtpApi.deleteCode(code).then(async response => {
      response = await response.json();
      if (response.error) {
        return;
      }
      dispatch("profile/extend", { otpEnable: false }, { root: true });
    });
  }
};

const mutations = {
  setInitCodes(state, data) {
    state.qrUrl = data.qrUrl;
    state.code = data.code;
  },
  setInitCodesError(state, error) {
    state.initCodesError = error;
  },
  setCurrentCode(state, currentCode) {
    state.currentCode = currentCode;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
