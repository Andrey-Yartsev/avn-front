<template>
  <div class="creditsView">
    <h1
      class="form-title hidden-mobile settings-title"
      v-if="$mq === 'desktop'"
    >
      Credits
      <span class="balance-info"
        >Balance: {{ user.creditBalance }} credits</span
      >
    </h1>

    <form v-on:submit.stop.prevent="deposit">
      <div class="border-top">
        <div class="shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">
                  Credits
                </span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field field-symbol-currency">
                    <span class="form-field">
                      <input
                        name="amount"
                        v-model="amount"
                        class="field-gap_currency"
                        autocomplete="off"
                      />
                    </span>
                  </span>
                </span>
              </label>
            </div>
            <div class="form-group-btn">
              <button
                type="submit"
                :disabled="!amount || progress"
                class="btn lg btn_fix-width"
              >
                Deposit
              </button>
              <div
                class="lds-dual-ring transparent inline"
                v-if="progress"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <AutoReloadDeposit />
    <Transactions />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Transactions from "./Transactions";
import AutoReloadDeposit from "./AutoReloadDeposit";
import PayActionMixin from "@/components/pages/settings/credits/mixins/payAction";
import userMixin from "@/mixins/user";

// import PayAction from "../../../../sep-components/avn/securionpay/payAction";

export default {
  name: "CreditsSettingsContent",
  mixins: [PayActionMixin, userMixin],
  components: {
    Loader,
    Transactions,
    AutoReloadDeposit
  },
  data() {
    return {
      amount: ""
    };
  },
  methods: {
    deposit() {
      const { paymentGateCustomerCardToken } = this.user;
      this._pay(
        {
          paymentType: "credit",
          amount: parseFloat(this.amount),
          paymentGateCustomerCardToken
        },
        () => {
          this.amount = "";
          this.$store.dispatch("credits/transactions/fetch");
          this.$store.dispatch("global/flashToast", {
            text: "Deposit is made successfully"
          });
        }
      );
    }
  }
};
</script>
