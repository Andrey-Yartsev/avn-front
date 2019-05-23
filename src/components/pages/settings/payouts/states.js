export default {
  data() {
    return {
      state: "",
      statesLoading: true
    };
  },
  computed: {
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    countries() {
      return this.$store.state.payouts.countries.fetchResult;
    },
    hasStates() {
      if (!this.countries) {
        return false;
      }
      return this.countries.find(v => this.account.countryId === v.id)
        .hasStates;
    },
    _states() {
      return this.$store.state.states.fetchResult;
    },
    states() {
      if (!this._states) {
        return [];
      }
      return Object.entries(this._states).map(v => {
        return {
          id: v[0],
          title: v[1],
          selected: v[0].id === this.state
        };
      });
    }
  },
  created() {
    this.$store.dispatch("payouts/countries/fetch").then(() => {
      if (this.hasStates) {
        this.$store.dispatch("states/fetch", this.account.countryId);
        this.statesLoading = false;
      }
    });
  }
};
