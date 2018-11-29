<template>
  <div :class="['post', {
      'open-dropdown-inside': showDropdawn,
      'post_preparation': !post.isMediaReady
      }]"
      :data-id="post.id">
    <div class="post-details">
      <Header
        :postId="post.id"
        :user="post.author"
        :from="from"
        @openDropdawn="showDropdawn = true"
        @hideDropdawn="showDropdawn = false"
      />
      <p class="text" v-html="post.text"></p>
      <Media
        v-if="medias.length"
        :medias="medias"
        :showSlider="post.canViewMedia"
        :shouldHasLink="true"
        :postId="post.id"
        :openModal="openModal"
        mediaSize="preview"
      />
      <Actions 
        :post="post" 
        v-on:postShowCommentForm="showForm"
        v-on:postLike="likePost"
        @toggleTip="showTip = !showTip"
        :openModal="openModal"
      />
      <Tip
        :user="post.author"
        v-if="showTip"
        ref="tip"
        @cancel="closeTip"
      />
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
import Tip from "@/components/common/tip/User";

export default {
  name: "Post",
  data: function() {
    return {
      showAddCommentForm: false,
      showDropdawn: false,
      showTip: false
    };
  },
  components: {
    CommentsList,
    AddComment,
    Actions,
    Header,
    Media,
    Tip
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
    },
    funded() {
      return this.$store.state.tip.funded;
    }
  },
  watch: {
    funded() {
      if (!this.showTip) {
        return;
      }
      this.closeTip();
    }
  },
  methods: {
    openModal() {
      if (!this.post.canViewMedia) {
        this.showSubcribeModal();
        return;
      }

      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
    },
    getComments() {
      const { id, commentsCount, canComment } = this.post;

      if (commentsCount && canComment) {
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
      if (!this.post.canViewMedia) {
        this.showSubcribeModal();
        return;
      }

      this.$store.dispatch(this.actionPrefix + "/likePost", {
        postId: this.post.id,
        addLike: !this.post.isFavorite
      });
    },
    showForm() {
      if (!this.post.canViewMedia) {
        this.showSubcribeModal();
        return;
      }

      this.showAddCommentForm = !this.showAddCommentForm;
    },
    showSubcribeModal() {
      this.$store.dispatch("modal/show", {
        name: "subscribe",
        data: this.post.author
      });
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  },
  created() {
    this.getComments();
  }
};
</script>
