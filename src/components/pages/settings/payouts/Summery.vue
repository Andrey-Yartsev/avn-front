<template>
  <div>
    <Legal />
    <Bank />
    <template>
      <Requests />
      <Transactions />
    </template>
  </div>
</template>

<script>
import Legal from "./summery/Legal";
import Bank from "./summery/Bank";
import Requests from "./summery/Requests";
import Transactions from "./summery/Transactions";
import User from "@/mixins/user";

export default {
  name: "PayoutSettingsSummery",

  mixins: [User],

  components: {
    Legal,
    Bank,
    Requests,
    Transactions
  }
};
</script>
