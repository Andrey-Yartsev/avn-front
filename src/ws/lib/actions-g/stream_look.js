import Store from "@/store";

export default look => {
  Store.commit("lives/look", look);
};
