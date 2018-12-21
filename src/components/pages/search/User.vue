<template>
  <div class="userView" :class="[{'open-dropdown-inside': showDropdawn}]">
    <div class="bg">
      <img v-if="profile.header" :src="profile.header"/>
    </div>
    <div class="user-container">
      <div class="avatar"><span class="avatar__img"><img v-if="profile.avatar" :src="profile.avatar"/></span></div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + profile.username" class="name">{{ profile.name }}</router-link>
          </div>
          <span class="user-login">
            <router-link :to="'/' + profile.username">{{ profile.username }}</router-link>
          </span>
          </div>
          <div class="user-actions">
            <SubscribeButton
              :profile="profile" v-if="profile.id !== user.id"
              ref="subscribeButton"
            />
            <FollowButton :profile="profile" />
            <UserDropdown
              :profile="profile"
              @openDropdawn="showDropdawn = true"
              @hideDropdawn="showDropdawn = false"
              class="hidden-mobile"
            />
          </div>
      </div>
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
