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

          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">
                Select payouts method
              </span>
              <span class="select-wrapper">
                <select
                  name="payoutCode"
                  id="account-country"
                  v-model="localBank.payoutCode"
                  @change="payoutChanged"
                >
                  <option v-for="v in bankPayouts" :key="v.code" :value="v.code"
                    >{{ v.title }}
                  </option>
                </select>
              </span>
            </label>
          </div>

          <BankFields
            :bankFields="bankFields"
            :localBank="localBank"
            ref="bankFields"
          />

          <div
            class="form-group form-group_with-label"
            v-if="selectedBankPayout.authUrl"
          >
            <label class="form-group-inner">
              <span class="label"> </span>
              <span>
                <a :href="selectedBankPayout.authUrl"
                  >E-payments authorization</a
                >
              </span>
            </label>
          </div>

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
import Bank from "../bank.js";
import BankFields from "../BankFields";

export default {
  name: "PayoutSettingsSummeryBankEdit",
  mixins: [Bank],
  components: { BankFields },
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
      return this.$refs.bankFields.isFormValid;
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    selectedBankPayout() {
      return this.localBank.payouts.find(
        v => v.code === this.localBank.payoutCode
      );
    },
    bankFields() {
      return this.selectedBankPayout.fields;
    }
  },
  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    save() {
      this.saving = true;

      const data = {};
      data.payoutCode = this.localBank.payoutCode;
      this.bankFields.map(v => {
        data[v.code] = this.localBank[v.code];
      });

      this.$store.dispatch("payouts/bank/save", data).then(r => {
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
    },
    payoutChanged() {
      this.localBank = { ...this.localBank };
    }
  },
  created: function() {
    this.localBank = this._clone(this.bank);
  }
};
</script>
