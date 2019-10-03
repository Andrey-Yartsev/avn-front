import Store from "@/store";

export default tip => {
  Store.dispatch("lives/tip", tip);
};
