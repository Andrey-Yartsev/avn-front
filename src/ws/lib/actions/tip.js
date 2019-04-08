import Store from "@/store";

export default data => {
  const payment = { ...Store.state.modal.payment.data };
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch(
      "global/flashToast",
      `Fund for ${payment.user.name} of ${payment.amount}$ is successful`
    );
    Store.commit("tip/funded", data);
  } else {
    Store.dispatch("global/flashToast", "Fund failed");
  }
};
