import User from "@/mixins/user";

export default {
  mixins: [User],
  data() {
    return {
      statesLoading: true
    };
  },
  computed: {
    defaultCountryCode() {
      return this.user.country;
    },
    defaultCountryId() {
      return this.getCountryIdByCode(this.defaultCountryCode);
    },
    countries() {
      return this.$store.state.countries.items;
    },
    hasStates() {
      if (this.countries && this.countries.length && this.userInfo.countryId) {
        return this.countries.find(v => this.userInfo.countryId === v.id)
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
      this.$store.dispatch("countries/fetch").then(() => {
        if (this.defaultCountryCode) {
          const country = this.countries.find(
            v => this.defaultCountryCode === v.id
          );
          if (country) {
            this.userInfo.countryId = this.getCountryIdByCode(
              this.defaultCountryCode
            );
          } else {
            this.userInfo.countryId = this.countries[0].id;
          }
        } else {
          this.userInfo.countryId = this.countries[0].id;
        }
      });
    },
    fetchStates() {
      this.$store.commit("states/reset");
      if (this.hasStates) {
        this.statesLoading = true;
        this.$store
          .dispatch("states/fetch", this.userInfo.countryId)
          .then(() => {
            this.statesLoading = false;
          });
      } else {
        this.statesLoading = false;
      }
    }
  },
  watch: {
    "userInfo.countryId": function() {
      this.fetchStates();
    }
  },
  mounted() {
    this.fetchCountries();
  }
};
