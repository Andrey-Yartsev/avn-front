<template>
  <div class="profile-images__inner" :style="{ fontSize: fontSize }">
    <router-link
      :to="`/stories/${profile.id}`"
      v-if="(profile.hasNotViewedStory || profile.hasStory) && !showLiveLabel"
      class="avatar"
      :class="{ 'online-state': isOnline(profile.id) }"
    >
      <span
        class="avatar__img"
        :class="{ 'with-story': profile.hasNotViewedStory }"
      >
        <img :src="profile.avatar" v-if="profile.avatar" />
      </span>
    </router-link>
    <span
      v-else
      class="avatar"
      @click="click"
      :class="{ 'online-state': isOnline(profile.id) }"
    >
      <span class="avatar__img">
        <img :src="profile.avatar" v-if="profile.avatar" />
      </span>
      <div class="stream-online-label" v-if="showLiveLabel">live</div>
    </span>
    <div
      :class="[
        'profile-name-sticky',
        'hidden-mobile',
        { 'profile-position': profileExtraClass }
      ]"
      v-if="$mq === 'desktop'"
    >
      <div class="profile-name profile-name_base">
        <div class="profile-name__main">
          <span class="name">
            {{ profile.name }}
          </span>
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
          <div class="block-indicator" v-if="user && profile.isBlocked">
            <span class="icn-block icn-item"></span>
          </div>
        </div>
        <span class="user-login reset-ml user-login-container">
          <router-link :to="'/' + profile.username">{{
            profile.username
          }}</router-link>
          <span v-if="showProfileRank" class="user-login user-login-rating">
            # {{ profile.privacy.rankCount }}
            <span
              v-if="isProfileOwner"
              class="icn-item icn-locked icn-size_sm"
              :class="{
                locked: !profile.privacy.showRankCount
              }"
            />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import HeaderScrolled from "@/mixins/headerScrolled";
import Access from "@/components/stream/access";

export default {
  name: "ProfileAvatar",
  mixins: [User, HeaderScrolled, Access],
  props: {
    pageName: {
      type: String,
      default: ""
    },
    profile: {
      type: Object,
      required: true
    }
  },
  computed: {
    showLiveLabel() {
      return !!this.profile.currentStream;
    },
    profileExtraClass() {
      return ["posts", "links", "", "magazine"].indexOf(this.pageName) !== -1;
    },
    showProfileRank() {
      if (!this.profile.privacy.rankCount) {
        return false;
      }
      return (
        this.isProfileOwner ||
        (this.profile.privacy && this.profile.privacy.showRankCount)
      );
    },
    isProfileOwner() {
      return this.user && this.profile.id === this.user.id;
    }
  },
  methods: {
    click() {
      if (this.profile.currentStream) {
        this.tryOpenStream(this.profile, this.profile.currentStream, stream => {
          this.openStream(stream);
        });
      }
    }
  }
};
</script>
