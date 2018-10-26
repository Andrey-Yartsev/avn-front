import Store from "@/store";

export default isApproved => {
  if (isApproved) {
    Store.dispatch("auth/extendUser", {
      payoutLegalApproveState: "approved"
    });
  }
};
