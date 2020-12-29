import Store from "@/store";

function ccbillResponseHandler(response, formSubmit) {
  if (response.status == 200 && response.ok) {
    response
      .text()
      .then(function(data) {
        formSubmit({ status: "ready", data });
      })
      .catch(function(error) {
        formSubmit({ status: "reject", data: { error: error.message } });
      });
  } else {
    formSubmit({ status: "reject", data: { error: response } });
  }
}

export function goCcbill(customerInfo, creditCardPaymentInfo, formSubmit) {
  const {
    host,
    clientAccnum,
    clientSubacc,
    addCardV2
  } = Store.state.init.data.payments.ccbill;

  const endpoint = addCardV2
    ? "payment-tokens/merchant-only-verify"
    : "payment-tokens/merchant-only";

  if (addCardV2) {
    creditCardPaymentInfo.cvv2 = "822";
  }

  fetch(
    `${process.env.VUE_APP_API_URL}/ccbill/token?access-token=${
      Store.state.auth.token
    }`
  )
    .then(function(response) {
      response.json().then(function({ token }) {
        fetch(`${host}${endpoint}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            clientAccnum,
            clientSubacc,
            subscriptionId: 0,
            browserHttpAcceptLanguage: global.navigator.language,
            browserHttpUserAgent: global.navigator.userAgent,
            browserHttpAccept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,* /*;q=0.8",
            browserHttpAcceptEncoding: "gzip, deflate",
            customerInfo,
            paymentInfo: {
              creditCardPaymentInfo
            }
          }),
          mode: "cors",
          method: "POST"
        })
          .then(res => ccbillResponseHandler(res, formSubmit))
          .catch(function(error) {
            formSubmit({ status: "reject", data: { error: error.message } });
          });
      });
    })
    .catch(function(error) {
      formSubmit({ status: "reject", data: { error: error.message } });
    });
}
