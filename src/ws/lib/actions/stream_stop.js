import Store from "@/store";

export default data => {
  Store.commit("lives/removeStream", data);
  Store.commit("profile/home/setLive", {
    id: data.stream_user_id || data.user.id,
    currentStream: null
  });
  Store.dispatch("obs/stopped", data);
  if (data.user && Store.state.auth.user?.id === data.user.id) {
    Store.commit("obs/selfStreamFinishedUpdate", {
      stream: data,
      isFinished: true
    });
  }
};
