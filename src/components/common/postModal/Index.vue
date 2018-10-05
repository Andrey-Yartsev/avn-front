<template>
  <Modal :onClose="close"> 
    <template slot="content">
      <div class="popup-container post post-popup">
        <div class="previous"></div>
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
        </div>
        <button type="button" class="close" @click="close"></button>
        <div class="next"></div>
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

export default {
  name: "PostModal",
  mixins: [userMixin],
  computed: {
    backUrl() {
      return this.$store.state.modal.post.data.backUrl;
    },
    post() {
      const { postId, from } = this.$store.state.modal.post.data;
      let dataSrc;

      if (from === "profile/home") {
        dataSrc = this.$store.state.profile.home;
      }

      if (from === "home") {
        dataSrc = this.$store.state.home;
      }

      return dataSrc.posts.filter(({ id }) => id === postId)[0];
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
    Modal,
    Header,
    Media,
    Actions
  },
  methods: {
    likePost() {
      this.$store.dispatch("home/likePost", {
        postId: this.post.id,
        addLike: !this.post.isFavorite
      });
    },
    close() {
      window.history.replaceState({}, "post", this.backUrl);

      this.$store.dispatch("modal/hide", {
        name: "post"
      });
    }
  },
  created() {
    window.history.replaceState({}, "post", `/post/${this.post.id}`);
  }
};
</script>
