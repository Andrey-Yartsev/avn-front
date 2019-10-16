import Store from "@/store";

export default data => {
  Store.commit("lives/removeStream", data);
  Store.commit("profile/home/setLive", {
    id: data.stream_user_id || data.user.id,
    currentStream: null
  });
  Store.dispatch("obs/stopped", data);
};
