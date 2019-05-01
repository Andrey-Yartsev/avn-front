<template>
  <div class="payouts-bank">
    <div class="PayoutsBankView">
      <h1 class="form-title">
        Add Bank
      </h1>
      <form class="payouts-bank-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div v-if="isAmerica" class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Routing Number</span>
                <input
                  name="routingNumber"
                  v-model="localBank.routingNumber"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Account Number</span>
                <input
                  name="accountNumber"
                  v-model="localBank.accountNumber"
                  v-validate="'required'"
                />
              </label>
            </div>
          </div>
          <div v-else class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">IBAN</span>
                <input
                  name="iban"
                  v-model="localBank.iban"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">SWIFT/BIC</span>
                <input
                  name="bic"
                  v-model="localBank.bic"
                  v-validate="'required'"
                />
              </label>
            </div>
          </div>

          <div class="form-group hidden" id="payouts-bank-form-error">
            <label class="form-group-inner">
              <span class="label"></span>
              <div class="error"></div>
            </label>
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width saveChanges"
              :disabled="!isFormValid || saving"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";

export default {
  name: "PayoutSettingsBankE",

  mixins: [Form],

  data() {
    return {
      localBank: null
    };
  },

  computed: {
    bank() {
      return this.$store.state.payouts.bank.fetchResult;
    },
    changed() {
      return JSON.stringify(this.bank) !== JSON.stringify(this.localBank);
    },
    saving() {
      return this.$store.state.payouts.bank._saveLoading;
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    isAmerica() {
      return this.account.countryId == 212;
    }
  },

  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    save() {
      this.$store.dispatch("payouts/bank/save", this.localBank);
    }
  },

  created: function() {
    this.localBank = {};
    // this.localBank = this._clone(this.bank);
  },

  mounted() {
    this.$emit("titleChanged", "Add Bank");
  }
};
</script>
