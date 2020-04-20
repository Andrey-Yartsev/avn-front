<template>
  <div class="userView" :class="[{ 'open-dropdown-inside': showDropdown }]">
    <div class="bg bg-color bg-gradient_light" v-if="$mq === 'desktop'">
      <img v-if="profile.header" :src="profile.header" />
    </div>
    <div class="user-container" :class="{ 'user-container_numbered': top }">
      <div
        class="avatar avatar_md avatar_md-desk"
        :class="{ 'online-state': isOnline(profile.id) }"
      >
        <span
          class="avatar__img"
          :class="{ 'with-story': profile.hasNotViewedStory }"
          ><img v-if="profile.avatar" :src="profile.avatar"
        /></span>
        <div class="stream-online-label" v-if="showLiveLabel">live</div>
      </div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + profile.username" class="name">{{
              profile.name
            }}</router-link>
            <span
              class="verified-user icn-item"
              :class="{
                fullyMonetized: profile.canEarn && profile.canPayoutsRequest
              }"
              v-if="
                profile.isVerified ||
                  (profile.canEarn && profile.canPayoutsRequest)
              "
            ></span>
            <div class="block-indicator" v-if="profile.isBlocked">
              <span class="icn-block icn-item"></span>
            </div>
            <span class="followme" v-if="profile.subscribedOn"
              ><span class="followme__txt">subscribed</span></span
            >
          </div>
          <span class="user-login reset-ml">
            <router-link :to="'/' + profile.username">{{
              profile.username
            }}</router-link>
          </span>
        </div>
        <div class="user-actions" v-if="!top">
          <SubscribeButton
            :profile="profile"
            :actionPrefix="actionPrefix"
            v-if="!isOwner(profile.id)"
            ref="subscribeButton"
          />
          <FollowButton
            v-if="!isOwner(profile.id) && user"
            :profile="profile"
            :actionPrefix="actionPrefix"
          />
          <UserDropdown
            :profile="profile"
            @openDropdown="showDropdown = true"
            @hideDropdown="showDropdown = false"
            :actionPrefix="actionPrefix"
            class="hidden-mobile"
            v-if="$mq === 'desktop'"
          />
        </div>
      </div>
      <div
        class="user-num-list"
        :class="{ 'user-num-list_first': num == 1 }"
        v-if="top"
      >
        <span class="user-num-list__text">{{ num }}</span>
      </div>
      <p
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
      >
    </div>
  </div>
</template>

<script>
import SubscribeButton from "./SubscribeButton";
import FollowButton from "../pages/search/FollowButton";
import UserDropdown from "@/components/common/userDropdown/Index";
import User from "@/mixins/user";
import truncate from "truncate-html";

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
    }
  }
};
</script>
