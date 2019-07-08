<template>
  <perfect-scrollbar
    class="popup-content-scroll notifications"
    @ps-scroll-y="scrollFunction"
  >
    <div
      class="NotificationsView icn-item icn-size_lg"
      :class="{
        [v.type]: true,
        unread: !v.items[0].isRead,
        'last-child': key === items.length - 1
      }"
      v-for="(v, key) in items"
      v-bind:key="v.id"
    >
      <template v-if="v.mergedByName">
        <div class="avatars-wrapper">
          <div class="avatars-group">
            <router-link
              :to="'/' + v.items[0].user.username"
              class="avatar avatar_ex-sm"
            >
              <span class="avatar__img">
                <img
                  :src="v.items[0].user.avatar"
                  v-if="v.items[0].user.avatar"
                />
              </span>
            </router-link>
          </div>
          <span class="timestamp">{{ time(v.items[0].createdAt) }}</span>
        </div>
        <div class="content">
          <router-link
            :to="'/' + v.items[0].user.username"
            class="name name_break-text"
            >{{ v.items[0].user.name }}</router-link
          >
          <span class="notification-summary"
            ><span v-html="v.items[0].text"></span> (x{{
              v.items.length
            }})</span
          >
        </div>
      </template>
      <template v-else>
        <div class="avatars-wrapper">
          <div class="avatars-group">
            <router-link
              :to="'/' + item.user.username"
              class="avatar avatar_ex-sm"
              v-for="(item, k) in v.items"
              :key="k + v.id + item.user.username"
            >
              <span class="avatar__img">
                <img :src="item.user.avatar" v-if="item.user.avatar" />
              </span>
            </router-link>
          </div>
          <span class="timestamp">{{ time(v.items[0].createdAt) }}</span>
        </div>
        <div class="content">
          <router-link
            :to="'/' + v.items[0].user.username"
            class="name name_break-text"
            v-if="v.items.length === 1"
            >{{ v.items[0].user.name }}</router-link
          >
          <template v-if="v.items.length === 2">
            <router-link
              :to="'/' + v.items[0].user.username"
              class="name name_break-text"
              >{{ v.items[0].user.name }}</router-link
            >{{ `and `
            }}<router-link
              :to="'/' + v.items[1].user.username"
              class="name name_break-text"
              >{{ v.items[1].user.name }}</router-link
            >
          </template>
          <template v-if="v.items.length > 2">
            <router-link
              :to="'/' + v.items[0].user.username"
              class="name name_break-text"
              v-if="v.items.length > 2"
              >{{ v.items[0].user.name }}</router-link
            >{{ `and ${v.items.length - 1} others ` }}</template
          >
          <span class="notification-summary" v-html="v.items[0].text" />
        </div>
      </template>
    </div>
    <div class="loader-infinity" v-if="loading">
      <Loader :fullscreen="false" :inline="true" class="text-dark small" />
    </div>
  </perfect-scrollbar>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import { uniqId } from "@/utils/mediaFiles";
import Loader from "@/components/common/Loader";

export default {
  name: "NotificationMergedView",
  components: {
    Loader
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
    },
    uniqId
  }
};
</script>
