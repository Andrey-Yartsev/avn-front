"use strict";

const state = {
  funded: 0
};

const actions = {
  openPaymentModal({ dispatch }, { user, amount }) {
    dispatch(
      "subscription/fetchPaymentLink",
      {
        type: "tip",
        amount,
        id: user.id
      },
      { root: true }
    ).then(() => {
      dispatch(
        "modal/show",
        {
          name: "payment",
          data: {
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
  funded(state) {
    state.funded = state.funded + 1;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
