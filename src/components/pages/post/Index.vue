<template>
  <div v-if="post" class="post postPage">
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
      <div class="postComments">
        <template v-if="isAuth()" >
          <form class="comment-form"></form>
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
          ></Actions>
        </template>
        <template v-else >
          <div class="guest-comments-form">
            <p>Please login to leave comments or tips</p>
            <time class="date" :datetime="post.postedAt">{{ timePassed }} ago</time>
          </div>
        </template>
      </div> 
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";
import userMixin from "@/mixins/user";
import Header from "./header/Index";
import Media from "./media/Index";
import Actions from "./actions/Index";

export default {
  name: "PostPage",
  mixins: [userMixin],
  computed: {
    post() {
      return this.$store.state.post.currentPost;
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
    showAddCommentForm: false
  }),
  components: {
    Header,
    Media,
    Actions
  },
  created() {
    const postId = this.$route.params.postId;
    this.$store.dispatch("post/getPost", { postId });
  },
  methods: {
    likePost() {
      this.$store.dispatch("home/likePost", {
        postId: this.item.id,
        addLike: !this.item.isFavorite
      });
    }
  }
};
</script>
