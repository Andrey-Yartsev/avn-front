import Store from "@/store";

export default data => {
  Store.commit("init/updateContestsStatus", data);
};
