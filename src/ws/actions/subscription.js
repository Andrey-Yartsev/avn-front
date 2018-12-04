import Store from "@/store";

export default data => {
  const payment = { ...Store.state.modal.payment.data };
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch(
      "global/flashToast",
      `Subscription to ${payment.user.name} is successful`
    );
    if (Store.state.profile.home.profile) {
      if (Store.state.profile.home.profile.id === payment.user.id) {
        Store.dispatch("profile/home/extend", {
          subscribedBy: true
        });
      }
    }
    Store.commit("search/page/extendUser", {
      userId: payment.user.id,
      data: {
        subscribedBy: true
      }
    });
  } else {
    Store.dispatch("global/flashToast", "Subscription failed");
  }
};
