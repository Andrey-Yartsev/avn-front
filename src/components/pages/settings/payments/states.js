export default {
  data() {
    return {
      state: "",
      statesLoading: true
    };
  },
  computed: {
    countries() {
      return this.$store.state.payment.countries.fetchResult;
    },
    hasStates() {
      if (this.countries && this.countries.length && this.userinfo.country) {
        return this.countries.find(v => this.userinfo.country === v.name)
          .hasStates;
      }
      return false;
    },
    states() {
      return this.$store.state.states.fetchResult;
    }
  },
  methods: {
    getCountryIdByName(name) {
      return this.countries.find(v => name === v.name).id;
    },
    getCountryCodeByName(name) {
      return this.countries.find(v => name === v.name).code;
    },
    fetchCountries() {
      this.$store.dispatch("payment/countries/fetch").then(() => {
        this.userinfo.country = this.countries[0].name;
      });
    },
    fetchStates() {
      if (this.hasStates) {
        this.$store
          .dispatch(
            "states/fetch",
            this.getCountryIdByName(this.userinfo.country)
          )
          .then(() => {
            this.statesLoading = false;
          });
      } else {
        this.statesLoading = false;
      }
    }
  },
  watch: {
    "userinfo.country": function() {
      this.fetchStates(this);
    }
  },
  mounted() {
    this.fetchCountries();
  }
};
