<template>
  <div class="sticky-header-controls">
    <ProfileBackground :profile="profile"/>
    <router-link to="/" class="header-return-btn"></router-link>
    <div class="profile-name__header">
      <span class="name">
        {{ profile.name }}
      </span>
      <span class="verified-user"></span>
      <span class="user-login">
        <router-link :to="'/' + profile.name">{{ profile.username }}</router-link>
      </span>
    </div>
    <UserDropdown
      v-if="!isOwner(profile.id)"
      class="profile-more-functions hidden-desktop"
      :profile="profile"
    />
  </div>
</template>

<script>
import UserDropdown from "@/components/common/userDropdawn/Index";
import UserMixin from "@/mixins/user";
import ProfileBackground from "@/components/common/profile/background/Index";

export default {
  name: "HeaderControl",
  mixins: [UserMixin],
  components: {
    UserDropdown,
    ProfileBackground
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
};
</script>
