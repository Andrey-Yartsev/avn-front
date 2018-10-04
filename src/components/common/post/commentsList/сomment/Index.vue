<template>
    <div class="comment">
        <div class="comment-body">
            <router-link :to="'/' + comment.author.username" class="comment-author-name name">{{ comment.author.username }}</router-link>
            <div class="comment-text">{{ comment.text }}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
};
</script>
