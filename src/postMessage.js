import Store from "@/store";

const actions = {};

actions.fundResult = data => {
  const payment = { ...Store.state.modal.payment.data };
  Store.dispatch("modal/hide", { name: "payment" });
  if (data.status === "success") {
    Store.dispatch(
      "global/flashToast",
      `Tip for ${payment.user.name} of ${payment.amount}$ is successful`
    );
    Store.commit("tip/funded");
  } else {
    Store.dispatch("global/flashToast", "Fund failed");
  }
};

export default event => {
  if (!event.data.source || event.data.source !== "team") {
    return;
  }
  if (!event.data.type || !actions[event.data.type]) {
    return;
  }
  actions[event.data.type](event.data);
};
