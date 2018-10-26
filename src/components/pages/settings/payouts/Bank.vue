<template>
  <div class="payouts-bank">
    <div class="PayoutsBankView">
      <h1 class="form-title">
        Add Bank
      </h1>
      <form class="payouts-bank-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-title">
              <div class="inner">
                <div class="semi-transparent">
                  Add Bank
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-group-inner">
                <span class="label">Routing Number</span>
                <input name="routingNumber" v-model="localBank.routingNumber">
              </label>
            </div>

            <div class="form-group">
              <label class="form-group-inner">
                <span class="label">Account Number</span>
                <input name="accountNumber" v-model="localBank.accountNumber">
              </label>
            </div>
          </div>

          <div class="form-group hidden" id="payouts-bank-form-error">
            <label class="form-group-inner">
              <span class="label"></span>
              <div class="error"></div>
            </label>
          </div>

          <div class="form-group-btn hidden-mobile">
            <button type="submit" class="btn lg saveChanges">Next</button>
          </div>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "PayoutSettingsBankE",

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
    valid() {
      return this.localBank.routingNumber && this.localBank.accountNumber;
    }
  },

  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    save() {
      this.$store.dispatch("payouts/bank/save", this.localBank).then(r => {
        if (r.error) {
          return;
        }
      });
    }
  },

  created: function() {
    this.localBank = this._clone(this.bank);
  }
};
</script>
