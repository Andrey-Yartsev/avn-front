"use strict";

const state = {
  funded: 0,
  tipData: null
};

const actions = {
  openPaymentModal({ dispatch }, { user, amount, tipId }) {
    dispatch(
      "subscription/fetchPaymentLink",
      {
        type: "tip",
        amount,
        tipId,
        id: user.id
      },
      { root: true }
    ).then(() => {
      dispatch(
        "modal/show",
        {
          name: "payment",
          data: {
            type: "tip",
            amount,
            user
          }
        },
        { root: true }
      );
    });
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
