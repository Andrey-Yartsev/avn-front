<template>
  <div class="content magazine">
    <h2>AVN Magazine subscription</h2>
    <span class="loader-container loader-container_center" v-if="loading">
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </span>
    <template v-else>
      <div v-if="hasSubscription" class="existing-subscription">
        <div class="subtitle">You have subscription for this address:</div>
        <ShippingInfo :info="status.shipping" />
        <button
          class="btn lg btn_fix-width"
          @click="unsubscribe"
          :disabled="unsubscribeDisabled"
        >
          Unsubscribe
        </button>
      </div>
      <SubscriptionForm v-else />
    </template>
  </div>
</template>

<script>
import SubscriptionForm from "./SubscriptionForm";
import Loader from "@/components/common/Loader";
import ShippingInfo from "./ShippingInfo";

export default {
  name: "ProfileMagazinePage",
  components: {
    SubscriptionForm,
    Loader,
    ShippingInfo
  },
  computed: {
    loading() {
      return this.$store.state.magazine.fetchStatusLoading;
    },
    status() {
      return this.$store.state.magazine.fetchStatusResult;
    },
    hasSubscription() {
      return this.status.shipping.hasOfflineSubscription;
    },
    unsubscribeDisabled() {
      return this.$store.state.magazine._unsubscribeLoading;
    }
  },
  methods: {
    unsubscribe() {
      this.$store.dispatch("magazine/unsubscribe");
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchStatus");
  }
};
</script>
