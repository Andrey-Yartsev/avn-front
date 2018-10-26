<template>
  <div>
    <Legal />
    <Bank />
    <Requests />
    <Transactions />
  </div>
</template>

<script>
import Legal from "./summery/Legal";
import Bank from "./summery/Bank";
import Requests from "./summery/Requests";
import Transactions from "./summery/Transactions";

export default {
  name: "PayoutSettingsSummery",

  components: {
    Legal,
    Bank,
    Requests,
    Transactions
  }
};
</script>
