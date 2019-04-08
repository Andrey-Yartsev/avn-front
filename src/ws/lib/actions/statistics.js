import Store from "@/store";

export default data => {
  Store.commit("lives/statistic", data);
};
