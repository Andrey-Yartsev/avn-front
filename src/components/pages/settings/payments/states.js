import UserMixin from "@/mixins/user";

export default {
  mixins: [UserMixin],
  data() {
    return {
      statesLoading: true
    };
  },
  computed: {
    defaultCountryCode() {
      return this.user.country;
    },
    countries() {
      return this.$store.state.payment.countries.fetchResult;
    },
    hasStates() {
      if (this.countries && this.countries.length && this.userinfo.country) {
        return this.countries.find(v => this.userinfo.country === v.code)
          .hasStates;
      }
      return false;
    },
    states() {
      return this.$store.state.states.fetchResult;
    }
  },
  methods: {
    getCountryIdByCode(code) {
      return this.countries.find(v => code === v.code).id;
    },
    fetchCountries() {
      this.$store.commit("payment/countries/reset");
      this.$store.dispatch("payment/countries/fetch").then(() => {
        if (this.defaultCountryCode) {
          const country = this.countries.find(
            v => this.defaultCountryCode === v.code
          );
          if (country) {
            this.userinfo.country = this.defaultCountryCode;
          } else {
            this.userinfo.country = this.countries[0].code;
          }
        } else {
          this.userinfo.country = this.countries[0].code;
        }
      });
    },
    fetchStates() {
      this.$store.commit("states/reset");
      if (this.hasStates) {
        this.statesLoading = true;
        this.$store
          .dispatch(
            "states/fetch",
            this.getCountryIdByCode(this.userinfo.country)
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
      console.log("XXX");
      this.fetchStates();
    }
  },
  mounted() {
    this.fetchCountries();
  }
};
