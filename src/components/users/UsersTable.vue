<template>
  <div class="table payouts-table">
    <component
      :is="component"
      v-for="(item, i) in items"
      v-bind:key="item.id"
      :profile="item"
      :actionPrefix="actionPrefix"
      :ref="'user' + item.id"
      :top="top"
      :num="i + 1"
    ></component>
  </div>
</template>

<script>
import UserSubscriber from "./UserSubscriber";
import UserEarnings from "./UserEarnings";

export default {
  name: "SearchUsersTable",
  components: {
    UserSubscriber,
    UserEarnings
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    actionPrefix: {
      type: String,
      required: true
    },
    top: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    subscriptionUpdate() {
      return this.$store.state.subscription.updated;
    },
    component() {
      switch (this.actionPrefix) {
        case "subscribes":
        case "snapchat":
          return "UserSubscriber";
        case "earnings":
          return "UserEarnings";
        default:
          return null;
      }
    }
  },
  watch: {
    subscriptionUpdate(data) {
      this.$refs[
        "user" + data.data.userId
      ][0].$refs.subscribeButton.subsRequested(data);
    }
  }
};
</script>
