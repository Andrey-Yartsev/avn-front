export default {
  data: function() {
    return {
      showAddCommentForm: false,
      commentReplyUserName: "",
      commentReplyId: 0,
      showTip: false
    };
  },
  computed: {
    showSubscribeButton() {
      return !this.post.canViewMedia;
    }
  },
  methods: {
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        post: this.post,
        text: msg,
        answerTo: this.commentReplyId
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
      this.showTip = false;
      this.commentReplyUserName = "";
      this.commentReplyId = comment.id;
      setTimeout(() => {
        this.commentReplyUserName = comment.author.username;
      });
    },
    commentRemove(comment) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove comment",
          success: () => this.commentRemoving(comment)
        }
      });
    },
    commentRemoving(comment) {
      this.$store.dispatch(this.actionPrefix + "/removeComment", {
        postId: this.post.id,
        commentId: comment.id
      });
    },
    toggleTipForm() {
      this.showTip = !this.showTip;
      this.showAddCommentForm = false;
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
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
    }
  }
};
