import Store from "@/store";

export default data => {
  // const payment = { ...Store.state.modal.payment.data };
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch("global/flashToast", `Message unlocked successful`);
    // Store.commit("tip/funded");
  } else {
    Store.dispatch("global/flashToast", "Message unlock failed");
  }
};
