import Store from "@/store";

const userIsGay = user => {
  return user.category === 3;
};
const userViewIsGay = user => {
  return user.categoryView === 3;
};

export default user => {
  const items = [];
  // if (!user.adminReturnUrl) {
  //   return items;
  // }

  if (!userIsGay(user) && user.nominee) {
    items.push({
      name: "avn_awards/voting",
      path: "/settings/avn",
      title: "AVN Awards Promo Link"
    });
  }
  if (!userViewIsGay(user) && Store.state.init.data.enableVoting) {
    items.push({
      path: "/avn_awards/voting",
      title: "AVN Awards Voting"
    });
  }
  return items;
};
