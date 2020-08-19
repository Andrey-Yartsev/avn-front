<template>
  <SubscribeButton :profile="profile" @requested="subsRequested" />
</template>

<script>
import SubscribeButton from "@/components/subscription/Button";

export default {
  name: "SearchSubscribeButton",

  components: {
    SubscribeButton
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  methods: {
    subsRequested(data) {
      if (data.action === "unsubscribe") {
        this.unsubscribed(data.result);
      } else if (data.action === "resubscribe") {
        this.resubscribed(data.result);
      } else {
        // throw new Error("Wrong action");
      }
    },
    unsubscribed(result) {
      if (!result.success) {
        return;
      }
      this.$store.commit("search/page/extendUser", {
        userId: this.profile.id,
        data: { subscribedByProgress: true }
      });
      this.$store.dispatch("global/flashToast", {
        text: "You has unsubscribed successfully"
      });
    },
    resubscribed(result) {
      if (!result.success) {
        return;
      }
      this.$store.commit("search/page/extendUser", {
        userId: this.profile.id,
        data: { subscribedByProgress: false }
      });
      this.$store.dispatch("global/flashToast", {
        text: "You have resubscribed successfully"
      });
    }
  }
};
</script>
