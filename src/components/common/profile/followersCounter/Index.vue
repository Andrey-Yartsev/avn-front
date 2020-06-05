<template>
  <div class="profile-data" v-if="hasFollowings || hasFollowers || showLikes">
    <div class="item" v-if="hasFollowings">
      <router-link
        to="/following"
        v-if="isOwner(profile.id)"
        class="profile-data__link"
      >
        <span class="data-value">{{ profile.followingCount }}</span>
        <span class="data-label">Following</span>
      </router-link>
      <template v-else>
        <span class="data-value">{{ profile.followingCount }}</span>
        <span class="data-label">Following</span>
      </template>
    </div>
    <div class="item" v-if="hasFollowers">
      <router-link
        to="/followers"
        v-if="isOwner(profile.id)"
        class="profile-data__link"
      >
        <span class="data-value">{{ profile.followersCount }}</span>
        <span class="data-label">Followers</span>
      </router-link>
      <template v-else>
        <span class="data-value">{{ profile.followersCount }}</span>
        <span class="data-label">{{
          profile.followersCount > 1 ? "Followers" : "Follower"
        }}</span>
      </template>
    </div>
    <div class="item" v-if="showLikes">
      <router-link to="/likes" class="profile-data__link">
        <span class="data-value">{{ profile.favoritesCount }}</span>
        <span class="data-label">{{
          profile.favoritesCount > 1 ? "Likes" : "Like"
        }}</span>
      </router-link>
    </div>
    <div class="item" v-if="showSubscribers">
      <router-link
        to="/subscribers"
        v-if="isOwner(profile.id)"
        class="profile-data__link"
      >
        <span class="data-value">{{ profile.privacy.subscribersCount }}</span>
        <span class="data-label">Subscribers</span>
        <span
          class="icn-item icn-locked icn-size_sm"
          :class="{ locked: !profile.privacy.showSubscribersCount }"
        />
      </router-link>
      <template v-else-if="profile.privacy.showSubscribersCount">
        <span class="data-value">{{ profile.privacy.subscribersCount }}</span>
        <span class="data-label">{{
          profile.privacy.subscribersCount > 1 ? "Subscribers" : "Subscriber"
        }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";

export default {
  name: "FollowerCounter",
  mixins: [UserMixin],
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasFollowings() {
      return this.profile && this.profile.followingCount;
    },
    hasFollowers() {
      return this.profile && this.profile.followersCount;
    },
    showLikes() {
      return (
        this.profile &&
        this.user &&
        this.isOwner(this.profile.id) &&
        this.profile.favoritesCount
      );
    },
    hasSubscribers() {
      return (
        this.profile &&
        this.profile.privacy &&
        this.profile.privacy.subscribersCount
      );
    },
    allowViewSubscribers() {
      return (
        this.profile &&
        this.profile.privacy &&
        this.profile.privacy.showSubscribersCount
      );
    },
    showSubscribers() {
      return (
        (this.isOwner(this.profile.id) && this.hasSubscribers) ||
        (!this.isOwner(this.profile.id) &&
          this.hasSubscribers &&
          this.allowViewSubscribers)
      );
    }
  }
};
</script>
