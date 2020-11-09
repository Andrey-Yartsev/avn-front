<template>
  <div class="payouts-balances">
    <div class="form-title border-top bg-gradient bg-gradient_pseudo">
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent">
            Balances
          </span>
          <button @click="withdrawRequest" :disabled="withdrawRequesting">
            Withdraw Request
          </button>
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="loader-infinity" v-if="loading">
        <Loader :fullscreen="false" text="" :inline="true" :small="true" />
      </div>

      <div class="container" v-else>
        <div class="payouts-personal-info">
          <div
            class="form-group form-group_clear-gaps-bottom form-group_with-label item"
          >
            <span class="title">Available</span>
            <span class="value">${{ balances[prefix + "Available"] }}</span>
          </div>
          <div
            class="form-group form-group_clear-gaps-bottom form-group_with-label item"
          >
            <span class="title">Pending</span>
            <span class="value">${{ balances[prefix + "Pending"] }}</span>
          </div>
        </div>
        <form v-if="withTransactionOption" v-on:submit.stop.prevent="purchase">
          <div class="form-title semi-transparent">
            Purchase credits from available balance
          </div>
          <div
            class="form-group form-group_with-label"
            :class="{ disabled: !balances.payoutAvailable }"
          >
            <label class="form-group-inner">
              <span class="label">
                Amount
              </span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field field-symbol-currency">
                  <span class="form-field">
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
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
              Charge Credits
            </button>
            <div class="lds-dual-ring transparent inline" v-if="progress"></div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  name: "SettingsMoneyBalances",
  components: {
    Loader
  },
  props: {
    storeKey: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true
    },
    withTransactionOption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      amount: "",
      progress: false
    };
  },
  computed: {
    loading() {
      return this.$store.state[this.storeKey].balances.fetchLoading;
    },
    withdrawRequesting() {
      return this.$store.state[this.storeKey].requests.withdrawLoading;
    },
    balances() {
      return this.$store.state[this.storeKey].balances.fetchResult;
    }
  },
  methods: {
    async withdrawRequest() {
      try {
        await this.$store.dispatch(this.storeKey + "/requests/withdraw", {});
        this.$store.dispatch(this.storeKey + "/requests/fetch");
        this.$store.dispatch(this.storeKey + "/balances/fetch");
        this.showToast(false, "Withdraw request completed successfuly");
      } catch (error) {
        this.showToast(true, error.message);
      }
    },
    showToast(err, text) {
      this.$store.commit("global/toastShowTrigger", {
        text: text,
        type: err ? "error" : "success"
      });
    },
    isValidAmount() {
      if (parseFloat(this.amount) < 5) {
        this.showToast(true, "Amount should be more than $5");
        return false;
      }
      if (
        parseFloat(this.amount) >
        parseFloat(this.balances[this.prefix + "Available"])
      ) {
        this.showToast(
          true,
          `Amount should be less than $${
            this.balances[this.prefix + "Available"]
          }`
        );
        return false;
      }
      return true;
    },
    async purchase() {
      if (!this.isValidAmount()) {
        return;
      }
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: `Confirming to withdrawal $${
            this.amount
          } from available balance for purchase of credits.`,
          success: async () => {
            this.progress = true;
            try {
              await this.$store.dispatch(this.storeKey + "/balances/credits", {
                amount: this.amount
              });
              this.showToast(false, "Credits purchased successfuly");
            } catch (error) {
              this.showToast(true, error.message);
            } finally {
              this.progress = false;
              this.amount = "";
            }
          }
        }
      });
    }
  },
  created() {
    this.$store.dispatch(this.storeKey + "/balances/fetch");
  }
};
</script>
