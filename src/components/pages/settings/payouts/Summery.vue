<template>
  <div>
    <Legal />
    <Bank />
    <Balances />
    <Requests />
    <Transactions />
  </div>
</template>

<script>
import Legal from "./summery/Legal";
import Bank from "./summery/Bank";
import Balances from "./summery/Balances";
import Requests from "./summery/Requests";
import Transactions from "./summery/Transactions";
import User from "@/mixins/user";

export default {
  name: "PayoutSettingsSummery",

  mixins: [User],

  components: {
    Legal,
    Bank,
    Balances,
    Requests,
    Transactions
  }
};
</script>
