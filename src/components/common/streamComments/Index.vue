<template>
  <div class="comments-list stream-comments-wrapper" v-if="comments.length">
    <perfect-scrollbar id="scroll" class="comments-list-scrolling">
      <Comment
        v-for="comment in comments"
        :key="comment.comment + comment.hideTime"
        :comment="comment"
      />

      <div class="comment stream-message">
        <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
          <span class="avatar__img">
            <img
              src="https://avnsocial-dev.s3.amazonaws.com/files/h/hv/hvt/hvtdzqnjkwmc3u3rf3ylcnn6gdhohf6n1555004518/avatar.jpg"
            />
          </span>
        </span>
        <div class="comment-content stream-message__head">
          <div class="comment-body">
            <span class="name">tester11</span>
            <span class="comment-text stream-message__text"
              ><span class="likes icn-item icn-size_md"></span> 10</span
            >
          </div>
        </div>
      </div>
      <div class="comment stream-message">
        <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
          <span class="avatar__img">
            <img
              src="https://avnsocial-dev.s3.amazonaws.com/files/h/hv/hvt/hvtdzqnjkwmc3u3rf3ylcnn6gdhohf6n1555004518/avatar.jpg"
            />
          </span>
        </span>
        <div class="comment-content stream-message__head">
          <div class="comment-body">
            <span class="name">tester11</span>
            <span class="comment-text stream-message__text"
              ><span class="icn-tips icn-item icn-size_md"></span> 10</span
            >
          </div>
        </div>
      </div>
      <div class="comment stream-message">
        <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
          <span class="avatar__img">
            <img
              src="https://avnsocial-dev.s3.amazonaws.com/files/h/hv/hvt/hvtdzqnjkwmc3u3rf3ylcnn6gdhohf6n1555004518/avatar.jpg"
            />
          </span>
        </span>
        <div class="comment-content stream-message__head">
          <div class="comment-body">
            <span class="name">tester11</span>
            <span class="comment-text stream-message__text"
              ><span class="looking icn-item icn-size_md"></span
            ></span>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import Comment from "@/components/common/streamComments/Item";
import takeRight from "lodash.takeright";
import UserMixin from "@/mixins/user";

export default {
  name: "StreamComments",
  mixins: [UserMixin],
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
