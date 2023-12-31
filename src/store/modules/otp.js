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
        dispatch(
          "global/flashToast",
          {
            text: response.error.message,
            type: "error"
          },
          {
            root: true
          }
        );
        return;
      }
      dispatch(
        "global/flashToast",
        { text: "Code saved successfully" },
        {
          root: true
        }
      );
      dispatch("profile/extend", { otpEnable: true }, { root: true });
    });
  },
  login({ dispatch }, code) {
    return new Promise((resolve, reject) => {
      OtpApi.setCode(code).then(async response => {
        response = await response.json();
        if (response.error) {
          dispatch(
            "global/flashToast",
            { text: response.error.message, type: "error" },
            {
              root: true
            }
          );
          reject(response.error);
          return;
        }
        dispatch("profile/fetch", null, { root: true }).then(resolve);
      });
    });
  },
  deleteCode({ dispatch }, code) {
    return new Promise((accept, reject) => {
      OtpApi.deleteCode(code).then(async response => {
        response = await response.json();
        if (response.error) {
          dispatch(
            "global/flashToast",
            {
              text: response.error.message,
              type: "error"
            },
            {
              root: true
            }
          );
          reject();
        }
        dispatch("profile/extend", { otpEnable: false }, { root: true });
        accept();
      });
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
