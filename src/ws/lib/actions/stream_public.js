import Store from "@/store";

export default data => {
  Store.commit("lives/addNewOne", { ...data, stream_public: true });
  Store.commit("profile/home/setLive", {
    id: data.user.id,
    currentStream: data
  });
};
