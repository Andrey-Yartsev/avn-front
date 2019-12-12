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
          <span class="verified-user icn-item"></span>
          <div class="block-indicator">
            <span class="icn-block icn-item"></span>
          </div>
          <button
            @click="clickVoteHandler"
            class="btn vote-btn"
            v-if="isUserNominatable"
          >
            <span class="icn-award icn-item icn-size_lg" />
            Vote 4 Me!
          </button>
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
import Access from "@/components/stream/access";
import VotingMixin from "@/mixins/voting";

export default {
  name: "ProfileAvatar",
  mixins: [User, HeaderScrolled, Access, VotingMixin],
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
      return ["posts", "links", ""].indexOf(this.pageName) !== -1;
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
