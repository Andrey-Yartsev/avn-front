<template>
  <div class="explore-wrapper users">
    <User
      v-for="(item, i) in items"
      v-bind:key="item.id"
      :profile="item"
      :actionPrefix="actionPrefix"
      :ref="'user' + item.id"
      :top="top"
      :num="i + 1"
    />
  </div>
</template>

<script>
import User from "./User";

export default {
  name: "SearchUsers",
  components: {
    User
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
