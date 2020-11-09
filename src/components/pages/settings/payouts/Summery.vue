<template>
  <div>
    <template v-if="!user.hideBanking">
      <Legal />
      <Bank />
    </template>
    <!-- <ElectroniDelivery /> -->
    <Balances
      storeKey="payouts"
      prefix="payout"
      :withTransactionOption="true"
    />
    <AutoRequests />
    <Requests title="Payout Statements" storeKey="payouts" />
    <Transactions />
  </div>
</template>

<script>
import Legal from "./summery/Legal";
import Bank from "./summery/Bank";
import AutoRequests from "./summery/AutoRequests";
import Balances from "../common/money/Balances";
import Requests from "../common/money/Requests";
import Transactions from "./summery/Transactions";
import User from "@/mixins/user";
// import ElectroniDelivery from "./summery/ElectronicDelivery";

export default {
  name: "PayoutSettingsSummery",

  mixins: [User],

  components: {
    Legal,
    Bank,
    Balances,
    Requests,
    Transactions,
    AutoRequests
  }
};
</script>
