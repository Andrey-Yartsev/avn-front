export default user => {
  const items = [];
  // if (!user.adminReturnUrl) {
  //   return items;
  // }
  // let a;
  if (user.nominatable) {
    // a = {
    //   name: "avn",
    //   title: "AVN Awards"
    // };
    // items.push(a);
  }
  // if (user.nominatable) {
  //   const a = {
  //     name: "avn",
  //     title: "AVN Awards Pre-Nominations"
  //   };
  //   const b = {
  //     name: "gayvn",
  //     title: "GayVN Awards Pre-Nominations"
  //   };
  //   if (user.categoryView === 2) {
  //     items.push(a);
  //   } else if (user.categoryView === 3) {
  //     if (user.category === 2) {
  //       items.push(a);
  //     }
  //     items.push(b);
  //   } else if (user.categoryView === 1) {
  //     items.push(a);
  //     items.push(b);
  //   }
  // } else {
  //   const a = {
  //     name: "avn",
  //     path: "/avn_awards/nominations",
  //     title: "AVN Awards Pre-Nominations"
  //   };
  //   const b = {
  //     name: "gayavn",
  //     path: "/gayvn_awards/nominations",
  //     title: "GayVN Awards Pre-Nominations"
  //   };
  //   if (user.categoryView === 2) {
  //     items.push(a);
  //   } else if (user.categoryView === 3) {
  //     if (user.category === 2) {
  //       items.push(a);
  //     }
  //     items.push(b);
  //   } else if (user.categoryView === 1) {
  //     items.push(a);
  //     items.push(b);
  //   }
  // }
  return items;
};
