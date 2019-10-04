import Store from "@/store";

export default data => {
  Store.commit("online/updateUsers", data);
};
