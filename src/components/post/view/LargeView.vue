<template>
  <div
    :class="[
      'post postPage',
      {
        post_preparation: !post.isMediaReady,
        dropdownOpened
      }
    ]"
  >
    <div class="postPage-content">
      <div
        class="postPage-content__inside"
        :class="{ 'has-media': post.media && post.media.length }"
      >
        <div class="header-mobile" v-if="$mq === 'mobile'">
          <button
            v-if="isAuth()"
            class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
            @click="back"
          />
          <h1 class="page-title">Post</h1>
          <a
            href="/login"
            @click.prevent="openLoginModal"
            class="btn border alt login hidden-desktop"
            v-if="!isAuth()"
            >Log in</a
          >
        </div>

        <Header
          :class="'hidden-desktop'"
          :post="post"
          :from="from"
          v-on:clickOnDetailsView="clickOnCommentForm"
          v-if="$mq === 'mobile'"
          :datetime="timePassed"
          :showCopy="!delayedPost"
          @openDropdown="dropdownOpened = true"
          @hideDropdown="dropdownOpened = false"
        />
        <p
          class="text hidden-desktop"
          v-html="post.text"
          v-if="$mq === 'mobile' && post.text.length !== 0"
        />
        <Media
          v-if="post.media && post.media.length"
          :medias="post.media"
          :shouldHasLink="false"
          :post="post"
          :authorId="post.author.id"
          mediaSize="full"
        />
        <div
          class="text text_posttime"
          v-if="$mq === 'mobile' && !delayedPost && !isAuth()"
        >
          <time class="timestamp">{{ timePassed }}</time>
        </div>
        <template v-if="!delayedPost && isAuth() && $mq === 'mobile'">
          <Actions
            :post="post"
            :from="from"
            :showCopy="!delayedPost"
            :showAddCommentForm="showAddComment"
            :showTip="showTip"
            @clickOnDetailsView="clickOnCommentForm"
            @postShowCommentForm="clickOnCommentForm"
            @postLike="likePost"
            @toggleTip="_toggleTipForm"
          />
        </template>
        <div class="right-col">
          <Header
            :class="'hidden-mobile'"
            :post="post"
            :from="from"
            v-if="$mq === 'desktop'"
            :showCopy="!delayedPost"
          />

          <div
            class="subscribe-view-post"
            v-if="isAuth() && showSubscribeButton"
          >
            <span role="button" class="btn lg" @click="subscribe"
              >Subscribe to view</span
            >
          </div>

          <div class="text hidden-mobile" v-if="$mq === 'desktop'">
            <p v-if="post.text" v-html="post.text" />
            <div class="post-time" v-if="!delayedPost && !isAuth()">
              <time class="timestamp">{{ timePassed }}</time>
            </div>
          </div>
          <CommentsList
            v-if="!delayedPost && post.canComment"
            :comments="post.fullComments"
            :totalComments="post.commentsCount"
            :loading="commentsLoading"
            :getComments="getComments"
            :commentReplyId="commentReplyId"
            @commentReply="commentReply"
            @likeComment="likeComment"
            @commentRemove="commentRemove"
            :canComment="post.canComment"
          />
          <div v-if="delayedPost" class="actions">
            <div class="datetime-value">
              <span
                class="post-datetime__icn icn-item icn-calendar icn-size_lg"
              />
              <span class="post-datetime__value">{{ formattedDate }}</span>
            </div>
          </div>

          <div class="post-capability" v-if="$mq === 'desktop'">
            <template v-if="showCommentPanel">
              <div class="comment-form-wrapper">
                <AddComment
                  v-if="post.canComment && !showTip"
                  :sendNewComment="sendNewComment"
                  :userName="commentReplyUserName"
                  @reset="commentReset"
                />
                <Tip
                  v-if="showTip || (!post.canComment && this.canSendTips)"
                  :user="post.author"
                  ref="tip"
                  @cancel="closeTipForm"
                  :tipId="`${post.id}`"
                  class="tip-form_post"
                />
              </div>
            </template>
            <div class="comment-form-wrapper" v-if="!delayedPost && !isAuth()">
              <div class="guest-comments-form">
                <button
                  class="btn border btn_fix-width-sm"
                  @click.prevent="openLoginModal"
                >
                  Log in
                </button>
                <button
                  class="btn border alt btn_fix-width-sm"
                  @click.prevent="openSingupModal"
                >
                  Sign up
                </button>
              </div>
            </div>
            <template v-if="showCommentPanel">
              <Actions
                :post="post"
                :from="from"
                :showCopy="!delayedPost"
                :showTip="showTip"
                :commentsBtnSelectable="true"
                :showAddCommentForm="showAddComment"
                @clickOnDetailsView="clickOnCommentForm"
                @postShowCommentForm="clickOnCommentForm"
                @postLike="likePost"
                @toggleTip="_toggleTipForm"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="post-capability" v-if="$mq === 'mobile' && showCommentPanel">
      <div class="comment-form-wrapper">
        <AddComment
          v-if="post.canComment && !showTip"
          :sendNewComment="sendNewComment"
          :userName="commentReplyUserName"
          @reset="commentReset"
        />
        <Tip
          v-if="showTip || (!post.canComment && this.canSendTips)"
          :user="post.author"
          ref="tip"
          @cancel="closeTipForm"
          :tipId="`${post.id}`"
          class="tip-form_post"
        />
      </div>
    </div>
    <div
      class="post-capability"
      v-if="!delayedPost && $mq === 'mobile' && !isAuth()"
    >
      <div class="comment-form-wrapper">
        <div class="guest-comments-form">
          <a
            href="/login"
            @click.prevent="openLoginModal"
            class="btn border btn_fix-width-sm"
            >Log in</a
          >
          <a
            href="/register"
            @click.prevent="openSingupModal"
            class="btn border alt btn_fix-width-sm"
            >Sign up</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import User from "@/mixins/user";
import Header from "@/components/post/parts/header/Index";
import Actions from "@/components/post/parts/actions/Index";
import Media from "@/components/post/parts/media/Index";
import CommentsList from "@/components/post/parts/commentsListScrollable/Index";
import AddComment from "@/components/post/parts/addNewComment/Index";
import Tip from "@/components/common/tip/User";
import PostStat from "@/mixins/post/stat";
import PostCommon from "@/mixins/post/common";
import postOpen from "@/mixins/post/open";
import moment from "moment";
import ModalRouterParams from "@/mixins/modalRouter/params";

export default {
  name: "PostLastView",
  mixins: [User, PostCommon, postOpen, PostStat, ModalRouterParams],
  computed: {
    postId() {
      return this.post.id;
    },
    actionPrefix() {
      return this.from;
    },
    timePassed() {
      return fromNow(this.post.postedAt);
    },
    tipActionUrl() {
      return "{{%API_HOST%}}/api2/v2/payments/link/direct";
    },
    accessToken() {
      return "accessToken";
    },
    commentsLoading() {
      return this.post.commentsLoading;
    },
    delayedPost() {
      return !!this.post.scheduledDate;
    },
    formattedDate() {
      return `Scheduled for ${moment(this.post.scheduledDate).format(
        "MMM D, hh:mm a"
      )}`;
    },
    canSendTips() {
      return (
        !this.isOwner(this.post.author.id) &&
        this.post.author.canEarn &&
        this.$root.showTips
      );
    },
    showCommentPanel() {
      return (
        !this.delayedPost &&
        this.isAuth() &&
        (this.canSendTips || this.post.canComment)
      );
    },
    showSubscribeButton() {
      return !this.post.canViewMedia;
    }
  },
  data: () => ({
    commentPage: 0,
    popupView: true,
    dropdownOpened: false,
    currentCommentReply: null,
    showAddComment: true
  }),
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
  components: {
    Header,
    Media,
    CommentsList,
    Actions,
    AddComment,
    Tip
  },
  methods: {
    clickOnCommentForm() {
      this.showAddCommentForm();
      // this.showAddComment = !this.showAddComment;
      // this.showTip = false;
      if (this.popupView) {
        const className = this.showAddComment ? "" : "lightbox-post";
        this.$emit("addExtraClassName", className);
      }
      this.popupView = false;
    },
    _toggleTipForm() {
      this.toggleTipForm();
      // this.showTip = !this.showTip;
      // this.showAddComment = false;
      if (this.popupView) {
        const className = this.showTip ? "" : "lightbox-post";
        this.$emit("addExtraClassName", className);
      }
      this.popupView = false;
    },
    back() {
      if (window.location.hash) {
        window.location.hash = "";
        return;
      }
      this.$router.push("/");
    },
    getComments() {
      if (!this.post.canComment || this.delayedPost) return;
      this.commentPage += 1;
      this.$store.dispatch(this.actionPrefix + "/getPostComments", {
        postId: this.post.id,
        page: this.commentPage,
        marker: this.post.commentMarker
      });
    },
    init() {
      this.commentPage = 0;

      this.$store.commit(this.actionPrefix + "/resetComments", {
        postId: this.postId
      });

      this.getComments();
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.$store.commit(this.actionPrefix + "/resetComments", {
      postId: this.postId
    });
  },
  watch: {
    postId() {
      this.init();
    }
  }
};
</script>
