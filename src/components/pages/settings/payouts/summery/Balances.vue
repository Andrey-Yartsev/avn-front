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
        <div class="payouts-bank-info">
          <div class="item">
            <span class="title">Available</span>
            <span class="value">${{ balances.payoutAvailable }}</span>
          </div>
          <div class="item">
            <span class="title">Pending</span>
            <span class="value">${{ balances.payoutPending }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  name: "PayoutSettingsSummeryBalances",
  components: {
    Loader
  },
  computed: {
    loading() {
      return this.$store.state.payouts.balances.fetchLoading;
    },
    withdrawRequesting() {
      return this.$store.state.payouts.requests.withdrawLoading;
    },
    balances() {
      return this.$store.state.payouts.balances.fetchResult;
    }
  },
  methods: {
    async withdrawRequest() {
      await this.$store.dispatch("payouts/requests/withdraw");
      this.$store.dispatch("payouts/requests/fetch");
    }
  },
  created() {
    this.$store.dispatch("payouts/balances/fetch");
  }
};
</script>
