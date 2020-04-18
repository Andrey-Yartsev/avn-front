import Store from "@/store";

export default data => {
  Store.commit("auth/newCardToken", data, { root: true });
};
