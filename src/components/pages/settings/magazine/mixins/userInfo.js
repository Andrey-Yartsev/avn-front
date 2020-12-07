import User from "@/mixins/user";

export default {
  mixins: [User],
  data() {
    return {
      statesLoading: true,
      statesLoadId: 0,
      userInfoLoading: true,
      userInfo: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        city: "",
        zip: "",
        countryId: "",
        stateId: "",
        kinds: []
      }
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
      const items = this.$store.state.countries.items;
      if (!items || !items.length) {
        return [];
      }
      return [{ id: "", name: "—" }, ...items];
    },
    hasStates() {
      if (this.countries && this.countries.length && this.userInfo.countryId) {
        return this.countries.find(v => this.userInfo.countryId === v.id)
          .hasStates;
      }
      return false;
    },
    states() {
      if (!this.$store.state.states.fetchResult) {
        return [];
      }
      return [{ id: "", name: "—" }, ...this.$store.state.states.fetchResult];
    },
    countriesLoading() {
      return this.$store.state.countries.fetchLoading;
    }
  },
  methods: {
    getCountryIdByCode(code) {
      if (!this.countries) {
        return null;
      }
      return this.countries.find(v => code === v.code).id;
    },
    getStateByName(name) {
      return this.states.find(v => v.name === name);
    },
    fetchCountries() {
      return this.$store.dispatch("countries/fetch").then(() => {
        if (this.defaultCountryCode) {
          const country = this.countries.find(
            v => this.defaultCountryCode === v.id
          );
          if (country) {
            this.userInfo.countryId = this.getCountryIdByCode(
              this.defaultCountryCode
            );
          }
        }
      });
    },
    test() {
      return new Promise(accept => {
        setTimeout(() => {
          accept();
        }, 1000);
      });
    },
    fetchStates() {
      return new Promise(accept => {
        if (this.hasStates) {
          this.statesLoading = true;
        }
        this.$store.commit("states/reset");
        if (this.hasStates) {
          this.$store
            .dispatch("states/fetch", this.userInfo.countryId)
            .then(() => {
              if (!this.userInfo.stateId) {
                this.userInfo.stateId = this.states[0].id;
              }
              this.$emit("statesLoaded");
              this.statesLoading = false;
              accept();
            });
        } else {
          this.statesLoading = false;
          accept();
        }
      });
    },
    loadUserInfo() {
      Promise.all([
        this.$store.dispatch("payouts/legal/fetch"),
        this.$store.dispatch("payouts/account/fetch"),
        this.fetchCountries()
      ]).then(([legal, account]) => {
        if (!this.curData.id) {
          this.userInfo = Object.assign(this.userInfo, legal);
          if (account.countryId) {
            this.userInfo.countryId = account.countryId;
          } else {
            this.userInfo.countryId = this.defaultCountryId;
          }
          this.fetchStates().then(() => {
            if (legal.state) {
              const _state = this.getStateByName(legal.state);
              if (_state) {
                this.userInfo.stateId = _state.id;
              }
            }
          });

          this.userInfo.zip = legal.postalCode;
          this.userInfo.kinds = [this.kindOptions[0]];
        } else {
          this.userInfo = Object.assign(this.userInfo, this.curData);
          this.userInfo.countryId = this.curData.country.id;
          this.userInfo.stateId = this.curData.state.id;
          this.userInfo.kinds = this.userInfo.magazines
            .map(name => {
              return this.kindOptions.find(kind => kind.name === name);
            })
            .filter(v => !!v);
          if (this.userInfo.kinds.length === 0) {
            this.userInfo.kinds = [this.kindOptions[0]];
          }
        }
        this.userInfoLoading = false;
      });
    }
  },
  watch: {
    "userInfo.countryId": function() {
      this.fetchStates();
    }
  },
  mounted() {
    this.loadUserInfo();
  }
};
