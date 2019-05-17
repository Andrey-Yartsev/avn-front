<template>
  <div class="payouts-bank">
    <div class="PayoutsBankView" v-if="!loading">
      <h1 class="form-title">
        Add Bank
      </h1>
      <form class="payouts-bank-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
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
                    <option v-for="v in payouts" :key="v.code" :value="v.code"
                      >{{ v.title }}
                    </option>
                  </select>
                </span>
              </label>
            </div>

            <BankFields
              :bankFields="payoutFields"
              :localBank="localBank"
              ref="bankFields"
              @change="bankValidate"
            />

            <div
              class="form-group form-group_with-label"
              v-if="selectedPayout.authUrl"
            >
              <label class="form-group-inner">
                <span class="label"> </span>
                <span>
                  <a :href="selectedPayout.authUrl">E-payments authorization</a>
                </span>
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
              :disabled="!valid || saving"
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
import BankFields from "./BankFields";

export default {
  name: "PayoutSettingsBankE",
  mixins: [Form],
  components: { BankFields },
  data() {
    return {
      loading: true,
      localBank: null,
      valid: false
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
    payouts() {
      return this.bank.payouts;
    },
    selectedPayout() {
      return this.payouts.find(v => v.code === this.localBank.payoutCode);
    },
    payoutFields() {
      return this.selectedPayout.fields;
    }
  },
  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    save() {
      const data = {};
      data.payoutCode = this.localBank.payoutCode;
      this.payoutFields.map(v => {
        data[v.code] = this.localBank[v.code];
      });
      this.$store.dispatch("payouts/bank/save", data);
    },
    payoutChanged() {
      // this.localBank = { ...this.localBank };
      setTimeout(() => {
        this.bankValidate();
      }, 10);
    },
    bankValidate() {
      this.valid = this.$refs.bankFields.isFormValid;
    }
  },
  created: function() {
    this.$store.dispatch("payouts/bank/fetch").then(r => {
      this.loading = false;
      this.localBank = { ...r };
      // this.localBank.payoutCode = this.payouts[0].code;
    });
  },
  mounted() {
    this.$emit("titleChanged", "Add Bank");
  }
};
</script>
