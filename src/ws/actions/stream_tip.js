import Store from "@/store";

export default tip => {
  Store.commit("lives/tip", tip);
};
