import Store from "@/store";

export default user => {
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

  if (user.nominee) {
    items.push({
      name: "avn_awards/voting",
      path: "/settings/avn",
      title: "AVN Awards Promo Link"
    });
  }
  if (Store.state.init.data.enableVoting) {
    items.push({
      path: "/avn_awards/voting",
      title: "AVN Awards Voting"
    });
  }
  return items;
};
