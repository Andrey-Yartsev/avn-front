import Store from "@/store";

export default data => {
  const { check, email } = data;
  if (check) {
    Store.dispatch("emails/resend", email, { root: true }).then(r => {
      if (!r.success) {
        this.$store.dispatch("global/flashToast", {
          text: "Error on sending"
        });
        return;
      }
      Store.dispatch("profile/fetch", null, { root: true });
      Store.dispatch(
        "global/flashToast",
        { text: "Email sent" },
        { root: true }
      );
    });
  } else {
    Store.dispatch(
      "global/flashToast",
      {
        text: "This email is already in use. Please, choose another one.",
        type: "error"
      },
      { root: true }
    );
  }
};
