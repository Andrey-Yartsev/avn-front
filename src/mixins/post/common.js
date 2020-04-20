const initData = {
  showAddComment: false,
  showTip: false,
  commentReplyUserName: "",
  commentReplyId: 0
};

import User from "@/mixins/user";

export default {
  mixins: [User],
  data: function() {
    return {
      ...initData
    };
  },
  computed: {
    comments() {
      return this.post.comments || [];
    },
    showSubscribeButton() {
      return !this.post.canViewMedia;
    }
  },
  watch: {},
  methods: {
    showAddCommentForm() {
      this.hideTipForm();
      this.showAddComment = true;
    },
    hideAddCommentForm() {
      this.showAddComment = false;
      this.resetCommentReply();
    },
    resetCommentReply() {
      this.commentReplyId = initData.commentReplyId;
      this.commentReplyUserName = initData.commentReplyUserName;
    },
    showTipForm() {
      this.hideAddCommentForm();
      this.showTip = true;
    },
    hideTipForm() {
      this.showTip = false;
    },
    toggleAddCommentForm(comment) {
      comment = comment || {
        id: initData.commentReplyId,
        author: {
          username: initData.commentReplyUserName
        }
      };

      if (
        (comment.id === 0 || this.commentReplyId === comment.id) &&
        this.showAddComment
      ) {
        this.hideAddCommentForm();
      } else {
        new Promise(resolve => {
          this.showAddCommentForm();
          resolve();
        }).then(() => {
          this.commentReplyId = comment.id;
          this.commentReplyUserName = comment.author.username;
        });
      }
    },
    sendNewComment(msg) {
      this.$store.dispatch("comments/sendNewComment", {
        actionPrefix: this.actionPrefix,
        post: this.post,
        msg,
        commentReplyId: this.commentReplyId
      });
    },
    subscribe() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
      }
    },
    likePost() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal(this._likePost);
        return;
      }
      this._likePost();
    },
    _likePost() {
      this.$store.dispatch("comments/likePost", {
        actionPrefix: this.actionPrefix,
        post: this.post
      });
    },
    likeComment(data) {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "signup" });
        return;
      }
      this.$store.dispatch("comments/likeComment", {
        actionPrefix: this.actionPrefix,
        postId: this.post.id,
        commentId: data.commentId,
        addLike: !data.isLiked
      });
    },
    commentReply(comment) {
      this.hideTipForm();
      this.toggleAddCommentForm(comment);
    },
    commentRemove(comment) {
      this.$store.dispatch("comments/commentRemove", {
        actionPrefix: this.actionPrefix,
        postId: this.post.id,
        commentId: comment.id,
        confirmBlockUser: true,
        author: comment.author
      });
    },
    toggleTipForm() {
      if (this.showTip) {
        this.hideTipForm();
      } else {
        this.showTipForm();
      }
    },
    closeTipForm() {
      this.hideTipForm();
      if (this.$refs.tip) {
        this.$refs.tip.reset();
      }
    },
    openLoginModal() {
      this.$store.dispatch("modal/show", {
        name: "login"
      });
    },
    openSingupModal() {
      this.$store.dispatch("modal/show", {
        name: "signup"
      });
    },
    commentReset() {
      this.resetCommentReply();
    }
  }
};
