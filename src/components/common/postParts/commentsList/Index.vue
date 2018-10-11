<template>
   <div class="postComments">
        <span v-if="!showAllComments && comments.length > shownCommentsCount" v-on:click="showAllComments = true" class="load-more-comments">Show More Comments</span>
        <div class="comments-list">
            <Comment
              v-for="comment in visibleComments"
              :key="comment.id"
              :comment="comment"
            ></Comment>
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
  data: function() {
    return {
      showAllComments: false
    };
  },
  props: {
    comments: {
      type: Array,
      required: true
    },
    shownCommentsCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    visibleComments: function() {
      const copy = this.showAllComments
        ? [...this.comments]
        : this.comments.slice(0, this.shownCommentsCount);
      return copy.reverse();
    }
  }
};
</script>
