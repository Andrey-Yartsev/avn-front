import Store from "@/store";

export default data => {
  const payment = { ...Store.state.modal.payment.data };
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    if (payment.type === "subscription") {
      Store.dispatch(
        "global/flashToast",
        `Subscription to ${payment.user.name} is successful`
      );
    } else {
      Store.dispatch(
        "global/flashToast",
        `Tip for ${payment.user.name} of ${payment.amount}$ is successful`
      );
      Store.commit("tip/funded");
    }
  } else {
    if (payment.type === "subscription") {
      Store.dispatch("global/flashToast", "Subscription failed");
    } else {
      Store.dispatch("global/flashToast", "Fund failed");
    }
  }
};
