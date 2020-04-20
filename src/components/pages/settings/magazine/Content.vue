<template>
  <div class="magazine settings-wrapper rounded-container pos-relative">
    <div
      class="border-top shadow-block loader-container loader-container_center"
      v-if="loading"
    >
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </div>

    <div v-else>
      <h1 class="form-title settings-title">
        AVN Magazine subscription
      </h1>
      <div
        class="toggle-wrapper form-title"
        :class="{ disabled: subscriptionDisabled }"
      >
        <div class="inner">
          <label for="subscribed" class="toggle-label semi-transparent">
            I want to subscribe for AVN Magazine
          </label>
          <label class="toggle-element">
            <input
              type="checkbox"
              id="subscribed"
              :checked="hasSubscription"
              @change="toggle"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>

      <div class="shadow-block  border-top">
        <div class="container">
          <ShippingInfo
            :info="status.shipping"
            v-if="hasSubscription"
            class="existing-subscription"
          />
          <SubscriptionForm
            v-else
            ref="form"
            @disabledChange="disabledChange"
          />
        </div>
      </div>
    </div>
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
  data() {
    return {
      subscriptionDisabled: false
    };
  },
  computed: {
    loading() {
      return this.$store.state.magazine.fetchStatusLoading;
    },
    status() {
      return this.$store.state.magazine.fetchStatusResult;
    },
    hasSubscription() {
      if (!this.status) {
        return false;
      }
      return this.status.shipping.hasOfflineSubscription;
    },
    unsubscribeDisabled() {
      return this.$store.state.magazine.updateLoading;
    },
    disabled() {
      if (this.hasSubscription) {
        return false;
      }
      return this.subscriptionDisabled;
    }
  },
  methods: {
    unsubscribe() {
      this.$store.dispatch("magazine/unsubscribe");
    },
    subscribe() {
      this.$refs.form.subscribe();
    },
    toggle() {
      this.hasSubscription ? this.unsubscribe() : this.subscribe();
    },
    disabledChange(disabled) {
      this.subscriptionDisabled = disabled;
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchStatus");
  }
};
</script>
