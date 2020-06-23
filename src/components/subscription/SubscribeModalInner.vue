<template>
  <Modal :onClose="close">
    <div class="popup-container subscribe-popup" slot="content">
      <div class="content">
        <div class="loader-container loader-container_center" v-if="loading">
          <Loader :fullscreen="false" text="" :small="true" />
        </div>
        <Content
          v-else
          :profile="profile"
          @subscribe="subscribe"
          :progress="progress"
        >
          <template slot="button-text">
            Subscribe for ${{ profile.subscribePrice }} / month
          </template>
          <template slot="button-text-3">
            Subscribe for ${{ getSubscriptionPrice(3) }} / 3 month
          </template>
          <template slot="button-text-6">
            Subscribe for ${{ getSubscriptionPrice(6) }} / 6 month
          </template>
          <template slot="button-text-12">
            Subscribe for ${{ getSubscriptionPrice(12) }} / 12 month
          </template>
          <template slot="footer-text">
            You will be charged
            <span class="selected-text"
              >${{ profile.subscribePrice }} monthly</span
            >
            until you cancel your subscription
          </template>
        </Content>
      </div>
      <button
        type="button"
        class="close close_light close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./SubscribeModalContent";
import User from "@/mixins/user";
import Loader from "@/components/common/Loader";

export default {
  name: "SubscribeModal",
  mixins: [User],
  components: {
    Modal,
    Content,
    Loader
  },
  props: {
    loading: {
      type: Boolean,
      require: true,
      default: false
    },
    progress: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data.user;
    },
    basePrice() {
      return parseFloat(this.profile.basePrice);
    }
  },
  methods: {
    close() {
      this.$store.commit("profile/home/resetOnPageAction");
      this.$store.commit("modal/hideSafe", { name: "subscribe" });
    },
    subscribe(data) {
      this.$emit("subscribe", data);
    },
    getSubscriptionPrice(months) {
      let discount = null;
      if (
        this.profile.multiMonthSubscription &&
        this.profile.multiMonthSubscription[months] &&
        this.profile.multiMonthSubscription[months].discount
      ) {
        discount = parseFloat(
          this.profile.multiMonthSubscription[months].discount
        );
      }
      let totalPrice = (this.basePrice * months).toFixed(2);
      if (discount) {
        totalPrice = (
          (this.basePrice - (this.basePrice / 100) * discount) *
          months
        ).toFixed(2);
      }
      return totalPrice;
    }
  }
};
</script>
