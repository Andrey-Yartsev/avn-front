import Store from "@/store";

export default data => {
  Store.commit("lives/addNewOne", data);
};
