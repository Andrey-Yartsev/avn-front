<template>
  <div class="comment stream-message">
    <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
      <span class="avatar__img">
        <img :src="comment.user.avatar" v-if="comment.user" />
      </span>
    </span>
    <div class="comment-content stream-message__head">
      <div class="comment-body">
        <span class="name">{{
          comment.user ? comment.user.name : "Guest"
        }}</span>
        <span class="comment-text stream-message__text">{{
          comment.comment
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StreamComment",
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
};
</script>
