<template>
  <div
    v-if="profile.canEarn"
    class="subscribePaidView"
    @click="subscription"
  >
    <div
      class="subscribe-cost"
      :class="{'disable-state': subsAction === 'unsubscribe'}"
      id="subscribe-paid"
    >
      <div class="subscribe-cost__value">
        $<span>{{ profile.subscribePrice }}</span>/mo.
      </div>
      <div class="subscribe-cost__label">
        {{ ucFirst(subsAction) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubscribeButton",

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  computed: {
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
    },
    isSubscribeConfirmed() {
      return this.$store.state.confirm.yes;
    }
  },

  watch: {
    isSubscribeConfirmed(confirmed) {
      if (!confirmed) {
        return;
      }
      this.$store
        .dispatch("subscription/unsubscribe", {
          userId: this.profile.id
        })
        .then(result =>
          this.$emit("requested", {
            action: "unsubscribe",
            result
          })
        );
    }
  },

  methods: {
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    subscribe() {
      this.$store.dispatch("modal/show", {
        name: "subscribe",
        data: this.profile
      });
    },
    unsubscribe() {
      this.$store.dispatch("modal/show", { name: "confirm" });
    },
    resubscribe() {
      this.$store
        .dispatch("subscription/resubscribe", {
          userId: this.profile.id
        })
        .then(result =>
          this.$emit("requested", {
            action: "resubscribe",
            result
          })
        );
    },
    subscription() {
      this[this.subsAction]();
    }
  }
};
</script>
