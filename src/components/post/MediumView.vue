<template>
  <div
    :class="[
      'post',
      {
        'open-dropdown-inside': showDropdawn,
        post_preparation: !post.isMediaReady
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
  >
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
      <Tip :user="post.author" v-if="showTip" ref="tip" @cancel="closeTip" />
    </div>
    <AddComment
      :class="{ hidden: !showAddCommentForm }"
      :sendNewComment="sendNewComment"
    ></AddComment>
    <CommentsList
      :comments="post.comments || []"
      :commentsCount="post.commentsCount || 0"
      :clickOnShowMore="openModal"
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
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import User from "@/mixins/user";

export default {
  name: "Post",
  mixins: [ModalRouterGoto, User],
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
      if (this.post.media[0] && this.post.media[0].locked) {
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
        this.showSubscribeModal();
        return;
      }

      if (!this.post.isMediaReady) {
        return;
      }

      this.goToModalRoute(`post/${this.post.id}/${this.from}`);
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        post: this.post,
        text: msg
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
    showForm() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }

      this.showAddCommentForm = !this.showAddCommentForm;
    },
    showSubscribeModal() {
      this.$store.dispatch("modal/show", {
        name: "subscribe",
        data: {
          user: this.post.author
        }
      });
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  }
};
</script>
