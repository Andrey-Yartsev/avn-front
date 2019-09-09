import Store from "@/store";

export default data => {
  const s = Store.state;
  if (
    s.explore.gender.category === 1 ||
    s.explore.gender.category === data.category
  ) {
    Store.commit("lives/addNewOne", data);
  }
  Store.commit("profile/home/setLive", {
    id: data.user.id,
    currentStream: data
  });
};
