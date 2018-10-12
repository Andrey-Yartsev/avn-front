<template>
  <div class="post postPage">
    <div class="header-mobile">
      <button class="header-return-btn"></button>
      <h1 class="page-title">Post</h1>
    </div>
    <Header
      :class="'hidden-desktop'"
      :postId="post.id"
      :user="post.author" 
      :from="from"
    />
    <p class="text hidden-desktop">
      {{ post.text }}
    </p>
    <Media
      :medias="post.media"
      :showSlider="post.canViewMedia"
      :shouldHasLink="false"
      :postId="post.id"
    />
    <div class="right-col">
      <Header
        :class="'hidden-mobile'"
        :postId="post.id"
        :user="post.author"
        :from="from"
      />
      <p class="text hidden-mobile">
      {{ post.text }}
      </p>
      <CommentsList
        :comments="post.comments || []"
        :shownCommentsCount="post.shownCommentsCountFull"
        v-on:commentReply="commentReply"
        v-on:likeComment="likeComment"
      />
      <template v-if="isAuth()" >
        <AddComment :sendNewComment="sendNewComment" :userName="commentReplyUserName"/>
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
        <Actions 
          :post="post" 
          v-on:postShowCommentForm="showAddCommentForm = !showAddCommentForm"
          v-on:postLike="likePost"
        />
      </template>
      <template v-else>
        <div class="guest-comments-form">
          <p>Please login to leave comments or tips</p>
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
    }
  },
  data: () => ({
    showAddCommentForm: false,
    commentReplyUserName: ""
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
    AddComment
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
    }
  }
};
</script>
