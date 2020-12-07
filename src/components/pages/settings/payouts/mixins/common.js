export default {
  computed: {
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    address() {
      return (
        this.legal.address +
        ", " +
        this.legal.city +
        ", " +
        this.legal.postalCode +
        (this.legal.state ? ", " + this.legal.state : "") +
        ", " +
        this.account.countryName
      );
    }
  }
};
