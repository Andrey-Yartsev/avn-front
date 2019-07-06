<template>
  <div class="viewer-row viewer-row_likers">
    <span class="avatar avatar_gap-r-sm avatar_sm">
      <span class="avatar__img">
        <img :src="user.avatar" />
      </span>
    </span>
    <div class="username-group">
      <span class="name">
        <router-link :to="'/' + user.username">{{ user.name }}</router-link>
      </span>
      <div class="user-login reset-ml">
        <router-link :to="'/' + user.username" class="username">{{
          user.username
        }}</router-link>
      </div>
    </div>
    <!-- <button class="btn sm btn-follow-viewers">Follow</button> -->
  </div>
</template>

<script>
export default {
  name: "LikeModalItem",
  props: {
    user: {
      type: Object,
      required: true
    }
  }
};
</script>
