<template>
  <div class="postComments">
    <div class="post-no-comments" v-if="loading === false && !comments.length">
      <div class="msg-no-content">
        <div class="msg-no-content__text">No one left a comment yet</div>
      </div>
    </div>
    <span v-if="!showAllComments && comments.length > shownCommentsCount" v-on:click="showAllComments = true" class="load-more-comments">Show More Comments</span>
    <scrolly class="comments-list" v-if="comments.length">
      <scrolly-viewport id="vue-comments-list" >
        <Comment
          v-for="comment in visibleComments"
          :key="comment.id"
          :comment="comment"
          :full="true"
          v-on:commentReply="userName => $emit('commentReply', userName)"
          v-on:likeComment="data => $emit('likeComment', data)"
        />
      </scrolly-viewport>
      <scrolly-bar axis="y"></scrolly-bar>
      <scrolly-bar axis="x"></scrolly-bar>
    </scrolly>
  </div>
</template>

<script>
import Comment from "@/components/common/postParts/comment/Index";
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
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visibleComments: function() {
      const copy = this.showAllComments
        ? [...this.comments]
        : this.comments.slice(0, this.shownCommentsCount);
      return copy.reverse();
    }
  },
  watch: {
    visibleComments: function() {
      if (!this.visibleComments.length) return;

      setTimeout(() => {
        this.$scrollTo("#vue-comments-list .comment:last-child", {
          container: "#vue-comments-list"
        });
      }, 100);
    }
  }
};
</script>
