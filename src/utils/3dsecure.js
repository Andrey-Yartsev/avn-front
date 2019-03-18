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
        alert("Unknown error");
      } else {
        if (result.error) {
          alert(result.error.message);
        } else {
          if (result.threeDSecureInfo.liabilityShift === "successful") {
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
