<template>
  <div class="postComments">
    <span v-if="!showAllComments && comments.length > shownCommentsCount" v-on:click="showAllComments = true" class="load-more-comments">Show More Comments</span>
    <scrolly class="comments-list">
      <scrolly-viewport>
        <Comment v-for="comment in visibleComments" :key="comment.id" :comment="comment"></Comment>
      </scrolly-viewport>
      <scrolly-bar axis="y"></scrolly-bar>
      <scrolly-bar axis="x"></scrolly-bar>
    </scrolly>
  </div>
</template>

<script>
import Comment from "./comment/Index";
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";

export default {
  name: "CommentsListFull",
  components: {
    Comment,
    Scrolly,
    ScrollyViewport,
    ScrollyBar
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
