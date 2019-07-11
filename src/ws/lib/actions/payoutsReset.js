import Store from "@/store";

export default () => {
  Store.dispatch("auth/extendUser", {
    payoutLegalApproveState: "approved",
    isWantEarn: false
  });
};
