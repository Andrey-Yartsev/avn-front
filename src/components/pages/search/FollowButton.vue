<template>
  <span class="subscribeView" v-if="!profile.subscribedBy">
    <div
      v-if="profile.followedBy"
      @click="unfollow"
      class="btn-with-icon btn-subscribe disable-state"
    >
      <span class="icn-item icn-userp"></span>
      <div class="btn-subscribe__label">
        Unfollow
      </div>
    </div>
    <div v-else @click="follow" class="btn-with-icon btn-subscribe">
      <span class="icn-item icn-userp"></span>
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
    },
    actionPrefix: {
      type: String,
      required: true
    }
  },

  methods: {
    follow() {
      this.$store.dispatch(`${this.actionPrefix}/follow`, this.profile.id);
    },
    unfollow() {
      this.$store.dispatch(`${this.actionPrefix}/unfollow`, this.profile.id);
    }
  }
};
</script>
