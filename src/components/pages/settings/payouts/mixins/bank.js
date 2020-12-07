export default {
  computed: {
    bank() {
      return this.$store.state.payouts.bank.fetchResult;
    },
    bankPayouts() {
      return this.bank.payouts;
    },
    bankPayout() {
      return this.bankPayouts.find(v => v.code === this.bank.payoutCode);
    },
    bankFields() {
      return this.bankPayout.fields;
    }
  }
};
