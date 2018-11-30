import Store from "@/store";

export default data => {
  const payment = { ...Store.state.modal.payment.data };
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch(
      "global/flashToast",
      `Subscription to ${payment.user.name} is successful`
    );
  } else {
    Store.dispatch("global/flashToast", "Subscription failed");
  }
};
