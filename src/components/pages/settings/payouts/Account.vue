<template>
  <div class="payouts-account">
    <div class="PayoutsAccountView" v-if="!loading">
      <h1 class="form-title">
        Add Bank
      </h1>
      <form
        class="payouts-account-form border-top"
        v-on:submit.stop.prevent="save"
      >
        <div class="wrapper-payouts-bg">
          <div
            class="container payouts-account-country shadow-block"
            id="payouts-account-country"
          >
            <div class="form-group_with-label form-group">
              <label class="form-group-inner">
                <span class="label">
                  Your Country
                </span>
                <span class="select-wrapper">
                  <select
                    name="country"
                    id="account-country"
                    v-model="countryId"
                  >
                    <option
                      v-for="v in countries"
                      v-bind:key="v.id"
                      :value="v.id"
                      :selected="v.selected"
                      >{{ v.title }}
                    </option>
                  </select>
                </span>
              </label>
              <label class="form-group-inner">
                <span></span>
                <span class="input-help">
                  Please notice that you will have to
                  <router-link to="/support" target="_blank"
                    >contact our support</router-link
                  >
                  to change it later
                </span>
              </label>
              <label class="form-group-inner">
                <span class="label"></span>
                <button type="submit" class="btn lg btn_fix-width saveChanges">
                  Next
                </button>
              </label>
            </div>
          </div>
          <div class="payouts-image-bg">
            <Globe />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Globe from "./Globe";

const countries = {
  212: "United States of America"
};

const htmlElement = document.getElementsByTagName("html")[0];

export default {
  name: "PayoutSettingsAccount",

  components: {
    Globe
  },

  data() {
    return {
      countryId: 0
    };
  },

  computed: {
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    loading() {
      return (
        this.$store.state.payouts.countries.fetchLoading ||
        this.$store.state.payouts.account.fetchLoading
      );
    },
    _countries() {
      return this.$store.state.payouts.countries.fetchResult;
    },
    countries() {
      return this._countries.map(v => {
        console.log(v);
        return {
          id: v.id,
          title: v.name,
          selected: v.id === this.countryId
        };
      });
    },
    countryName() {
      return countries[this.countryId];
    }
  },

  methods: {
    save() {
      this.$store.dispatch("payouts/account/save", {
        countryId: this.countryId,
        countryName: this.countryName
      });
    }
  },

  watch: {
    _countries(countries) {
      this.countryId = countries[0].id;
    }
  },

  mounted() {
    this.$store.dispatch("payouts/countries/fetch");
    htmlElement.classList.add("with-bg-picture");
  },
  beforeDestroy() {
    htmlElement.classList.remove("with-bg-picture");
  }
};
</script>
