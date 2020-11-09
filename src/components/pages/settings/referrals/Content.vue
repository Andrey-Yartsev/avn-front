<template>
  <div class="ReferralsView">
    <ReferralsLink />
    <ReferralsBalances
      storeKey="referrals"
      prefix="bonus"
      :withTransactionOption="false"
    />
    <ReferralsRequests title="Referral Bonus Statements" storeKey="referrals" />
    <ReferralsList />
  </div>
</template>

<script>
import ReferralsLink from "./Link";
import ReferralsBalances from "../common/money/Balances";
import ReferralsRequests from "../common/money/Requests";
import ReferralsList from "./ReferralsList";

export default {
  name: "ReferralsSettingsContent",
  components: {
    ReferralsLink,
    ReferralsBalances,
    ReferralsRequests,
    ReferralsList
  }
};
</script>
