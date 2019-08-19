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
      <perfect-scrollbar id="vue-comments-list">
        <Comment
          v-for="(comment, index) in rearranged"
          :key="comment.id"
          :comment="comment"
          :full="true"
          :class="{
            'first-comment': index === 0,
            'last-comment': index === rearranged.length - 1
          }"
          :isReplying="commentReplyId === comment.id"
          @commentReply="comment => $emit('commentReply', comment)"
          @commentRemove="comment => $emit('commentRemove', comment)"
          @likeComment="data => $emit('likeComment', data)"
        />
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/common/postParts/comment/Index";

const findIndex = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
  return false;
};

const propComparator = prop => {
  return function(a, b) {
    return a[prop] - b[prop];
  };
};

export default {
  name: "CommentsListFull",
  components: {
    Comment
  },
  computed: {
    rearranged() {
      let comments = [...this.comments].reverse();

      comments.forEach((v, i) => {
        if (v.answerTo) {
          const comment = { ...v };
          comments.splice(i, 1);
          const index = findIndex(comments, comment.answerTo);
          comments.splice(index + 1, 0, comment);
        }
      });

      const pComments = [];
      let rootIndex = -1;

      comments.forEach(v => {
        if (!v.answerTo) {
          rootIndex++;
        }
        if (!pComments[rootIndex]) {
          pComments[rootIndex] = [];
        }
        pComments[rootIndex].push(v);
      });

      let result = [];

      for (let i = 0; i < pComments.length; i++) {
        pComments[i].sort(propComparator("id"));
        result = result.concat(pComments[i]);
      }

      return result;
    },
    lastCommentId() {
      return this.rearranged.length > 1
        ? this.rearranged[this.rearranged.length - 1].id
        : 0;
    },
    firstCommentId() {
      return this.rearranged.length > 1 ? this.rearranged[0].id : 0;
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
    },
    commentReplyId: {
      type: Number,
      required: true
    }
  },
  watch: {
    lastCommentId: function() {
      this.$nextTick(() => {
        this.$scrollTo("#vue-comments-list .last-comment", {
          container: "#vue-comments-list"
        });
      });
    },
    firstCommentId: function() {
      this.$nextTick(() => {
        this.$scrollTo("#vue-comments-list .first-comment", {
          container: "#vue-comments-list"
        });
      });
    }
  }
};
</script>
