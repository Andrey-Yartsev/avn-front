<template>
  <div
    :class="[
      'post',
      {
        'open-dropdown-inside': showDropdawn,
        post_preparation: !post.isMediaReady,
        outofviewport: isVisible === false
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
    v-observe-visibility="visibilityChanged"
  >
    <div v-if="isVisible === false" :style="{ height: `${height}px` }" />
    <div class="post-wrapper" v-else>
      <div class="post-details">
        <Header
          :post="post"
          :from="from"
          @openDropdawn="showDropdawn = true"
          @hideDropdawn="showDropdawn = false"
          :showCopy="!delayedPost"
        />
        <p class="text" v-html="post.text" ref="text"></p>
        <Media
          v-if="medias.length"
          :medias="medias"
          :shouldHasLink="!delayedPost"
          :postId="post.id"
          :authorId="post.author.id"
          :openModal="openModal"
          mediaSize="preview"
        />
        <Actions
          v-if="!delayedPost"
          :post="post"
          v-on:postShowCommentForm="toggleCommentForm"
          v-on:postLike="likePost"
          @toggleTip="toggleTipForm"
          :openModal="openModal"
        />
        <div v-else class="actions">
          <div class="datetime-value">
            <span class="post-datetime__icn" />
            <span class="post-datetime__value">{{ formattedDate }}</span>
          </div>
        </div>
      </div>
      <AddComment
        v-if="showAddCommentForm"
        :sendNewComment="sendNewComment"
        :userName="commentReplyUserName"
      />
      <Tip
        :user="post.author"
        v-if="showTip"
        ref="tip"
        @cancel="closeTip"
        :tipId="`${post.id}`"
        class="tip-form_post"
      />
      <CommentsList
        v-if="post.commentsCount"
        :comments="post.comments || []"
        :commentsCount="post.commentsCount || 0"
        :clickOnShowMore="openModal"
        @commentReply="commentReply"
        @likeComment="likeComment"
        @commentRemove="commentRemove"
      />
    </div>
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
import PostOpen from "@/mixins/postOpen";
import PostCommon from "@/mixins/postCommon";
import UserSuggestionsInline from "@/mixins/userSuggestionsInline";
import moment from "moment";

export default {
  name: "Post",
  mixins: [ModalRouterGoto, User, PostCommon, PostOpen, UserSuggestionsInline],
  data() {
    return {
      showDropdawn: false,
      isVisible: undefined,
      height: undefined
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
      return this.post.media;
    },
    funded() {
      return this.$store.state.tip.funded;
    },
    formattedDate() {
      return `Scheduled for ${moment(this.post.scheduledDate).format(
        "MMM D, hh:mm a"
      )}`;
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
    toggleCommentForm() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }

      this.showAddCommentForm = !this.showAddCommentForm;
      this.showTip = false;
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;
      this.height = entry.boundingClientRect.height;
    }
  }
};
</script>
