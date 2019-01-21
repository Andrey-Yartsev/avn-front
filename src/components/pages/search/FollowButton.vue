<template>
  <span class="subscribeView" v-if="!profile.subscribedBy">
    <div
      v-if="profile.followedBy"
      @click="unfollow"
      class="btn-with-icon btn-subscribe disable-state">
      <div class="btn-subscribe__label">
        Unfollow
      </div>
    </div>
    <div
      v-else
      @click="follow"
      class="btn-with-icon btn-subscribe">
      <div class="btn-subscribe__label">
        Follow
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
