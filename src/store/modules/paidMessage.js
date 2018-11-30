"use strict";

const state = {};

const actions = {
  openPaymentModal({ dispatch }, { user, amount, messageId }) {
    dispatch(
      "subscription/fetchPaymentLink",
      {
        type: "message",
        amount,
        id: messageId
      },
      { root: true }
    ).then(() => {
      dispatch(
        "modal/show",
        {
          name: "payment",
          data: {
            type: "message",
            amount,
            user
          }
        },
        { root: true }
      );
    });
  }
};

const mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
