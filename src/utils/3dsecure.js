import Store from "@/store";

function securion3DSecure(card, amount, onSuccess, onFailure) {
  global.SecurionPay.verifyThreeDSecure(
    {
      amount,
      currency: "USD",
      card
    },
    function(result) {
      console.log(result);
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
  const { amount, paymentGateCustomerCardToken } = options;
  global.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
  securion3DSecure(
    paymentGateCustomerCardToken,
    Math.round(amount * 100), // WARNING!!! PRICE IN CENTS
    token => {
      Store.commit("modal/hideSafe", { name: "subscribe" });
      Store.dispatch("payment/pay/pay", { ...options, token })
        .then(() => {
          if (options.onSuccess) {
            options.onSuccess();
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
