<template>
  <div class="userView" :class="[{ 'open-dropdown-inside': showDropdown }]">
    <div class="bg bg-color bg-gradient_light" v-if="$mq === 'desktop'">
      <img v-if="profile.subscriber.header" :src="profile.subscriber.header" />
    </div>
    <div class="user-container" :class="{ 'user-container_numbered': top }">
      <div
        class="avatar avatar_md avatar_md-desk"
        :class="{ 'online-state': isOnline(profile.subscriber.id) }"
      >
        <span class="avatar__img"
          ><img
            v-if="profile.subscriber.avatar"
            :src="profile.subscriber.avatar"
        /></span>
        <div class="stream-online-label" v-if="showLiveLabel">live</div>
      </div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + profile.subscriber.username" class="name">{{
              profile.subscriber.name
            }}</router-link>
            <span
              class="verified-user icn-item"
              v-if="profile.subscriber.isVerified"
            ></span>
          </div>
          <span class="user-login reset-ml">
            <router-link :to="'/' + profile.subscriber.username">{{
              profile.subscriber.username
            }}</router-link>
          </span>
        </div>
        <div class="user-actions" v-if="!top">
          <!-- <SubscribeButton
            :profile="profile.subscriber"
            :actionPrefix="actionPrefix"
            v-if="!isOwner(profile.subscriber.id)"
            ref="subscribeButton"
          /> -->
          <!-- <FollowButton
            v-if="!isOwner(profile.subscriber.id) && user"
            :profile="profile.subscriber"
            :actionPrefix="actionPrefix"
          />
          <UserDropdown
            :profile="profile.subscriber"
            @openDropdown="showDropdown = true"
            @hideDropdown="showDropdown = false"
            :actionPrefix="actionPrefix"
            class="hidden-mobile"
            v-if="$mq === 'desktop'"
          /> -->
        </div>
      </div>
      <div
        class="user-num-list"
        :class="{ 'user-num-list_first': num == 1 }"
        v-if="top"
      >
        <span class="user-num-list__text">{{ num }}</span>
      </div>
      <!-- <p
        class="profile-text"
        v-if="profile.about"
        v-html="truncate(profile.about)"
      ></p>
      <a
        v-if="profile.twitterUsername"
        :href="'https://twitter.com/' + profile.twitterUsername"
        class="profile-twitter-link"
        target="_blank"
        rel="nofollow"
        >twitter.com/{{ profile.twitterUsername }}</a
      > -->
      <div class="subscribe__details">
        <div class="details_item date">
          <div class="date date_label">Date:</div>
          <div class="date date_info">
            Since {{ messageTime(profile.sinceDate) }}
          </div>
        </div>
        <div class="details_item amount">
          <div class="amount_item amount_label">Amount:</div>
          <div class="amount_item amount_info">${{ profile.price }}</div>
        </div>
        <div class="details_item status">
          <div class="status_item status_label">Status:</div>
          <div class="status_item status_info">
            <span v-if="profile.active"
              ><span style="font-weight: bold">Active </span>until
              {{ messageTime(profile.expireDate) }}</span
            >
            <span v-else
              ><span style="font-weight: bold">Canceled</span>
              {{ messageTime(profile.expireDate) }}</span
            >
          </div>
        </div>
      </div>
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
  computed: {
    showLiveLabel() {
      return !!this.profile.currentStream;
    }
  },
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

<style lang="scss" scoped>
.subscribe__details {
  .details_item {
    padding: 0.5rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
