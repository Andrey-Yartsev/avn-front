<template>
  <div 
      :class="['post postPage', {
        'post_preparation': !post.isMediaReady
      }]"
    >
    <div class="postPage-content">
      <div class="header-mobile">
        <button class="header-return-btn" @click="back"></button>
        <h1 class="page-title">Post</h1>
      </div>
      <Header
        :class="'hidden-desktop'"
        :postId="post.id"
        :user="post.author"
        :from="from"
      />
      <p class="text hidden-desktop" v-html="post.text"></p>
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
        />
        <p class="text hidden-mobile" v-html="post.text"></p>
        <CommentsList
          :comments="post.comments || []"
          :shownCommentsCount="post.shownCommentsCountFull"
          v-on:commentReply="commentReply"
          v-on:likeComment="likeComment"
          :loading="commentsLoading"
          v-if="this.post.canComment"
        />
        <template v-if="isAuth() && this.post.canFavorite" >
          <Actions
            :post="post"
            v-on:postShowCommentForm="showAddCommentForm = !showAddCommentForm"
            v-on:postLike="likePost"
            @toggleTip="showTip = !showTip"
          />
        </template>
      </div>
    </div>
    <div class="comment-form-wrapper" v-if="this.post.canComment">
      <template v-if="isAuth()" >
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
          <form class="tip-form hidden" :action="tipActionUrl" target="_blank">
            <input type="hidden" name="type" value="tip" />
            <input type="hidden" name="id" :value="post.author.id" />
            <input type="hidden" name="access-token" :value="accessToken" />
            <span role="button" class="btn btn-cancel">Cancel</span>
            <div class="tip-amount-field">
              <input name="amount" class="tip-amount-input rounded" type="text" pattern="\d{1,5}(?:\.\d{0,2})?" maxlength="8" placeholder="Enter amount">
            </div>
            <button type="submit" class="btn" disabled>Send tip</button>
          </form>
        </template>
      </template>
      <template v-else>
        <div class="guest-comments-form">
          <p>Please login to leave comments or funds</p>
          <time class="date" :datetime="post.postedAt">{{ timePassed }} ago</time>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";
import userMixin from "@/mixins/user";
import Header from "@/components/common/postParts/header/Index";
import Actions from "@/components/common/postParts/actions/Index";
import Media from "@/components/common/postParts/media/Index";
import CommentsList from "@/components/common/postParts/commentsListScrollable/Index";
import AddComment from "@/components/common/postParts/addNewComment/Index";
import Tip from "@/components/common/tip/User";

export default {
  name: "PostLastView",
  mixins: [userMixin],
  computed: {
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
    likePost() {
      this.$store.dispatch(this.actionPrefix + "/likePost", {
        postId: this.post.id,
        addLike: !this.post.isFavorite
      });
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        postId: this.post.id,
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
    }
  }
};
</script>
