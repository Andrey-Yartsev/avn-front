<template>
  <div class="payouts-bank-done">
    <div class="PayoutsBankDoneView">
      <BankEdit v-if="edit" @cancel="edit = false" />
      <template v-else>
        <div class="form-title border-top">
          <div class="inner">
            <span class="semi-transparent">
              Connected Bank
            </span>
            <button @click="edit = true">Edit</button>
          </div>
        </div>
        <div class="shadow-block">
          <div class="container">
            <div class="payouts-personal-info">
              <div
                class="form-group form-group_clear-gaps-bottom form-group_with-label item"
                v-for="v in bankFields"
                :key="v.code"
              >
                <span class="title">{{ v.label }}</span>
                <span class="value">{{ bank[v.code] }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BankEdit from "./BankEdit";
import BankMixin from "@/components/pages/settings/payouts/mixins/bank";

export default {
  name: "PayoutSettingsSummeryBank",
  mixins: [BankMixin],
  components: {
    BankEdit
  },
  data() {
    return {
      edit: false
    };
  },
  computed: {
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    bank() {
      return this.$store.state.payouts.bank.fetchResult;
    }
  }
};
</script>
