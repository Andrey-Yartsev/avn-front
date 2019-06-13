import Store from "@/store";

function ccbillResponseHandler(response, formSubmit) {
  if (response.status == 200 && response.ok) {
    response
      .text()
      .then(function(data) {
        formSubmit({ status: "ready", data });
      })
      .catch(function(error) {
        console.log(error);
        formSubmit({ status: "reject" });
      });
  } else {
    formSubmit({ status: "reject" });
  }
}

export function goCcbill(customerInfo, creditCardPaymentInfo, formSubmit) {
  const {
    host,
    clientAccnum,
    clientSubacc
  } = Store.state.init.data.payments.ccbill;

  fetch(
    `${process.env.VUE_APP_API_URL}/ccbill/token?access-token=${
      Store.state.auth.token
    }`
  )
    .then(function(response) {
      response.text().then(function(token) {
        console.log(
          JSON.stringify({
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
          })
        );
        fetch(`${host}payment-tokens/merchant-only`, {
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
            console.log(error);
            formSubmit({ status: "reject" });
          });
      });
    })
    .catch(function(error) {
      console.log(error);
      formSubmit({ status: "reject" });
    });
}