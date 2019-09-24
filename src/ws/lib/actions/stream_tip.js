import Store from "@/store";

export default tip => {
  if (Store.state.auth.user.id !== tip.user.id) {
    Store.dispatch("lives/tip", tip);
  }
};
