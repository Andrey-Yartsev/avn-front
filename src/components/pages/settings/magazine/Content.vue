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
      <div class="shadow-block" :class="{ disabled: formsDisabled }">
        <div class="toggle-wrapper border-top first">
          <div class="inner">
            <label for="subscribedOffline" class="toggle-label">
              <div class="title">AVN Magazine Print Subscription</div>
              <div class="subtitle semi-transparent">
                Receive a printed copy every month
              </div>
              <div class="subtitle2">
                <template v-if="free">
                  <s>12 months (12 issues) $240.00 $80.00</s>
                  &nbsp;
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
        <div class="container inner" v-if="shippingExists">
          <ShippingInfo :info="shipping" class="shipping-info" />
        </div>
      </div>
      <div
        class="shadow-block"
        :class="{ disabled: formsDisabled || digitalDisabled }"
      >
        <div class="toggle-wrapper border-top">
          <div class="inner">
            <label for="subscribedDigitalMagazine" class="toggle-label">
              <div class="title">Digital Edition</div>
              <div class="subtitle semi-transparent">
                Get access to the digital edition
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
        <div class="shadow-block">
          <div class="toggle-wrapper border-top">
            <DigitalPreviews
              :locked="!hasDigitalMagazineSubscription"
              @subscribe="subscribeDigitalMagazine"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import ShippingInfo from "./ShippingInfo";
import DigitalPreviews from "./DigitalPreviews";
import PayAction from "../payments/payAction";
import User from "@/mixins/user";

export default {
  name: "ProfileMagazinePage",
  mixins: [PayAction, User],
  components: {
    Loader,
    ShippingInfo,
    DigitalPreviews
  },
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
    formsDisabled() {
      return this.$store.state.magazine.updateOfflineLoading;
    },
    digitalDisabled() {
      return this.$store.state.magazine.updateDigitalLoading;
    },
    free() {
      return this.user.isPaymentReceived || this.user.isMakePayment;
    },
    payPayload() {
      return {
        amount: 49,
        paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
      };
    },
    trigOfflineSubscription() {
      return this.$store.state.magazine.trigOfflineSubscription;
    }
  },
  methods: {
    subscribeOffline() {
      if (!this.shippingExists) {
        this.$store.dispatch("modal/show", { name: "magShipping" });
        return;
      }

      if (!this.free) {
        this.pay(() => {
          this._subscribeOffline();
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
        this.pay(() => {
          this._subscribeDigitalMagazine();
        });
      } else {
        this._subscribeDigitalMagazine();
      }
    },
    pay(onComplete) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Subscription confirm",
          text: "You are subscribing for $49.00",
          success: () => {
            this._pay(
              this.payPayload,
              () => {
                this.$store.dispatch("auth/extendUser", {
                  isMakePayment: true
                });
                onComplete();
              },
              {
                dispatchAction: "magazine/pay"
              }
            );
          }
        }
      });
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
      this.$store.dispatch("magazine/subscribeOffline");
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
  watch: {
    trigOfflineSubscription() {
      this.subscribeOffline();
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchShipping");
  }
};
</script>
