"use strict";

const state = {
  funded: 0,
  tipData: null
};

const actions = {
  openPaymentModal({ dispatch }, { user, amount, tipId }) {
    dispatch(
      "modal/show",
      {
        name: "tipPayConfirm",
        data: {
          amount,
          user,
          tipId
        }
      },
      { root: true }
    );
    return;
  }
};

const mutations = {
  funded(state, data) {
    state.funded = state.funded + 1;
    state.tipData = data;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
