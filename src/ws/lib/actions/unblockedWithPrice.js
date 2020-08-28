import Store from "@/store";

export default data => {
  const paidBlockedBy = Store.state.auth.user.paidBlockedBy.filter(
    item => item.id !== data.id
  );
  Store.dispatch(
    "auth/extendUser",
    {
      paidBlockedBy
    },
    { root: true }
  );
};
