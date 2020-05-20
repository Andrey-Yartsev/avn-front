<template>
  <div
    class="post-secret"
    :class="{
      'post-secret_no-avatar': !profile.avatar
    }"
  >
    <img
      :src="profile.avatar"
      alt=""
      class="post-secret__img"
      v-if="profile.avatar"
    />
    <span class="post-secret__text">
      Follow to view posts
    </span>
  </div>
</template>

<script>
export default {
  name: "FollowersOnlyBlock",
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
};
</script>
