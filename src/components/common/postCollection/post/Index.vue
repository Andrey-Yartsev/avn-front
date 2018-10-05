<template>
    <div class="post">
        <div class="post-details">
            <Header :postId="post.id" :user="post.author" />
            <p class="text">{{ post.text }}</p>
            <Media
              :medias="post.media"
              :showSlider="post.canViewMedia"
              :shouldHasLink="true"
              :postId="post.id"
              :openModal="openModal"
            />
            <Actions 
              :post="post" 
              v-on:postShowCommentForm="showAddCommentForm = !showAddCommentForm"
              v-on:postLike="likePost"
              :openModal="openModal"
            ></Actions>
        </div>
        <AddComment :class="{hidden: !showAddCommentForm}" :sendNewComment="sendNewComment"></AddComment>
        <CommentsList :comments="post.comments || []" :shownCommentsCount="post.shownCommentsCount"></CommentsList>
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
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    }
  },
  methods: {
    openModal() {
      this.$store.dispatch("modal/show", {
        name: "post",
        data: {
          postId: this.post.id,
          from: this.from,
          backUrl: this.$route.path
        }
      });
    },
    getComments() {
      const { id, commentsCount } = this.post;

      if (commentsCount) {
        this.$store.dispatch(this.actionPrefix + "/getPostComments", {
          postId: id
        });
      }
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        postId: this.post.id,
        text: msg
      });
    },
    likePost() {
      this.$store.dispatch(this.actionPrefix + "/likePost", {
        postId: this.post.id,
        addLike: !this.post.isFavorite
      });
    }
  },
  created() {
    this.getComments();
  }
};
</script>
