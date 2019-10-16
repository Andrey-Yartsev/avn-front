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
            <span class="value">${{ balances[prefix + "Available"] }}</span>
          </div>
          <div class="item">
            <span class="title">Pending</span>
            <span class="value">${{ balances[prefix + "Pending"] }}</span>
          </div>
        </div>
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
    }
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
      await this.$store.dispatch(this.storeKey + "/requests/withdraw");
      this.$store.dispatch(this.storeKey + "/requests/fetch");
    }
  },
  created() {
    this.$store.dispatch(this.storeKey + "/balances/fetch");
  }
};
</script>