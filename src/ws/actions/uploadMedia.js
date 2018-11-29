import Store from "@/store";

export default data => {
  Store.dispatch("posts/mediaUploaded", data);
};
