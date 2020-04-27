<template>
  <div class="magazine settings-wrapper roun ded-container pos-relative">
    <template v-if="loading">
      <h1 class="form-title settings-title">
        AVN Magazine
      </h1>
      <div
        class="border-top shadow-block loader-container loader-container_center"
      >
        <Loader :fullscreen="false" :inline="true" text="" :small="true" />
      </div>
    </template>
    <template v-else>
      <h1 class="form-title settings-title">
        AVN Magazine
      </h1>
      <div class="shadow-block">
        <div class="toggle-wrapper border-top first">
          <!--          :class="{ disabled: subscriptionDisabled }"-->
          <div class="inner">
            <label for="subscribedOffline" class="toggle-label">
              <div class="title">AVN Magazine Print Subscription</div>
              <div class="subtitle semi-transparent">
                Receive a printed copy every month
              </div>
              <div class="subtitle2">
                <template v-if="free">
                  <s>12 months (12 issues) $240.00 $80.00</s>
                  <span class="red"
                    >Lucky you! As an active member you receive a FREE
                    subscription to AVN</span
                  >
                </template>
                <template v-else>
                  <span>12 months (12 issues) $49.00</span>
                </template>
                <div class="semi-transparent">
                  Includes a subscription to AVN Digital Edition
                </div>
              </div>
            </label>
            <label class="toggle-element">
              <input
                type="checkbox"
                id="subscribedOffline"
                :checked="hasOfflineSubscription"
                @click.prevent="toggleOffline"
              />
              <span class="toggle-element_switcher"></span>
            </label>
          </div>
        </div>
        <div class="container" v-if="shippingExists">
          <ShippingInfo :info="shipping" class="shipping-info" />
        </div>
      </div>
      {{ shipping }}
      <div class="shadow-block">
        <div class="toggle-wrapper border-top">
          <div class="inner">
            <label for="subscribedDigitalMagazine" class="toggle-label">
              <div class="title">Digital Edition</div>
              <div class="subtitle semi-transparent">
                Receive a printed copy of AVN Magazine
              </div>
              <div class="subtitle2">
                <template v-if="free">
                  <s>12 months (12 issues) $240.00 $80.00</s>
                </template>
                <template v-else>
                  <span>12 months (12 issues) $49.00</span>
                </template>
              </div>
            </label>
            <label class="toggle-element">
              <input
                type="checkbox"
                id="subscribedDigitalMagazine"
                :checked="hasDigitalMagazineSubscription"
                @click.prevent="toggleDigitalMagazine"
              />
              <span class="toggle-element_switcher"></span>
            </label>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import ShippingInfo from "./ShippingInfo";
import PayAction from "./payAction";

export default {
  name: "ProfileMagazinePage",
  mixins: [PayAction],
  components: {
    Loader,
    ShippingInfo
  },
  // data() {
  //   return {
  //     subscriptionDisabled: false
  //   };
  // },
  computed: {
    loading() {
      return this.$store.state.magazine.fetchShippingLoading;
    },
    shippingExists() {
      return !!this.shipping.id;
    },
    shipping() {
      return this.$store.state.magazine.fetchShippingResult;
    },
    hasOfflineSubscription() {
      if (!this.shipping) {
        return false;
      }
      return this.shipping.hasOfflineSubscription;
    },
    hasDigitalMagazineSubscription() {
      if (!this.shipping) {
        return false;
      }
      return this.shipping.hasDigitalMagazineSubscription;
    },
    disabled() {
      if (this.hasOfflineSubscription) {
        return false;
      }
      return true;
    },
    free() {
      return this.user.isMakePayment;
    }
  },
  methods: {
    subscribeOffline() {
      if (!this.free) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Subscription confirm",
            text: "You are subscribing for $49.00",
            success: () => {
              this._pay({}, () => {
                this._subscribeOffline();
              });
            }
          }
        });
      } else {
        this._subscribeOffline();
      }
    },
    unsubscribeOffline() {
      this.$store.dispatch("magazine/unsubscribeOffline");
    },
    subscribeDigitalMagazine() {
      if (!this.free) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Subscription confirm",
            text: "You are subscribing for $49.00",
            success: () => {
              this._pay({}, () => {
                this._subscribeDigitalMagazine();
              });
            }
          }
        });
      } else {
        this._subscribeDigitalMagazine();
      }
    },
    unsubscribeDigitalMagazine() {
      this.$store.dispatch("magazine/unsubscribeDigitalMagazine");
    },
    _subscribeDigitalMagazine() {
      this.$store.dispatch("magazine/subscribeDigitalMagazine");
    },
    _subscribeOffline() {
      if (!this.free) {
        throw new Error("Wrong logic");
      }
      if (this.shippingExists) {
        this.$store.dispatch("magazine/subscribeOffline");
        return;
      }
      this.$store.dispatch("modal/show", { name: "magShipping" });
    },
    toggleOffline() {
      this.hasOfflineSubscription
        ? this.unsubscribeOffline()
        : this.subscribeOffline();
    },
    toggleDigitalMagazine() {
      this.hasDigitalMagazineSubscription
        ? this.unsubscribeDigitalMagazine()
        : this.subscribeDigitalMagazine();
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchShipping");
  }
};
</script>
