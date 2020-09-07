import Store from "@/store";

export default data => {
  const paidBlockedBy = [...Store.state.auth.user.paidBlockedBy, data];
  Store.dispatch(
    "auth/extendUser",
    {
      paidBlockedBy
    },
    { root: true }
  );
};
