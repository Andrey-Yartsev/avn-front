import Store from "@/store";

export default ({ payoutsApproved, reason }) => {
  if (payoutsApproved) {
    Store.dispatch("auth/extendUser", {
      payoutLegalApproveState: "approved"
    });
  } else {
    Store.dispatch("auth/extendUser", {
      payoutLegalApproveState: "rejected"
    });
    Store.dispatch("global/setError", {
      title: "Rejected",
      message: reason
    });
  }
};
