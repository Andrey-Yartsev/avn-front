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
        <AddComment :class="{hidden: !showAddCommentForm}" :sendNewComment="sendNewComment"></AddComment>
        <CommentsList :comments="item.comments || []" :shownCommentsCount="item.shownCommentsCount"></CommentsList>
    </div>
</template>

<script>
import AddComment from "@/components/common/post/addNewComment/Index";
import CommentsList from "@/components/common/post/commentsList/Index";
import Header from "@/components/common/post/header/Index";
import Media from "@/components/common/post/media/Index";
import Actions from "@/components/common/post/actions/Index";

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
    },
    isProfilePost: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getComments() {
      const { id, commentsCount } = this.item;

      if (commentsCount) {
        if (this.isProfilePost) {
          this.$store.dispatch("profile/home/getPostComments", {
            postId: id
          });
        } else {
          this.$store.dispatch("home/getPostComments", {
            postId: id
          });
        }
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
