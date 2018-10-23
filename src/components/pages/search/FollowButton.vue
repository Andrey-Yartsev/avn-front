<template>
  <span class="subscribeView" v-if="!profile.subscribedBy">
    <div
      class="profile-actions__btn btn-subscribe"
      @click="profile.followedBy ? unfollow() : follow()"
    >
      <div class="btn-subscribe__label">
        {{ profile.followedBy ? "Unfollow" : "Follow" }}
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: "SearchFollowButton",

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  methods: {
    follow() {
      this.$store.dispatch("search/page/follow", this.profile.id);
    },
    unfollow() {
      this.$store.dispatch("search/page/unfollow", this.profile.id);
    }
  }
};
</script>
