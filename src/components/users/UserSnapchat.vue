<template>
  <div class="item">
    <div class="user table__cell">
      <router-link :to="'/' + profile.user.username" class="userview-block">
        <span class="avatar avatar_sm">
          <span class="avatar__img">
            <img :src="profile.user.avatar" v-if="profile.user.avatar" />
          </span>
        </span>
        <div class="name">{{ profile.user.name }}</div>
        <span class="user-login reset-ml">{{ profile.user.username }}</span>
      </router-link>
    </div>
    <div class="snapchatUsername table__cell">
      {{ profile.userSnapName }}
    </div>
    <div
      class="amount table__cell table__cell_align table__cell_selected table__cell_align-hor-c"
    >
      ${{ profile.price }}
    </div>
    <div class="status table__cell table__cell_align table__cell_align-hor-c">
      {{ profile.active ? "active" : "expired" }}
    </div>
    <div class="joined table__cell table__cell_align table__cell_align-hor-c">
      {{ messageTime(profile.sinceDate) }}
    </div>
    <div class="canceled table__cell table__cell_align table__cell_align-hor-c">
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
  },
  mounted() {
    console.log(this.$props.profile);
  }
};
</script>

<style lang="scss" scoped></style>
