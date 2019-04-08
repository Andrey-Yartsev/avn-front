import Store from "@/store";

export default data => {
  const newPostUserId = +data.post_user_id;
  const currentUserId = +Store.state.auth.user.id;
  if (newPostUserId !== currentUserId) {
    Store.commit("home/newFeedPost", data);
  }
};
