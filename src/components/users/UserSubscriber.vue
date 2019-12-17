<template>
  <div class="item" v-if="actionPrefix === 'subscribes' || 'snapchat'">
    <div class="user table__cell">
      <router-link
        :to="'/' + profile.subscriber.username"
        class="userview-block"
      >
        <span class="avatar avatar_sm">
          <span class="avatar__img">
            <img
              :src="profile.subscriber.avatar"
              v-if="profile.subscriber.avatar"
            />
          </span>
        </span>
        <div class="name">{{ profile.subscriber.name }}</div>
        <span class="user-login reset-ml" v-if="profile.subscriber.username">{{
          profile.subscriber.username
        }}</span>
        <span v-if="$mq === 'desktop' && profile.snap_name">
          {{ profile.snap_name }}
        </span>
      </router-link>
    </div>
    <div
      class="snapchatUsername table__cell"
      data-title="Snapchat Username"
      v-if="$mq === 'mobile'"
    >
      {{ profile.snap_name }}
    </div>
    <div
      class="amount table__cell table__cell_align table__cell_selected table__cell_align-hor-c"
      data-title="Amount"
    >
      ${{ profile.price }}
    </div>
    <div
      class="status table__cell table__cell_align table__cell_align-hor-c"
      data-title="Status"
    >
      {{ profile.active ? "Active" : "Expired" }}
    </div>
    <div
      class="joined table__cell table__cell_align table__cell_align-hor-c"
      data-title="Joined"
    >
      {{ messageTime(profile.sinceDate) }}
    </div>
    <div
      class="canceled table__cell table__cell_align table__cell_align-hor-c"
      data-title="Canceled"
    >
      {{ messageTime(profile.expireDate) }}
    </div>
  </div>
</template>

<script>
import SubscribeButton from "./SubscribeButton";
import FollowButton from "../pages/search/FollowButton";
import UserDropdown from "@/components/common/userDropdown/Index";
import User from "@/mixins/user";
import truncate from "truncate-html";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "User",
  mixins: [User],
  components: {
    SubscribeButton,
    FollowButton,
    UserDropdown
  },
  data: function() {
    return {
      showDropdown: false
    };
  },
  props: {
    profile: {
      type: Object,
      required: true
    },
    actionPrefix: {
      type: String,
      required: true
    },
    top: {
      type: Boolean,
      default: false
    },
    num: {
      type: Number
    }
  },
  computed: {},
  methods: {
    truncate(v) {
      return truncate(v, 150);
    },
    messageTime(message) {
      return fromNow(message);
    }
  }
};
</script>

<style lang="scss" scoped></style>
