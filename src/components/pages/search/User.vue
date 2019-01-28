<template>
  <div class="userView" :class="[{ 'open-dropdown-inside': showDropdawn }]">
    <div class="bg">
      <img v-if="profile.header" :src="profile.header" />
    </div>
    <div class="user-container">
      <div class="avatar avatar_md avatar_md-desk">
        <span class="avatar__img"
          ><img v-if="profile.avatar" :src="profile.avatar"
        /></span>
      </div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + profile.username" class="name">{{
              profile.name
            }}</router-link>
          </div>
          <span class="user-login reset-ml">
            <router-link :to="'/' + profile.username">{{
              profile.username
            }}</router-link>
          </span>
        </div>
        <div class="user-actions">
          <SubscribeButton
            :profile="profile"
            v-if="profile.id !== user.id"
            ref="subscribeButton"
          />
          <FollowButton :profile="profile" />
          <UserDropdown
            :profile="profile"
            @openDropdawn="showDropdawn = true"
            @hideDropdawn="showDropdawn = false"
            actionPrefix="search/page"
            class="hidden-mobile"
          />
        </div>
      </div>
      <p class="profile-text" v-if="profile.about" v-html="profile.about"></p>
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
import FollowButton from "./FollowButton";
import UserDropdown from "@/components/common/userDropdawn/Index";
import User from "@/mixins/user";

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
      showDropdawn: false
    };
  },

  props: ["profile"]
};
</script>
