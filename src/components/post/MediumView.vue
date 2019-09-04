<template>
  <div
    :class="[
      'post',
      {
        'open-dropdown-inside': showDropdown,
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
          @openDropdawn="showDropdown = true"
          @hideDropdawn="showDropdown = false"
          :showCopy="!delayedPost"
        />
        <p
          class="text"
          :class="{ 'trunc-text': truncateText && !showTruncatedText }"
          v-html="post.text"
          ref="text"
        />
        <div class="trunc-toggle-btn" v-if="truncateText">
          <button @click="truncateToggle" class="trunc-toggle-link">
            {{ showTruncatedText ? "Collapse" : "More" }}
          </button>
        </div>
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
          :showCopy="!delayedPost"
          :from="from"
          :commentsBtnSelectable="true"
          :showAddCommentForm="showAddComment"
          :showTip="showTip"
          :openModal="openModal"
          @postShowCommentForm="toggleCommentForm"
          @postLike="likePost"
          @toggleTip="toggleTipForm"
        />
        <div v-else class="actions">
          <div class="datetime-value">
            <span
              class="post-datetime__icn icn-item icn-calendar icn-size_lg"
            />
            <span class="post-datetime__value">{{ formattedDate }}</span>
          </div>
        </div>
      </div>
      <AddComment
        v-if="showAddComment"
        :sendNewComment="sendNewComment"
        :userName="commentReplyUserName"
        @reset="commentReset"
      />
      <Tip
        :user="post.author"
        v-if="showTip"
        ref="tip"
        @cancel="closeTipForm"
        :tipId="`${post.id}`"
        class="tip-form_post"
      />
      <CommentsList
        v-if="post.commentsCount"
        :comments="comments"
        :commentsCount="post.commentsCount || 0"
        :commentReplyId="commentReplyId"
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
  name: "PostMedium",
  mixins: [ModalRouterGoto, User, PostCommon, PostOpen, UserSuggestionsInline],
  data() {
    return {
      showDropdown: false,
      // isVisible: undefined,
      height: undefined,
      truncateText: false,
      showTruncatedText: false
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
    },
    isVisible() {
      return this.post.isVisible;
    }
  },
  watch: {
    funded() {
      if (!this.showTipForm) {
        return;
      }
      this.closeTipForm();
    }
    // $mq() {
    //   if (this.$mq === "desktop" && !this.isVisible) {
    //     this.isVisible = true;
    //   }
    // }
  },
  methods: {
    toggleCommentForm() {
      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }
      this.toggleAddCommentForm();
      // this.showAddCommentForm = !this.showAddCommentForm;
      // this.showTip = false;
    },
    visibilityChanged(isVisible, entry) {
      if (this.$mq === "desktop") {
        return;
      }
      // this.isVisible = isVisible;
      this.$emit("visibilityChanged", {
        isVisible,
        id: parseInt(entry.target.id.replace(/p(\d+)/, "$1"))
      });
      this.height = entry.boundingClientRect.height;
    },
    truncateToggle() {
      this.showTruncatedText = !this.showTruncatedText;
    }
  },
  mounted() {
    if (this.$refs.text.getBoundingClientRect().height > 18 * 5 + 2) {
      this.truncateText = true;
    }
  }
};
</script>
