<template>
  <div class="explore-wrapper users">
    <User
      class="userView"
      v-for="item in items"
      v-bind:key="item.id"
      :profile="item"
      :ref="'user' + item.id"
    />
  </div>
</template>

<script>
import User from "../User";

export default {
  name: "SearchUsers",
  props: ["items"],

  components: {
    User
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
