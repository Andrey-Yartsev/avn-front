import User from "@/mixins/user";

export default {
  mixins: [User],
  data() {
    return {
      statesLoading: true,
      statesLoadId: 0
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
    },
    countriesLoading() {
      return this.$store.state.countries.fetchLoading;
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
      if (this.statesLoadId) {
        clearTimeout(this.statesLoadId);
      }
      if (this.hasStates) {
        this.statesLoading = true;
      }
      this.statesLoadId = setTimeout(() => {
        this._fetchStates();
      }, 100);
    },
    _fetchStates() {
      this.$store.commit("states/reset");
      if (this.hasStates) {
        this.$store
          .dispatch("states/fetch", this.userInfo.countryId)
          .then(() => {
            if (!this.userInfo.stateId) {
              this.userInfo.stateId = this.states[0].id;
            }

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
