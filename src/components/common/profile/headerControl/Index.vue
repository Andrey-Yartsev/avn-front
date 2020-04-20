<template>
  <div class="sticky-header-controls">
    <a
      href="/"
      class="header-return-btn go-back_arrow header-return-btn_icn-abs"
      :class="{ 'go-back': user }"
      @click.prevent="goBack"
    />
    <div
      class="profile-name__header"
      :class="{ 'no-owner': isOwner(profile.id) }"
    >
      <span class="name">
        {{ profile.name }}
      </span>
      <span
        class="verified-user icn-item"
        :class="{
          fullyMonetized: profile.canEarn && profile.canPayoutsRequest
        }"
        v-if="
          profile.isVerified || (profile.canEarn && profile.canPayoutsRequest)
        "
      ></span>
      <span class="user-login">
        <router-link :to="'/' + profile.username">{{
          profile.username
        }}</router-link>
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
import UserDropdown from "@/components/common/userDropdown/Index";
import UserMixin from "@/mixins/user";
import ProfileBackground from "@/components/common/profile/background/Index";
import BackRouter from "@/utils/backRouter";

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
  },
  methods: {
    goBack() {
      BackRouter.back();
    }
  }
};
</script>
