import Store from "@/store";

export default data => {
  Store.commit("chat/deleteMessage", data);
};
