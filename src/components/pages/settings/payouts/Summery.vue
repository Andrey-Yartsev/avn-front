<template>
  <div>
    <template v-if="!user.hideBanking">
      <Legal />
      <LegalDiscount />
      <UserDiscounts />
      <Bank />
    </template>
    <!-- <ElectroniDelivery /> -->
    <Balances storeKey="payouts" prefix="payout" />
    <Requests title="Payout Statements" storeKey="payouts" />
    <Transactions />
  </div>
</template>

<script>
import Legal from "./summery/Legal";
import LegalDiscount from "./summery/LegalDiscount";
import Bank from "./summery/Bank";
import Balances from "../common/money/Balances";
import Requests from "../common/money/Requests";
import Transactions from "./summery/Transactions";
import User from "@/mixins/user";
import UserDiscounts from "./summery/UserDiscounts";
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
    LegalDiscount,
    UserDiscounts
  }
};
</script>
