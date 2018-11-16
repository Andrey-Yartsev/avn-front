import Store from "@/store";

export default data => {
  Store.dispatch("chat/newMessage", data);
};
