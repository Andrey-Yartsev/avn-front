import Store from "@/store";

export default data => {
  Store.commit("chat/replaceMessage", data);
};
