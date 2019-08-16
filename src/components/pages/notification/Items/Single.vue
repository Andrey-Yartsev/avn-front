<template>
  <perfect-scrollbar
    class="popup-content-scroll notifications"
    @ps-scroll-y="scrollFunction"
  >
    <div
      class="NotificationsView icn-item icn-size_lg"
      :class="{
        [v.type]: true,
        unread: !v.isRead,
        'last-child': index === items.length - 1
      }"
      v-for="(v, index) in items"
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
        <span class="notification-summary">
          <NotifText :text="v.text" />
        </span>
      </div>
    </div>
    <div class="loader-infinity" v-if="loading">
      <Loader
        :fullscreen="false"
        :inline="true"
        :small="true"
        class="text-dark"
      />
    </div>
  </perfect-scrollbar>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import Loader from "@/components/common/Loader";
import NotifText from "./Text";

export default {
  name: "NotificationSingleView",
  components: {
    Loader,
    NotifText
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    scrollFunction: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    time(date) {
      return fromNow(date);
    }
  }
};
</script>
