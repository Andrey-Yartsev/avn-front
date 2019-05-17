import Store from "@/store";

export default look => {
  if (
    Store.state.auth.user &&
    (look.guest || Store.state.auth.user.id !== look.user.id)
  ) {
    Store.commit("lives/look", look);
  }
};
