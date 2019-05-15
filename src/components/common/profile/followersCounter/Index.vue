<template>
  <div class="profile-data">
    <div class="item">
      <router-link to="/following" v-if="isOwner(profile.id)">
        <span class="value">{{ profile.followingCount }}</span>
        <span class="label">Following</span>
      </router-link>
      <template v-else>
        <span class="value">{{ profile.followingCount }}</span>
        <span class="label">Following</span>
      </template>
    </div>
    <div class="item">
      <router-link to="/followers" v-if="isOwner(profile.id)">
        <span class="value">{{ profile.followersCount }}</span>
        <span class="label">Followers</span>
      </router-link>
      <template v-else>
        <span class="value">{{ profile.followersCount }}</span>
        <span class="label">Followers</span>
      </template>
    </div>
    <div class="item" v-if="profile.id === user.id">
      <span class="value">{{ profile.favoritesCount }}</span>
      <span class="label">Likes</span>
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
  }
};
</script>
