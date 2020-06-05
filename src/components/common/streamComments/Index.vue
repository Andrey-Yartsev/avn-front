<template>
  <div class="comments-list stream-comments-wrapper" v-if="comments.length">
    <perfect-scrollbar id="scroll" class="comments-list-scrolling">
      <Comment
        v-for="comment in comments"
        :key="comment.comment + comment.hideTime"
        :comment="comment"
      />
    </perfect-scrollbar>
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
      return takeRight(this.shownComments, this.count);
    }
  },
  props: {
    shownComments: {
      type: Array,
      required: true
    },
    count: {
      type: Number,
      required: true
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
    }
  }
};
</script>
