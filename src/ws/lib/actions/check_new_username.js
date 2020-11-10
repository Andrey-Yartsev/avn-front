import Store from "@/store";

export default data => {
  if (data.check) {
    const user = Store.state.auth.tempLocalUser;
    Store.dispatch("profile/update", user, { root: true }).then(res => {
      Store.commit("auth/setTempLocalUser", null, { root: true });
      return res;
    });
  } else {
    Store.dispatch(
      "global/flashToast",
      {
        text: "This username is already in use. Please, choose another one.",
        type: "error"
      },
      { root: true }
    );
  }
};
