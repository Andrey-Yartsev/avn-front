<template>
  <div
    :class="{
      'table payouts-table':
        actionPrefix === 'subscribes' || actionPrefix === 'snapchat',
      'explore-wrapper users':
        actionPrefix !== 'subscribes' && actionPrefix !== 'snapchat'
    }"
  >
    <template v-if="actionPrefix === 'subscribes'">
      <UserSubscriber
        v-for="(item, i) in items"
        v-bind:key="item.id"
        :profile="item"
        :actionPrefix="actionPrefix"
        :ref="'user' + item.id"
        :top="top"
        :num="i + 1"
      />
    </template>
    <template v-else-if="actionPrefix === 'snapchat'">
      <UserSnapchat
        v-for="(item, i) in items"
        v-bind:key="item.id"
        :profile="item"
        :actionPrefix="actionPrefix"
        :ref="'user' + item.id"
        :top="top"
        :num="i + 1"
      />
    </template>
    <template v-else>
      <User
        v-for="(item, i) in items"
        v-bind:key="item.id"
        :profile="item"
        :actionPrefix="actionPrefix"
        :ref="'user' + item.id"
        :top="top"
        :num="i + 1"
      />
    </template>
  </div>
</template>

<script>
import User from "./User";
import UserSubscriber from "./UserSubscriber";
import UserSnapchat from "./UserSnapchat";

export default {
  name: "SearchUsers",
  components: {
    User,
    UserSubscriber,
    UserSnapchat
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
