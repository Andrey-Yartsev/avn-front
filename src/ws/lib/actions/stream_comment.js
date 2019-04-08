import Store from "@/store";

export default comment => {
  Store.commit("lives/comment", comment);
};
