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
      </div>
      <Header
        :class="'hidden-desktop'"
        :postId="post.id"
        :user="post.author"
        :from="from"
        v-on:clickOnDetailsView="clickOnCommentForm"
        v-if="$mq === 'mobile'"
      />
      <p
        class="text hidden-desktop"
        v-html="post.text"
        v-if="$mq === 'mobile'"
      ></p>
      <Media
        v-if="post.media.length"
        :medias="post.media"
        :showSlider="post.canViewMedia"
        :shouldHasLink="false"
        :postId="post.id"
        mediaSize="full"
      />
      <div class="right-col">
        <Header
          :class="'hidden-mobile'"
          :postId="post.id"
          :user="post.author"
          :from="from"
          v-if="$mq === 'desktop'"
        />
        <p
          class="text hidden-mobile"
          v-html="post.text"
          v-if="$mq === 'desktop'"
        ></p>
        <CommentsList
          v-if="this.post.canComment"
          :comments="post.fullComments"
          :totalComments="post.commentsCount"
          :loading="commentsLoading"
          :getComments="getComments"
          v-on:commentReply="commentReply"
          v-on:likeComment="likeComment"
        />
        <template v-if="isAuth() && this.post.canFavorite">
          <Actions
            :post="post"
            v-on:postShowCommentForm="clickOnCommentForm"
            v-on:postLike="likePost"
            @toggleTip="showTip = !showTip"
          />
        </template>
      </div>
      <div class="comment-form-wrapper" v-if="this.post.canComment">
        <template v-if="isAuth()">
          <AddComment
            :sendNewComment="sendNewComment"
            :userName="commentReplyUserName"
          />
          <Tip
            v-if="showTip"
            :user="post.author"
            ref="tip"
            @cancel="closeTip"
          />
          <template v-if="!isOwner() && post.author.canEarn">
            <form
              class="tip-form hidden"
              :action="tipActionUrl"
              target="_blank"
            >
              <input type="hidden" name="type" value="tip" />
              <input type="hidden" name="id" :value="post.author.id" />
              <input type="hidden" name="access-token" :value="accessToken" />
              <span role="button" class="btn btn-cancel">Cancel</span>
              <div class="tip-amount-field">
                <input
                  name="amount"
                  class="tip-amount-input rounded"
                  type="text"
                  pattern="\d{1,5}(?:\.\d{0,2})?"
                  maxlength="8"
                  placeholder="Enter amount"
                />
              </div>
              <button type="submit" class="btn" disabled>Send tip</button>
            </form>
          </template>
        </template>
        <template v-else>
          <div class="guest-comments-form">
            <p>Please login to leave comments or funds</p>
            <time class="date" :datetime="post.postedAt"
              >{{ timePassed }} ago</time
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";
import User from "@/mixins/user";
import Header from "@/components/common/postParts/header/Index";
import Actions from "@/components/common/postParts/actions/Index";
import Media from "@/components/common/postParts/media/Index";
import CommentsList from "@/components/common/postParts/commentsListScrollable/Index";
import AddComment from "@/components/common/postParts/addNewComment/Index";
import Tip from "@/components/common/tip/User";

export default {
  name: "PostLastView",
  mixins: [User],
  computed: {
    postId() {
      return this.post.id;
    },
    actionPrefix() {
      return this.from;
    },
    timePassed() {
      return dateFns.distanceInWordsStrict(new Date(), this.post.postedAt);
    },
    tipActionUrl() {
      return "{{%API_HOST%}}/api2/v2/payments/link/direct";
    },
    accessToken() {
      return "accessToken";
    },
    commentsLoading() {
      return this.post.commentsLoading;
    }
  },
  data: () => ({
    commentPage: 0,
    showAddCommentForm: false,
    commentReplyUserName: "",
    showTip: false
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
      const className = this.showAddCommentForm ? "" : "lightbox-post";
      this.$emit("addExtraClassName", className);
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
      if (!this.post.canComment) return;
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
    setTimeout(() => {
      this.$root.ws.send({
        act: "collect",
        message: "view_post",
        data: {
          post_id: this.post.id,
          owner: this.post.author.id,
          duration: 1
        }
      });
    }, 2000);
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
