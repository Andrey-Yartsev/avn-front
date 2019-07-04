<template>
  <div
    class="post-secret"
    :class="{
      'post-secret_no-avatar': !profile.avatar
    }"
    @click="click"
  >
    <img
      :src="profile.avatar"
      alt=""
      class="post-secret__img"
      v-if="profile.avatar"
    />
    <span class="post-secret__text">
      Subscribe to view posts
    </span>
  </div>
</template>

<script>
export default {
  name: "ProfilePrivateBlock",
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  methods: {
    click() {
      this.$root.$emit("subcribeBtnClick");
    }
  }
};
</script>
