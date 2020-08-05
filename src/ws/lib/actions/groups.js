import Store from "@/store";

export default data => {
  switch (data.type) {
    case "join":
      Store.commit(
        "auth/addItemToUserConnectedData",
        { key: "groups", id: data.id },
        { root: true }
      );
      break;
    case "remove":
      Store.commit(
        "auth/removeItemFromUserConnectedData",
        { key: "groups", id: data.id },
        { root: true }
      );
      break;
    default:
      break;
  }
};
