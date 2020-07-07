"use strict";

import BrowserStore from "store";
import UserApi from "@/api/user";
import Router from "@/router";
import Google from "@/utils/google";

const state = {
  loading: false,
  loginInProgress: false,
  error: null,
  showCaptcha: false,
  token: "",
  user: null,
  otpAuth: false
};

const defaultUser = {
  userSettings: {
    nightMode: false
  }
};

const loginAction = (commit, dispatch, rootState, data, fromModal) => {
  commit("request");
  UserApi.login(data)
    .then(user => {
      dispatch("setToken", user.accessToken);
      if (user.isOtpNeeded) {
        dispatch("setOtpAuth", true);
        commit("loginFinished");
        if (Router.currentRoute.path !== "/login") {
          Router.push("/login");
        }
        return;
      }

      dispatch("profile/fetch", null, { root: true }).then(() => {
        commit("showCaptcha", false);
        commit("requestSuccess");

        if (fromModal) {
          commit("modal/hideSafe", { name: "login" }, { root: true });
          commit("loginFinished");
        } else {
          Router.push("/explore", () => {
            commit("loginFinished");
          });
        }
        dispatch("profile/afterLogin", null, { root: true });
        // if (rootState.awards.savedData) {
        //   dispatch("awards/nominate", rootState.awards.savedData, {
        //     root: true
        //   }).then(() => {
        //     commit("awards/clearSavedData", null, { root: true });
        //   });
        // }
      });
    })
    .catch(error => {
      if (error.code === 101) {
        commit("showCaptcha", true);
        commit("loginFinished");
      } else {
        commit("requestFailure", error.message);
        commit("loginFinished");
      }
    });
};

const actions = {
  setToken({ commit }, token) {
    BrowserStore.set("token", token);
    commit("setToken", token);
  },

  resetUser({ commit }) {
    commit("resetUser");
  },

  setUser({ commit }, user) {
    commit("setUser", user);
    commit("gender/setCategory", user.categoryView, { root: true });
  },

  extendUser({ state, dispatch }, user) {
    dispatch("setUser", { ...state.user, ...user });
  },

  login({ commit, dispatch, rootState }, data) {
    loginAction(commit, dispatch, rootState, data, false);
  },

  loginFromModal({ commit, dispatch, rootState }, data) {
    loginAction(commit, dispatch, rootState, data, true);
  },

  logout({ commit, dispatch }) {
    return new Promise(accept => {
      const token = BrowserStore.get("token");
      if (!token) {
        accept();
        return;
      }
      commit("setToken", token);
      UserApi.logout().then(() => {
        commit("logout");
        dispatch("payouts/reset", null, { root: true });
        dispatch("global/hideUserMobileBar", null, { root: true });
        accept();
      });
    });
  },

  setOtpAuth({ commit }, flag) {
    commit("setOtpAuth", flag);
  },

  googleLogin({ dispatch }, token) {
    return Google.getAuthToken(token).then(r => {
      dispatch("setToken", r.accessToken);
    });
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },

  setUser(state, user) {
    state.user = Object.assign({}, defaultUser, user);
  },

  resetUser() {
    state.user = null;
  },

  request(state) {
    state.error = null;
    state.loading = true;
  },

  requestSuccess(state) {
    state.loading = false;
    state.loginInProgress = true;
  },

  requestFailure(state, error) {
    state.error = error;
    state.user = null;
    state.loading = false;
    BrowserStore.remove("user");
  },

  loginFinished(state) {
    state.loginInProgress = false;
  },

  logout(state) {
    state.user = null;
    state.token = "";
    state.error = null;
    state.loading = false;
    state.otpAuth = false;
    BrowserStore.remove("token");
  },

  showCaptcha(state, show) {
    state.showCaptcha = show;
  },

  setOtpAuth(state, flag) {
    state.otpAuth = flag;
  },
  incrementFollowingCount() {
    state.user.linksCount += 1;
  },
  decrementFollowingCount() {
    state.user.linksCount -= 1;
  },
  incrementStoreCount(state, num) {
    state.user.mediaCount = state.user.mediaCount + num;
  },
  incrementGroupsCount(state, group) {
    state.user.groupsCount += 1;
    state.user.streamGroups = [...state.user.streamGroups, group];
  },
  updateGroupsCount(state, group) {
    state.user.streamGroups = state.user.streamGroups.map(item => {
      return item.key === group.key ? group : item;
    });
  },
  decrementGroupsCount(state, groupId) {
    state.user.groupsCount -= 1;
    state.user.streamGroups = state.user.streamGroups.filter(
      item => item.key !== groupId
    );
  },
  decrementStoreCount(state) {
    state.user.mediaCount = state.user.mediaCount - 1;
  },
  updateCreditBalance(state, data) {
    state.user.creditBalance = data.creditBalance;
    state.user.payments.tipsLimit.max = data.tipsLimitMax;
  },
  reconnectPaymentCard(state) {
    state.user.isPaymentCardConnected = false;
  },
  newCardToken(state, data) {
    state.user.paymentGateCustomerCardToken = data;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
