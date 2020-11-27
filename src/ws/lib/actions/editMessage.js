import Store from "@/store";

export default data => {
  Store.commit("chat/editMessage", data);
};
