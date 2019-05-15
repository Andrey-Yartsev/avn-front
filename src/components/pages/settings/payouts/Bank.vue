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

            <div
              class="form-group form-group_with-label"
              v-for="v in payoutFields"
              :key="'f' + v.code"
            >
              <label class="form-group-inner">
                <span class="label">{{ v.label }}</span>
                <input
                  v-if="!v.values"
                  :name="v.code"
                  v-model="localBank[v.code]"
                  v-validate="'required'"
                />
                <span class="select-wrapper" v-else>
                  <select :name="v.code" v-model="localBank[v.code]">
                    <option v-for="vv in v.values" :key="vv.key" :value="vv.key"
                      >{{ vv.value }}
                    </option>
                  </select>
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
      loading: true,
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

      this.$store.dispatch("payouts/bank/save", this.localBank);
    },
    payoutChanged() {
      this.localBank = { ...this.localBank };
    }
  },
  created: function() {
    this.$store.dispatch("payouts/bank/fetch").then(() => {
      this.loading = false;
      this.localBank = {};
      this.localBank.payoutCode = this.payouts[0].code;
    });
  },
  mounted() {
    this.$emit("titleChanged", "Add Bank");
  }
};
</script>
