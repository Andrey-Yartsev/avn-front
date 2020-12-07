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

const userIsAdmin = user => {
  return user.adminReturnUrl || user.showVote;
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
  // user is admin on login from kitchen page
  if (userIsAdmin(user)) {
    items.push(
      {
        path: "/settings/avn",
        title:
          Store.state.init.data.enableVoting &&
          userHasStraightNominations(user.nominatedList)
            ? "AVN Awards Promo Link"
            : "AVN Awards Pre-Nominations"
      },
      {
        path: "/avn_awards/voting",
        title: "AVN Awards Voting"
      },
      {
        path: "/settings/gayvn",
        title:
          Store.state.init.data.enableGayVoting &&
          userHasGayNominations(user.nominatedList)
            ? "GayVN Awards Promo Link"
            : "GayVN Awards Pre-Nominations"
      },
      {
        path: "/gayvn_awards/voting",
        title: "GayVN Awards Voting"
      }
    );
  } else if (
    !userIsAdmin(user) &&
    user.canEarn &&
    process.env.VUE_APP_IS_AWARDS_ACTIVE === "true"
  ) {
    if (Store.state.init.data.enableVoting) {
      if (user.nominee && userHasStraightNominations(user.nominatedList)) {
        items.push({
          path: "/settings/avn",
          title: "AVN Awards Promo Link"
        });
      }
      if (userViewIsStraight(user) || userViewIsAll(user)) {
        items.push({
          path: "/avn_awards/voting",
          title: "AVN Awards Voting"
        });
      }
    } else {
      // if (userViewIsStraight(user) || userViewIsAll(user)) {
      //   items.push({
      //     path: "/settings/avn",
      //     title: "AVN Awards Pre-Nominations"
      //   });
      // }
    }
    if (Store.state.init.data.enableGayVoting) {
      if (user.nominee && userHasGayNominations(user.nominatedList)) {
        items.push({
          path: "/settings/gayvn",
          title: "GayVN Awards Promo Link"
        });
      }
      if (userViewIsGay(user) || userViewIsAll(user)) {
        items.push({
          path: "/gayvn_awards/voting",
          title: "GayVN Awards Voting"
        });
      }
    } else {
      // if (userViewIsGay(user) || userViewIsAll(user)) {
      //   items.push({
      //     path: "/settings/gayvn",
      //     title: "GayVN Awards Pre-Nominations"
      //   });
      // }
    }
  }
  return items;
};
