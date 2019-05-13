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

          <div
            class="form-group form-group_with-label"
            v-for="v in bankFields"
            :key="v.code"
          >
            <label class="form-group-inner">
              <span class="label">{{ v.label }}</span>
              <input :name="v.code" v-model="localBank[v.code]" />
            </label>
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width"
              :disabled="!changed || !valid || saving"
            >
              Save {{ valid }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Bank from "../bank";

export default {
  name: "PayoutSettingsSummeryBankEdit",
  mixins: [Bank],
  data() {
    return {
      localBank: null,
      saving: false
    };
  },
  computed: {
    changed() {
      return JSON.stringify(this.bank) !== JSON.stringify(this.localBank);
    },
    valid() {
      return this.bankFields.every(field => !!this.localBank[field.code]);
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
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
