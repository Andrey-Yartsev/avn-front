<template>
  <div class="postComments">
    <div class="post-no-comments" v-if="!loading && !comments.length">
      <div class="msg-no-content">
        <div class="msg-no-content__text">No one left a comment yet</div>
      </div>
    </div>
    <span
      class="load-more-comments"
      @click="getComments"
      v-if="!loading && comments.length < totalComments"
      >Show previous comments ({{ totalComments - comments.length }})</span
    >
    <span class="load-more-comments" v-if="loading">Loading...</span>
    <div class="comments-list comments-list_in-col" v-if="comments.length">
      <VuePerfectScrollbar id="vue-comments-list">
        <Comment
          v-for="comment in reversed"
          :key="comment.id"
          :comment="comment"
          :full="true"
          v-on:commentReply="userName => $emit('commentReply', userName)"
          v-on:likeComment="data => $emit('likeComment', data)"
        />
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/common/postParts/comment/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "CommentsListFull",
  components: {
    Comment,
    VuePerfectScrollbar
  },
  computed: {
    reversed() {
      return [...this.comments].reverse();
    },
    lastCommentId() {
      return this.reversed.length > 1
        ? this.reversed[this.reversed.length - 1].id
        : 0;
    },
    firstCommentId() {
      return this.reversed.length > 1 ? this.reversed[0].id : 0;
    }
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    totalComments: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    getComments: {
      type: Function,
      required: true
    }
  },
  watch: {
    lastCommentId: function() {
      setTimeout(() => {
        this.$scrollTo("#vue-comments-list .comment:last-child", {
          container: "#vue-comments-list"
        });
      }, 100);
    },
    firstCommentId: function() {
      setTimeout(() => {
        this.$scrollTo("#vue-comments-list .comment:first-child", {
          container: "#vue-comments-list"
        });
      }, 100);
    }
  }
};
</script>
