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
            <button class="btn-edit-bank" @click="edit = true">Edit</button>
          </div>
        </div>
        <div class="shadow-block">
          <div class="container">
            <div class="payouts-bank-info" v-if="isAmerica">
              <div class="item">
                <span class="title">Routing Number</span>
                <span class="value">{{ bank.routingNumber }}</span>
              </div>
              <div class="item">
                <span class="title">Account Number</span>
                <span class="value">{{ bank.accountNumber }}</span>
              </div>
            </div>
            <div class="payouts-bank-info" v-else>
              <div class="item">
                <span class="title">IBAN</span>
                <span class="value">{{ bank.iban }}</span>
              </div>
              <div class="item">
                <span class="title">SWIFT/BIC</span>
                <span class="value">{{ bank.bic }}</span>
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

export default {
  name: "PayoutSettingsSummeryBank",

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
    },
    isAmerica() {
      return this.account.countryId == 212;
    }
  }
};
</script>
