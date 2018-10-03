<template>
    <div class="post">
        <div class="post-details">
            <Header :postId="item.id" :user="item.author" />
            <p class="text">{{ item.text }}</p>
            <Media
              :medias="item.media"
              :showSlider="item.canViewMedia"
              :shouldHasLink="true"
              :postId="item.id"
            />
            <Actions 
              :post="item" 
              v-on:postShowCommentForm="showAddCommentForm = !showAddCommentForm"
              v-on:postLike="likePost"
            ></Actions>
        </div>
        <AddComment :class="{hidden: !showAddCommentForm}" v-on:postAddComment="sendNewComment"></AddComment>
        <CommentsList :comments="item.comments || []" :shownCommentsCount="item.shownCommentsCount"></CommentsList>
    </div>
</template>

<script>
import AddComment from "./comments/AddComment";
import CommentsList from "./comments/CommentsList";
import Header from "@/components/pages/post/Header/Index";
import Media from "@/components/pages/post/Media/Index";
import Actions from "@/components/pages/post/Actions/Index";

export default {
  name: "Post",
  data: function() {
    return {
      showAddCommentForm: false
    };
  },
  components: {
    CommentsList,
    AddComment,
    Actions,
    Header,
    Media
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getComments() {
      const { id, commentsCount } = this.item;

      if (commentsCount) {
        this.$store.dispatch("home/getPostComments", { postId: id });
      }
    },
    sendNewComment(msg) {
      this.$store.dispatch("home/sendPostComment", {
        postId: this.item.id,
        text: msg
      });
    },
    likePost() {
      this.$store.dispatch("home/likePost", {
        postId: this.item.id,
        addLike: !this.item.isFavorite
      });
    }
  },
  created() {
    this.getComments();
  }
};
</script>
