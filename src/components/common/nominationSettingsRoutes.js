export default user => {
  const items = [];
  // if (!user.adminReturnUrl) {
  //   return items;
  // }
  let a;
  if (user.nominee) {
    a = {
      name: "avn",
      title: "AVN Awards"
    };
    items.push(a);
  }
  return items;
};
