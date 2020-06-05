import Store from "@/store";

function securion3DSecure(card, amount, onSuccess, onFailure) {
  global.SecurionPay.verifyThreeDSecure(
    {
      amount,
      currency: "USD",
      card
    },
    function(result) {
      if (typeof result === "undefined") {
        onFailure({ message: "Unknown error" });
      } else {
        if (result.error) {
          onFailure(result.error);
        } else {
          if (result.threeDSecureInfo.liabilityShift === "successful") {
            onSuccess(result.id);
          } else if (
            result.threeDSecureInfo.liabilityShift === "not_possible"
          ) {
            onSuccess(result.id);
          } else {
            onFailure({ message: "3ds check failed" });
          }
        }
      }
    }
  );
}

export const askFor3dSecure = options => {
  let dispatchAction = "payment/pay/pay";
  if (options) {
    if (options.dispatchAction) {
      dispatchAction = options.dispatchAction;
    }
  }
  const { amount, paymentGateCustomerCardToken } = options;
  global.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
  securion3DSecure(
    paymentGateCustomerCardToken,
    Math.round(amount * 100), // WARNING!!! PRICE IN CENTS
    token => {
      Store.commit("modal/hideSafe", { name: "subscribe" });
      Store.dispatch(dispatchAction, { ...options, token })
        .then(res => {
          if (res.success && res.message) {
            Store.dispatch("global/flashToast", {
              text: res.message,
              type: "warning"
            });
          }
          if (options.onSuccess) {
            options.onSuccess(options);
          }
        })
        .catch(error => {
          if (options.onFailure) {
            options.onFailure(error);
          }
        });
    },
    options.onFailure
  );
};
