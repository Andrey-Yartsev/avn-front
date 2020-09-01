<template>
  <div>
    <div class="comments-list stream-comments-wrapper" v-if="comments.length">
      <perfect-scrollbar
        id="scroll"
        class="comments-list-scrolling"
        @click="togleCommentsView"
      >
        <Comment
          v-for="comment in comments"
          :key="comment.comment + comment.hideTime"
          :comment="comment"
        />
        <div
          v-if="hiddenCommentsCounter && showAllComments"
          class="comments-list-observer"
          v-observe-visibility="visibilityChanged"
        ></div>
      </perfect-scrollbar>
    </div>
    <div
      class="stream-comments-show-all"
      v-if="hiddenCommentsCounter && showAllComments"
      @click="showHiddenComments"
    >
      {{ hiddenCommentsCounter }} new comments
    </div>
  </div>
</template>

<script>
import Comment from "@/components/common/streamComments/Item";
import takeRight from "lodash.takeright";
import User from "@/mixins/user";

export default {
  name: "StreamComments",
  mixins: [User],
  components: {
    Comment
  },
  computed: {
    comments() {
      if (this.showAllComments) {
        return this.allComments;
      }
      return takeRight(this.shownComments, this.count);
    }
  },
  props: {
    shownComments: {
      type: Array,
      required: true
    },
    allComments: {
      type: Array
    },
    count: {
      type: Number,
      required: true
    },
    isStreamer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showAllComments: false,
      hiddenCommentsCounter: 0
    };
  },
  methods: {
    togleCommentsView() {
      if (this.isStreamer) {
        return;
      }
      this.showAllComments = !this.showAllComments;
      this.$nextTick(() => {
        if (this.shownComments) {
          this.scrollToBottom();
        }
      });
      this.hiddenCommentsCounter = 0;
    },
    scrollToBottom() {
      const scroll = document.getElementById("scroll");

      if (!scroll) return;

      scroll.scrollTop = scroll.scrollHeight;
    },
    showHiddenComments() {
      this.scrollToBottom();
      this.hiddenCommentsCounter = 0;
    },
    visibilityChanged(isVisible) {
      if (isVisible) {
        this.hiddenCommentsCounter = 0;
      }
    }
  },
  watch: {
    count() {
      if (!this.shownComments.length) {
        return;
      }

      const scroll = document.getElementById("scroll");

      const lastCommentIsMine = this.isOwner(
        this.shownComments[this.count - 1].user.id
      );

      if (!scroll) return;

      const isBottom =
        scroll.scrollHeight - scroll.scrollTop === scroll.clientHeight;

      if (lastCommentIsMine || (!isBottom && !lastCommentIsMine)) {
        this.$nextTick(() => {
          scroll.scrollTop = scroll.scrollHeight;
        });
      }
    },
    "allComments.length"() {
      if (!this.allComments.length || !this.showAllComments) {
        return;
      }
      const lastCommentIsMine = this.isOwner(
        this.allComments[this.allComments.length - 1].user.id
      );
      if (lastCommentIsMine) {
        setTimeout(() => {
          this.showHiddenComments();
        }, 200);
      } else {
        this.hiddenCommentsCounter += 1;
      }
    }
  }
};
</script>
