export default {
  data: function() {
    return {
      showAddCommentForm: false,
      commentReplyUserName: "",
      commentReplyId: 0,
      showTip: false
    };
  },
  methods: {
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        post: this.post,
        text: msg,
        answerTo: this.commentReplyId
      });
    },
    likePost() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }

      this.$store.dispatch(this.actionPrefix + "/likePost", {
        post: this.post,
        addLike: !this.post.isFavorite
      });
    },
    likeComment(data) {
      this.$store.dispatch(this.actionPrefix + "/likeComment", {
        postId: this.post.id,
        addLike: !data.isLiked,
        commentId: data.commentId
      });
    },
    commentReply(comment) {
      this.showAddCommentForm = true;
      this.commentReplyUserName = "";
      this.commentReplyId = comment.id;
      setTimeout(() => {
        this.commentReplyUserName = comment.author.username;
      });
    },
    toggleTipForm() {
      this.showTip = !this.showTip;
      this.showAddCommentForm = false;
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  }
};
