import Store from "@/store";

export default data => {
  Store.commit("lives/removeStream", data);
};
