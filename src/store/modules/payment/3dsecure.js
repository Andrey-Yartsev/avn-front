import Store from "@/store";

function securion3DSecure(card, amount, success_callback) {
  global.GlobalSecurionSuccess3DSecureCallback = success_callback;
  global.SecurionPay.verifyThreeDSecure(
    {
      amount: amount,
      currency: "USD",
      card: card
    },
    function(token) {
      if (typeof token === "undefined") {
        // Display error message
        alert("Unknown error");
      } else {
        if (token.error) {
          alert(token.error.message);
        } else {
          global.GlobalSecurionSuccess3DSecureCallback(token.id);
        }
      }
    }
  );
}

export const askFor3dsecure = options => {
  const { amount, paymentGateCustomerCardToken } = options.data;
  global.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
  securion3DSecure(
    paymentGateCustomerCardToken,
    Math.round(amount * 100), // WARNING!!! PRICE IN CENTS
    token => {
      Store.commit("modal/hideSafe", { name: "subscribe" });
      Store.dispatch("payment/pay/pay", { ...options.data, token }).then(() => {
        if (options.data.paymentType !== "message") {
          global.location.reload();
        }
      });
    }
  );
};

export default {};
