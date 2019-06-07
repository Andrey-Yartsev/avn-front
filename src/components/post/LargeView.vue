<template>
  <div
    :class="[
      'post postPage',
      {
        post_preparation: !post.isMediaReady,
        dropdawnOpened
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
          ></button>
          <h1 class="page-title">Post</h1>
          <router-link to="/login" class="btn border alt login hidden-desktop"
            >Log in</router-link
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
          @openDropdawn="dropdawnOpened = true"
          @hideDropdawn="dropdawnOpened = false"
        />
        <p
          class="text hidden-desktop"
          v-html="post.text"
          v-if="$mq === 'mobile'"
        ></p>
        <Media
          v-if="post.media && post.media.length"
          :medias="post.media"
          :shouldHasLink="false"
          :postId="post.id"
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
            :showTips="showTip"
            @postShowCommentForm="clickOnCommentForm"
            @postLike="likePost"
            @toggleTip="toggleTipForm"
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
            @commentReply="commentReply"
            @likeComment="likeComment"
            @commentRemove="commentRemove"
          />
          <div v-if="delayedPost" class="actions">
            <div class="datetime-value">
              <span class="post-datetime__icn icn-item icn-calendar" />
              <span class="post-datetime__value">{{ formattedDate }}</span>
            </div>
          </div>

          <div
            class="post-capability"
            v-if="$mq === 'desktop' && showCommentPanel"
          >
            <div class="comment-form-wrapper">
              <AddComment
                v-if="post.canComment && !showTip"
                :sendNewComment="sendNewComment"
                :userName="commentReplyUserName"
              />
              <Tip
                v-if="showTip || (!post.canComment && this.canSendTips)"
                :user="post.author"
                ref="tip"
                @cancel="closeTip"
                :tipId="`${post.id}`"
                class="tip-form_post"
              />
            </div>
            <div class="comment-form-wrapper" v-if="!delayedPost && !isAuth()">
              <div class="guest-comments-form">
                <button
                  class="btn border btn_fix-width-sm"
                  @click.prevent="openLoginModal"
                >
                  Login
                </button>
                <button
                  class="btn border alt btn_fix-width-sm"
                  @click.prevent="openSingupModal"
                >
                  Sing up
                </button>
              </div>
            </div>
            <template v-if="!delayedPost && isAuth()">
              <Actions
                :post="post"
                :showTips="showTip"
                @postShowCommentForm="clickOnCommentForm"
                @postLike="likePost"
                @toggleTip="toggleTipForm"
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
        />
        <Tip
          v-if="showTip || (!post.canComment && this.canSendTips)"
          :user="post.author"
          ref="tip"
          @cancel="closeTip"
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
          <button
            class="btn border btn_fix-width-sm"
            @click.prevent="openLoginModal"
          >
            Login
          </button>
          <button
            class="btn border alt btn_fix-width-sm"
            @click.prevent="openSingupModal"
          >
            Sing up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import User from "@/mixins/user";
import Header from "@/components/common/postParts/header/Index";
import Actions from "@/components/common/postParts/actions/Index";
import Media from "@/components/common/postParts/media/Index";
import CommentsList from "@/components/common/postParts/commentsListScrollable/Index";
import AddComment from "@/components/common/postParts/addNewComment/Index";
import Tip from "@/components/common/tip/User";
import PostStat from "@/mixins/postStat";
import PostCommon from "@/mixins/postCommon";
import postOpen from "@/mixins/postOpen";
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
    }
  },
  data: () => ({
    commentPage: 0,
    popupView: true,
    dropdawnOpened: false
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
      this.showAddCommentForm = !this.showAddCommentForm;
      this.showTip = false;
      if (this.popupView) {
        const className = this.showAddCommentForm ? "" : "lightbox-post";
        this.$emit("addExtraClassName", className);
      }
      this.popupView = false;
    },
    toggleTipForm() {
      this.showTip = !this.showTip;
      this.showAddCommentForm = false;
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
