<template>
  <div class="profile-images__inner" :style="{ fontSize: fontSize }">
    <router-link
      :to="`/stories/${profile.id}`"
      v-if="profile.hasNotViewedStory && !showLiveLabel"
    >
      <span class="avatar with-story" :style="{ fontSize: fontSize }">
        <span class="avatar__img">
          <img :src="profile.avatar" v-if="profile.avatar" />
        </span>
      </span>
    </router-link>
    <span v-else class="avatar" @click="click">
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
          <span class="verified-user" v-if="profile.isVerified"></span>
          <div class="block-indicator" v-if="user && profile.isBlocked">
            <span class="icn-block icn-item"></span>
          </div>
        </div>
        <span class="user-login reset-ml">
          <router-link :to="'/' + profile.username">{{
            profile.username
          }}</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import HeaderScrolled from "@/mixins/headerScrolled";

export default {
  name: "ProfileAvatar",
  mixins: [User, HeaderScrolled],
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
      return ["posts", ""].indexOf(this.pageName) !== -1;
    }
  },
  methods: {
    click() {
      if (this.profile.currentStream) {
        this.$store.dispatch("modal/show", {
          name: "stream",
          data: {
            stream: this.profile.currentStream
          }
        });
      }
    }
  }
};
</script>
