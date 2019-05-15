<template>
  <div class="sticky-header-controls">
    <router-link
      to="/"
      class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
    ></router-link>
    <div
      v-if="profile"
      class="profile-name__header"
      :class="{ 'no-owner': isOwner(profile.id) }"
    >
      <span class="name">
        {{ profile.name }}
      </span>
      <span class="verified-user" v-if="profile.isVerified"></span>
      <span class="user-login">
        <router-link :to="'/' + profile.username">{{
          profile.username
        }}</router-link>
      </span>
    </div>
    <UserDropdown
      v-if="profile && !isOwner(profile.id)"
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
