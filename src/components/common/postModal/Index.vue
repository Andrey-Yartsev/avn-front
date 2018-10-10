<template>
  <Modal :onClose="close"> 
    <template slot="content">
      <div class="popup-container post post-popup">
        <div class="previous" @click="index -= 1" v-if="index > 0"></div>
        <div class="content">
          <div class="post postPage">
            <div class="header-mobile">
              <button class="header-return-btn"></button>
              <h1 class="page-title">Post</h1>
            </div>
            <Header :class="'hidden-desktop'" :postId="post.id" :user="post.author" />
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
              <Header :class="'hidden-mobile'" :postId="post.id" :user="post.author" />
              <p class="text hidden-mobile">
              {{ post.text }}
              </p>
              <CommentsList :comments="post.comments || []" :shownCommentsCount="post.shownCommentsCountFull"></CommentsList>
              <template v-if="isAuth()" >
                <AddComment :sendNewComment="sendNewComment" />
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
        </div>
        <button type="button" class="close" @click="close"></button>
        <div class="next" @click="index += 1" v-if="index + 1 < length"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import dateFns from "date-fns";
import userMixin from "@/mixins/user";
import Header from "@/components/common/post/header/Index";
import Actions from "@/components/common/post/actions/Index";
import Media from "@/components/common/post/media/Index";
import CommentsList from "@/components/common/post/commentsListFull/Index";
import AddComment from "@/components/common/post/addNewComment/Index";

export default {
  name: "PostModal",
  mixins: [userMixin],
  computed: {
    actionPrefix() {
      return this.from;
    },
    post() {
      return this.dataSrc.posts[this.index];
    },
    length() {
      return this.dataSrc.posts.length;
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
    postId: undefined,
    dataSrc: undefined,
    backUrl: undefined,
    index: 0
  }),
  components: {
    Modal,
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
    close() {
      window.history.replaceState({}, "post", this.backUrl);

      this.$store.dispatch("modal/hide", {
        name: "post"
      });
    },
    scroll() {
      this.$scrollTo(`[data-id="${this.post.id}"]`);
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        postId: this.post.id,
        text: msg
      });
    }
  },
  created() {
    const { postId, from, backUrl } = this.$store.state.modal.post.data;
    if (from === "profile/home") {
      this.dataSrc = this.$store.state.profile.home;
    }
    if (from === "home") {
      this.dataSrc = this.$store.state.home;
    }

    const post = this.dataSrc.posts.filter(({ id }) => id === postId)[0];

    this.from = from;
    this.postId = postId;
    this.backUrl = backUrl;
    this.index = this.dataSrc.posts.indexOf(post);
    window.history.replaceState({}, "post", `/post/${this.postId}`);
  },
  watch: {
    index: function() {
      this.scroll();
    }
  }
};
</script>
