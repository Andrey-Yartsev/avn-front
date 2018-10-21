<template>
    <div class="post" :data-id="post.id">
        <div class="post-details">
            <Header
              :postId="post.id"
              :user="post.author"
              :from="from"
            />
            <p class="text">{{ post.text }}</p>
            <Media
              :medias="medias"
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
        <CommentsList
          :comments="post.comments || []"
          :shownCommentsCount="post.shownCommentsCount"
        />
    </div>
</template>

<script>
import AddComment from "@/components/common/postParts/addNewComment/Index";
import CommentsList from "@/components/common/postParts/commentsList/Index";
import Header from "@/components/common/postParts/header/Index";
import Media from "@/components/common/postParts/media/Index";
import Actions from "@/components/common/postParts/actions/Index";

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
    },
    medias() {
      if (!this.post.media.length) {
        return [];
      }
      if (this.post.media[0].locked) {
        return [this.post.media[0]];
      }
      return this.post.media;
    }
  },
  methods: {
    openModal() {
      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
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
