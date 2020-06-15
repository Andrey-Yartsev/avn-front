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
      You're blocked
    </span>
    <sub>You can't follow or see {{ profile.username }} content</sub>
  </div>
</template>

<script>
export default {
  name: "BlockedBlock",
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
};
</script>
