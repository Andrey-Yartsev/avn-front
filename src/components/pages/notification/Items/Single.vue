<template>
  <VuePerfectScrollbar
    class="popup-content-scroll notifications"
    @ps-scroll-y="scrollFunction"
  >
    <div
      class="NotificationsView icn-item"
      :class="{
        [v.type]: true,
        unread: !v.isRead,
        'last-child': key === items.length - 1
      }"
      v-for="(v, key) in items"
      v-bind:key="v.id"
    >
      <div class="avatars-wrapper">
        <router-link :to="'/' + v.user.username" class="avatar avatar_ex-sm">
          <span class="avatar__img">
            <img :src="v.user.avatar" v-if="v.user.avatar" />
          </span>
        </router-link>
        <span class="timestamp">{{ time(v.createdAt) }}</span>
      </div>
      <div class="content">
        <router-link :to="'/' + v.user.username" class="name name_break-text">{{
          v.user.name
        }}</router-link>
        <span class="notification-summary" v-html="v.text" />
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "NotificationSingleView",
  components: {
    VuePerfectScrollbar
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    scrollFunction: {
      type: Function,
      required: true
    }
  },
  methods: {
    time(date) {
      return fromNow(date);
    }
  }
};
</script>
