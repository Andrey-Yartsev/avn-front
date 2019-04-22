<template>
  <div
    :class="[
      'post postPage',
      {
        post_preparation: !post.isMediaReady
      }
    ]"
  >
    <div class="postPage-content">
      <div class="header-mobile" v-if="$mq === 'mobile'">
        <button class="header-return-btn" @click="back"></button>
        <h1 class="page-title">Post</h1>
        <router-link to="/login" class="btn border alt login hidden-desktop"
          >Log in</router-link
        >
      </div>
      <Header
        :class="'hidden-desktop'"
        :postId="post.id"
        :user="post.author"
        :from="from"
        v-on:clickOnDetailsView="clickOnCommentForm"
        v-if="$mq === 'mobile'"
        :datetime="timePassed"
        :showCopy="!delayedPost"
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
      <div class="right-col">
        <Header
          :class="'hidden-mobile'"
          :postId="post.id"
          :user="post.author"
          :from="from"
          v-if="$mq === 'desktop'"
          :showCopy="!delayedPost"
        />
        <p
          class="text hidden-mobile"
          v-html="post.text"
          v-if="$mq === 'desktop'"
        />
        <CommentsList
          v-if="!delayedPost && post.canComment"
          :comments="post.fullComments"
          :totalComments="post.commentsCount"
          :loading="commentsLoading"
          :getComments="getComments"
          v-on:commentReply="commentReply"
          v-on:likeComment="likeComment"
        />
        <template v-if="!delayedPost && isAuth() && post.canFavorite">
          <Actions
            :post="post"
            v-on:postShowCommentForm="clickOnCommentForm"
            v-on:postLike="likePost"
            @toggleTip="showTip = !showTip"
          />
        </template>
        <div v-if="delayedPost" class="actions">
          <div class="datetime-value">
            <span class="post-datetime__value">{{ formattedDate }}</span>
          </div>
        </div>
      </div>
      <div
        class="comment-form-wrapper"
        v-if="!delayedPost && post.canComment && isAuth()"
      >
        <AddComment
          :sendNewComment="sendNewComment"
          :userName="commentReplyUserName"
        />
        <Tip
          v-if="showTip"
          :user="post.author"
          ref="tip"
          @cancel="closeTip"
          :tipId="`${post.id}`"
          class="tip-form_post"
        />
      </div>
      <div class="comment-form-wrapper" v-if="!delayedPost && !isAuth()">
        <div class="guest-comments-form">
          <p>Please login to leave comments</p>
          <time class="timestamp">{{ timePassed }}</time>
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
import moment from "moment";

export default {
  name: "PostLastView",
  mixins: [User, PostStat],
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
    }
  },
  data: () => ({
    commentPage: 0,
    showAddCommentForm: false,
    commentReplyUserName: "",
    showTip: false,
    popupView: true
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
    },
    likePost() {
      this.$store.dispatch(this.actionPrefix + "/likePost", {
        post: this.post,
        addLike: !this.post.isFavorite
      });
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        post: this.post,
        text: msg
      });
    },
    commentReply(userName) {
      this.commentReplyUserName = "";
      setTimeout(() => {
        this.commentReplyUserName = userName;
      });
    },
    likeComment(data) {
      this.$store.dispatch(this.actionPrefix + "/likeComment", {
        postId: this.post.id,
        addLike: !data.isLiked,
        commentId: data.commentId
      });
    },
    back() {
      if (window.location.hash) {
        window.location.hash = "";
        return;
      }
      this.$router.push("/");
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
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
