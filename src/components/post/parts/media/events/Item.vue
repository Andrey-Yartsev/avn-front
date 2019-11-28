<template>
  <div class="comment stream-message">
    <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
      <span class="avatar__img"
        ><img :src="data.user.avatar" v-if="data.user.avatar"
      /></span>
    </span>
    <div class="comment-content stream-message__head">
      <div class="comment-body">
        <span class="name"
          >{{ data.user ? data.user.name : "Guest" }}&nbsp;</span
        >
        <span
          class="comment-text stream-message__text"
          v-if="type === 'comment'"
        >
          {{ data.comment }}</span
        >
        <span
          class="comment-text stream-message__text"
          v-else-if="type === 'join'"
          >has joined</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StreamComment",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    data() {
      return this.item.data;
    },
    type() {
      return this.item.type;
    }
  }
};
</script>
