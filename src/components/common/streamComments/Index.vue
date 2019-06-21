<template>
  <div class="comments-list stream-comments-wrapper" v-if="comments.length">
    <VuePerfectScrollbar id="scroll" class="comments-list-scrolling">
      <Comment
        v-for="comment in comments"
        :key="comment.comment + comment.hideTime"
        :comment="comment"
      />
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import Comment from "@/components/common/streamComments/Item";
import takeRight from "lodash.takeright";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import UserMixin from "@/mixins/user";

export default {
  name: "StreamComments",
  mixins: [UserMixin],
  components: {
    Comment,
    VuePerfectScrollbar
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
      const scroll = document.getElementById("scroll");
      const lastCommentIsMine = this.isOwner(
        this.shownComments[this.count - 1].user.id
      );

      if (!scroll) return;

      const isBottom =
        scroll.scrollHeight - scroll.scrollTop === scroll.clientHeight;

      if (lastCommentIsMine || (isBottom && !lastCommentIsMine)) {
        this.$nextTick(() => {
          scroll.scrollTop = scroll.scrollHeight;
        });
      }
    }
  }
};
</script>
