<template>
   <div class="postComments">
        <span v-if="!showAllComments && comments.length > 3" v-on:click="showAllComments = true" class="load-more-comments">Show More Comments</span>
        <div class="comments-list">
            <Comment v-for="comment in visibleComments" :key="comment.id" :comment="comment"></Comment>
        </div>
    </div>
</template>

<script>
import Comment from "./Comment";

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
    }
  },
  computed: {
    visibleComments: function() {
      const copy = this.showAllComments
        ? [...this.comments]
        : this.comments.slice(0, 3);
      return copy.reverse();
    }
  }
};
</script>
