<template>
  <div
    :class="[
      'post',
      {
        'open-dropdown-inside': showDropdown || showFooterDropdown,
        post_preparation: !post.isMediaReady
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
  >
    <div class="post-wrapper">
      <div class="post-details">
        <Header
          :post="post"
          :from="from"
          :isReposted="isReposted"
          @openDropdown="showDropdown = true"
          @hideDropdown="showDropdown = false"
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
        <LinksPreviewList :text="post.text" />
        <PostTipsGoal
          v-if="post.tipsGoal && post.tipsGoal.isEnabled"
          :data="post.tipsGoal"
        />
        <slot v-if="isInnerPost"></slot>
        <template v-else>
          <Media
            v-if="medias && medias.length"
            :medias="medias"
            :shouldHasLink="!delayedPost"
            :post="post"
            :authorId="post.author.id"
            :openModal="openModal"
            mediaSize="preview"
            :autoplay="from === 'postQueue' && false"
          />
        </template>
        <template v-if="!isReposted">
          <Actions
            v-if="!delayedPost"
            :post="post"
            :showCopy="!delayedPost"
            :from="from"
            :commentsBtnSelectable="true"
            :showAddCommentForm="showAddComment"
            :showTip="showTip"
            :openModal="openModal"
            :postView="'medium'"
            @postShowCommentForm="toggleCommentForm"
            @postLike="likePost"
            @toggleTip="toggleTipForm"
            @openFooterDropdown="openFooterDropdown"
            @hideFooterDropdown="hideFooterDropdown"
          />
          <div v-else class="actions">
            <div class="datetime-value">
              <span
                class="post-datetime__icn icn-item icn-calendar icn-size_lg"
              />
              <span class="post-datetime__value">{{ formattedDate }}</span>
            </div>
          </div>
        </template>
      </div>
      <AddComment
        v-if="showAddComment"
        :sendNewComment="sendNewComment"
        :userName="commentReplyUserName"
        @reset="commentReset"
        :author="post.author"
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
        v-if="post.commentsCount && !isReposted"
        :comments="comments"
        :commentsCount="post.commentsCount || 0"
        :commentReplyId="commentReplyId"
        :clickOnShowMore="openModal"
        @commentReply="commentReply"
        @likeComment="likeComment"
        @commentRemove="commentRemove"
        :canComment="post.canComment"
      />
    </div>
  </div>
</template>

<script>
import AddComment from "@/components/post/parts/addNewComment/Index";
import CommentsList from "@/components/post/parts/commentsList/Index";
import Header from "@/components/post/parts/header/Index";
import Media from "@/components/post/parts/media/Index";
import Actions from "@/components/post/parts/actions/Index";
import Tip from "@/components/common/tip/User";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import User from "@/mixins/user";
import PostOpen from "@/mixins/post/open";
import PostCommon from "@/mixins/post/common";
import UserSuggestionsInline from "@/mixins/userSuggestionsInline";
import { format } from "date-fns";
import LinksPreviewList from "@/components/post/parts/linksPreviewList/Index";
import PostTipsGoal from "@/components/post/parts/tipsGoal/Index";
import PayAction from "@/mixins/payAction";

export default {
  name: "PostMedium",
  mixins: [
    ModalRouterGoto,
    User,
    PostCommon,
    PostOpen,
    UserSuggestionsInline,
    PayAction
  ],
  data() {
    return {
      showDropdown: false,
      showFooterDropdown: false,
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
    Tip,
    LinksPreviewList,
    PostTipsGoal
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    isReposted: Boolean
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    medias() {
      if (!this.post.media || !this.post.media.length) {
        return [];
      }
      return this.post.media;
    },
    funded() {
      return this.$store.state.tip.funded;
    },
    formattedDate() {
      return (
        "Scheduled for " +
        format(new Date(this.post.scheduledDate), "MMM d, h:mm aaaa")
      );
    },
    isVisible() {
      return this.post.isVisible;
    },
    isInnerPost() {
      return this.$slots.default;
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
    // visibilityChanged(isVisible, entry) {
    //   if (this.$mq === "desktop" || this.isReposted) {
    //     return;
    //   }
    //   this.$emit("visibilityChanged", {
    //     isVisible,
    //     id: parseInt(entry.target.id.replace(/p(\d+)/, "$1"))
    //   });
    //   this.height = entry.boundingClientRect.height;
    // },
    truncateToggle() {
      this.showTruncatedText = !this.showTruncatedText;
    },
    addHandlersToTags() {
      if (!this.$refs.text) {
        return;
      }
      const tags = [...this.$refs.text.querySelectorAll("[href^='/hashtag']")];
      tags.forEach(item => {
        item.addEventListener("click", this.tagEventListener);
      });
    },
    removeHandlersFromTags() {
      if (!this.$refs.text) {
        return;
      }
      const tags = [...this.$refs.text.querySelectorAll("[href^='/hashtag']")];
      tags.forEach(item =>
        item.removeEventListener("click", this.tagEventListener)
      );
    },
    tagEventListener(e) {
      e.preventDefault();
      const linkUrl = e.target.getAttribute("href");
      this.$router.push(linkUrl);
    },
    openFooterDropdown() {
      this.showFooterDropdown = true;
    },
    hideFooterDropdown() {
      this.showFooterDropdown = false;
    }
  },
  mounted() {
    if (!this.$refs.text) {
      return;
    }
    if (this.$refs.text.getBoundingClientRect().height > 18 * 8) {
      this.truncateText = true;
    }
    this.addHandlersToTags();
  },
  beforeDestroy() {
    this.removeHandlersFromTags();
  }
};
</script>
