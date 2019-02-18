<template>
  <div
    v-if="profile.canEarn && price > 0"
    class="subscribePaidView profile-actions__btn"
    @click="subscription"
  >
    <div
      class="subscribe-cost"
      :class="{ 'disable-state': subsAction === 'unsubscribe' }"
      id="subscribe-paid"
    >
      <div class="subscribe-cost__value">
        $<span>{{ profile.subscribePrice }}</span
        >/mo.
      </div>
      <div class="subscribe-cost__label">
        {{ ucFirst(subsAction) }}
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";

export default {
  name: "SubscribeButton",

  mixins: [User],

  props: {
    profile: {
      type: Object,
      required: true
    },
    actionPrefix: {
      type: String,
      default: ""
    }
  },

  computed: {
    price() {
      return parseFloat(this.profile.subscribePrice, 10);
    },
    subsAction() {
      if (!this.profile.subscribedBy) {
        return "subscribe";
      } else if (
        this.profile.subscribedBy &&
        !this.profile.subscribedByExpire
      ) {
        return "unsubscribe";
      } else if (this.profile.subscribedBy && this.profile.subscribedByExpire) {
        return "resubscribe";
      }
    }
  },

  methods: {
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    subscribe() {
      this.$store.dispatch("modal/show", {
        name: "subscribe",
        data: {
          user: this.profile,
          actionPrefix: this.actionPrefix
        }
      });
    },
    unsubscribe() {
      this.$store.dispatch("modal/show", {
        name: "subscriptionConfirm",
        data: this.profile
      });
    },
    resubscribe() {
      this.$store.dispatch("modal/show", {
        name: "resubscribe",
        data: this.profile
      });
    },
    subscription() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            profilePageAction: "subscribe"
          }
        });
        return;
      }
      this[this.subsAction]();
    }
  }
};
</script>
