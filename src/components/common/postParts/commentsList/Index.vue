<template>
  <div class="postComments">
    <div class="comments-list">
      <span v-if="commentsCount > 3" v-on:click="clickOnShowMore" class="load-more-comments">Show all comments</span>
      <Comment
        v-for="comment in visibleComments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script>
import Comment from "@/components/common/postParts/comment/Index";

export default {
  name: "CommentsList",
  components: {
    Comment
  },
  props: {
    comments: {
      type: Array,
      required: true
    },
    commentsCount: {
      type: Number,
      required: true
    },
    clickOnShowMore: {
      type: Function,
      required: true
    }
  },
  computed: {
    visibleComments: function() {
      return this.comments.slice(-3);
    }
  }
};
</script>
