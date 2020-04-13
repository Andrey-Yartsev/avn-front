import Store from "@/store";

export default data => {
  Store.commit("auth/updateCreditBalance", data, { root: true });
};
