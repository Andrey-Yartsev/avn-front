<template>
  <div class="comments-list stream-comments-wrapper" v-if="comments.length">
    <Comment
      v-for="comment in comments"
      :key="comment.comment + comment.hideTime"
      :comment="comment"
    />
  </div>
</template>

<script>
import Comment from "@/components/common/streamComments/Item";
import takeRight from "lodash.takeright";

export default {
  name: "StreamComments",
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
  }
};
</script>
