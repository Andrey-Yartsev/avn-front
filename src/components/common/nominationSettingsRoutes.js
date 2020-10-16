import Store from "@/store";

const userViewIsGay = user => {
  return user.categoryView === 3;
};
const userViewIsStraight = user => {
  return user.categoryView === 2;
};
const userViewIsAll = user => {
  return user.categoryView === 1;
};

const userHasGayNominations = nominations => {
  if (!nominations) return false;
  return nominations.find(
    item => item.eventId == process.env.VUE_APP_GAY_AWARDS_EVENT_ID
  );
};
const userHasStraightNominations = nominations => {
  if (!nominations) return false;
  return nominations.find(
    item => item.eventId == process.env.VUE_APP_AWARDS_EVENT_ID
  );
};

export default user => {
  const items = [];
  // user is adimin on login from kitchen page
  if (user.adminReturnUrl || user.showVote) {
    items.push(
      {
        path: "/avn_awards/voting",
        title: "AVN Awards Voting"
      },
      {
        path: "/gayvn_awards/voting",
        title: "GayVN Awards Voting"
      }
    );
    if (userHasStraightNominations(user.nominatedList)) {
      items.push({
        path: "/settings/avn",
        title: "AVN Awards Promo Link"
      });
    }
    if (userHasGayNominations(user.nominatedList)) {
      items.push({
        path: "/settings/gayvn",
        title: "GayVN Awards Promo Link"
      });
    }
  } else {
    if (
      user.nominee &&
      userHasStraightNominations(user.nominatedList) &&
      Store.state.init.data.enableVoting
    ) {
      items.push({
        path: "/settings/avn",
        title: "AVN Awards Promo Link"
      });
    }
    if (
      (userViewIsStraight(user) || userViewIsAll(user)) &&
      Store.state.init.data.enableVoting
    ) {
      items.push({
        path: "/avn_awards/voting",
        title: "AVN Awards Voting"
      });
    }
    if (
      user.nominee &&
      userHasGayNominations(user.nominatedList) &&
      Store.state.init.data.enableGayVoting
    ) {
      items.push({
        path: "/settings/gayvn",
        title: "GayVN Awards Promo Link"
      });
    }
    if (
      (userViewIsGay(user) || userViewIsAll(user)) &&
      Store.state.init.data.enableGayVoting
    ) {
      items.push({
        path: "/gayvn_awards/voting",
        title: "GayVN Awards Voting"
      });
    }
  }
  return items;
};
