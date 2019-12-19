<template>
  <div class="postComments">
    <span
      v-if="commentsCount > 3"
      v-on:click="clickOnShowMore"
      class="load-more-comments"
      >Show all comments</span
    >
    <div class="comments-list comments-list_main">
      <Comment
        v-for="comment in visibleComments"
        :key="comment.id"
        :comment="comment"
        :isReplying="commentReplyId === comment.id"
        @commentReply="comment => $emit('commentReply', comment)"
        @commentRemove="comment => $emit('commentRemove', comment)"
        @likeComment="data => $emit('likeComment', data)"
        :noPadding="true"
        :canComment="canComment"
      />
    </div>
  </div>
</template>

<script>
import Comment from "@/components/post/parts/comment/Index";

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
    },
    commentReplyId: {
      type: Number,
      required: true
    },
    canComment: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    visibleComments: function() {
      return [...this.comments.slice(0, 3)].reverse();
    }
  }
};
</script>
