<template>
  <div class="comment">
    <router-link v-if="comment.author" :to="'/' + comment.author.username" class="avatar">
      <img v-if="comment.author.avatar" :src="comment.author.avatar"/>
    </router-link>
    <div class="comment-body">
      <router-link v-if="comment.author" :to="'/' + comment.author.username" class="comment-author-name name">{{ comment.author.username }}</router-link>
      <div class="comment-text">{{ comment.text }}</div>
    </div>
    <div class="comment-footer">
      <time class="date">{{ dateTime }}</time>
      <span v-if="comment.likesCount" class="likes-count">{{ comment.likesCount }} likes</span>
      <button type="button" class="btn-reply">Reply</button>
    </div>
    <button :class="['btn-like', {active: comment.isLiked}]"></button>
  </div>
</template>

<script>
import datetimeHelper from "@/helpers/datetime";

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateTime: function() {
      return datetimeHelper(this.comment.postedAt);
    }
  }
};
</script>
