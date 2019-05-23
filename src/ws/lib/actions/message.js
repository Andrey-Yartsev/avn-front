import Store from "@/store";

export default data => {
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch("global/flashToast", {
      text: `Message unlocked successful`
    });
  } else {
    Store.dispatch("global/flashToast", {
      text: "Message unlock failed",
      type: "error"
    });
  }
};
