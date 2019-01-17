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
    >Show previous comments ({{ totalComments - comments.length }})</span>
    <div class="comments-list" v-if="comments.length">
      <VuePerfectScrollbar id="vue-comments-list" >
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
    // comments: function() {
    //   setTimeout(() => {
    //     this.$scrollTo("#vue-comments-list .comment:last-child", {
    //       container: "#vue-comments-list"
    //     });
    //   }, 100);
    // }
  }
};
</script>
