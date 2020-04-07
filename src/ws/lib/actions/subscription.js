import Store from "@/store";

export default data => {
  // const payment = { ...Store.state.modal.payment.data };
  // Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success && window.MyApp.$route.name === "ProfilePage") {
    if (Store.state.profile.home.profile) {
      if (Store.state.profile.home.profile.id === data.subscribedOn) {
        Store.dispatch("global/flashToast", {
          text: `Subscription to ${data.name} is successful`
        });
        Store.dispatch(
          "profile/home/extend",
          {
            subscribedBy: true,
            subscribedByProgress: false,
            isPrivatePost: false
          },
          { root: true }
        );
        Store.commit("profile/home/resetPosts", null, { root: true });
        Store.dispatch("profile/home/getPosts", null, { root: true });
        Store.commit("highlights/resetPageState", null, { root: true });
        Store.dispatch(
          "highlights/setSource",
          { source: Store.state.profile.home.profile.id },
          { root: true }
        );
        Store.dispatch("highlights/getPosts", null, { root: true });
      }
    }
    Store.commit(
      "subscription/statusUpdate",
      {
        action: "subscribe",
        result: {
          success: true
        },
        data: {
          userId: data.subscribedOn
        }
      },
      { root: true }
    );

    // if (!payment.actionPrefix) {
    //   console.log("BAD");
    //   console.trace(payment);
    // }
    // Store.commit(payment.actionPrefix + "/extendUser", {
    //   userId: payment.user.id,
    //   data: {
    //     subscribedBy: true,
    //     subscribedByProgress: false
    //   }
    // });
  } else {
    // Store.dispatch("global/flashToast", {
    //   text: "Subscription failed",
    //   type: "error"
    // });
  }
};
