import Store from "@/store";

export default () => {
  const items = [];
  // if (!user.adminReturnUrl) {
  //   return items;
  // }
  // let a;
  // if (user.nominee) {
  //   a = {
  //     name: "avn",
  //     title: "AVN Awards"
  //   };
  //   items.push(a);
  // }
  if (Store.state.init.data.enableVoting) {
    items.push({
      name: "avn_awards/voting",
      path: "/avn_awards/voting",
      title: "AVN Awards Promo Link"
    });
  }
  return items;
};
