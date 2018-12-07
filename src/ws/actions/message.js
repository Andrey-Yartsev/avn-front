import Store from "@/store";

export default data => {
  Store.commit("modal/hideSafe", { name: "payment" });
  if (data.success) {
    Store.dispatch("global/flashToast", `Message unlocked successful`);
  } else {
    Store.dispatch("global/flashToast", "Message unlock failed");
  }
};
