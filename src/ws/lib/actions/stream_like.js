import Store from "@/store";

export default like => {
  Store.commit("lives/like", like);
};
