<template>
  <div class="PayoutsBankView">
    <h1 class="form-title">
      Edit Bank
    </h1>
    <form class="payouts-bank-form" v-on:submit.stop.prevent="save">
      <div class="border-top shadow-block">
        <div class="container">
          <div class="form-title">
            <div class="inner">
              <div class="semi-transparent">
                Edit Bank
              </div>
              <button class="btn-edit-bank" @click.stop.prevent="cancel">
                Cancel
              </button>
            </div>
          </div>

          <template v-if="isAmerica">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Routing Number</span>
                <input name="routingNumber" v-model="localBank.routingNumber" />
              </label>
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Account Number</span>
                <input name="accountNumber" v-model="localBank.accountNumber" />
              </label>
            </div>
          </template>
          <template v-else>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">IBAN</span>
                <input name="routingNumber" v-model="localBank.iban" />
              </label>
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">SWIFT/BIC</span>
                <input name="accountNumber" v-model="localBank.bic" />
              </label>
            </div>
          </template>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width"
              :disabled="!changed || !valid || saving"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PayoutSettingsSummeryBankEdit",

  data() {
    return {
      localBank: null,
      saving: false
    };
  },

  computed: {
    bank() {
      return this.$store.state.payouts.bank.fetchResult;
    },
    changed() {
      return JSON.stringify(this.bank) !== JSON.stringify(this.localBank);
    },
    valid() {
      if (this.isAmerica) {
        return this.localBank.routingNumber && this.localBank.accountNumber;
      } else {
        return this.localBank.iban && this.localBank.bic;
      }
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
      this.saving = true;
      this.$store.dispatch("payouts/bank/save", this.localBank).then(r => {
        if (r.error) {
          return;
        }
        this.$store.dispatch(
          "global/flashToast",
          "Bank info saved successfully"
        );
        this.saving = false;
        this.cancel();
      });
    },
    cancel() {
      this.localBank = null;
      this.$emit("cancel");
    }
  },

  created: function() {
    this.localBank = this._clone(this.bank);
  }
};
</script>
