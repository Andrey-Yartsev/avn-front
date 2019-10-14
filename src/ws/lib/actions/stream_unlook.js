import Store from "@/store";

export default look => {
  Store.commit("lives/unlook", look);
  Store.commit("obs/unlook", look);
};
