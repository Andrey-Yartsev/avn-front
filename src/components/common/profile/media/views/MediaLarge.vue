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
    <div class="postPage-content withMinHeight">
      <div
        class="postPage-content__inside"
        :class="{ 'has-media': post.media }"
      >
        <div class="header-mobile" v-if="$mq === 'mobile'">
          <button
            v-if="isAuth()"
            class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
            @click="back"
          />
          <h1 class="page-title">Video</h1>
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
          v-on:clickOnDetailsView="() => {}"
          v-if="$mq === 'mobile'"
          :datetime="timePassed"
          :showCopy="!delayedPost"
          @openDropdown="dropdownOpened = true"
          @hideDropdown="dropdownOpened = false"
          :isAuthor="isAuthor"
          @switchToPreview="switchToPreview"
          :showPreview="showPreview"
          :view="'large'"
        />
        <h2
          v-html="post.title"
          v-if="$mq === 'mobile' && post.title.length !== 0"
          style="padding-left: 15px"
        />
        <p
          class="text hidden-desktop"
          v-html="post.text"
          v-if="$mq === 'mobile' && post.text.length !== 0"
        />
        <Media
          v-if="post.media"
          :medias="post.media"
          :shouldHasLink="false"
          :post="post"
          :authorId="post.author.id"
          mediaSize="full"
          :openModal="mediaClickHandler"
          :autoplay="false"
          @playCallback="playHandler"
          :showPreview="showPreview"
          :isAuthor="isAuthor"
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
            :showAddCommentForm="false"
            :showTip="false"
            @clickOnDetailsView="() => {}"
            @postShowCommentForm="mediaClickHandler"
            @postLike="() => {}"
            @toggleTip="() => {}"
            :isAuthor="isAuthor"
            @openBuyModal="mediaClickHandler"
          />
        </template>
        <div class="right-col" style="flexBasis: auto">
          <Header
            :class="'hidden-mobile'"
            :post="post"
            :from="from"
            v-if="$mq === 'desktop'"
            :showCopy="!delayedPost"
            :isAuthor="isAuthor"
            @switchToPreview="switchToPreview"
            :showPreview="showPreview"
            :view="'large'"
          />
          <div
            class="text hidden-mobile"
            v-if="$mq === 'desktop'"
            style="minHeight: 50px; display: block"
          >
            <h2 v-if="post.title" v-html="post.title" />
            <p v-if="post.text" v-html="post.text" />
          </div>
          <div class="post-capability" v-if="$mq === 'desktop'">
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
            <!-- <template v-if="showCommentPanel"> -->
            <Actions
              :post="post"
              :from="from"
              @openBuyModal="mediaClickHandler"
              :isAuthor="isAuthor"
            />
            <!-- </template> -->
          </div>
        </div>
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
import Header from "@/components/common/profile/media/header/Index";
import Actions from "@//components/common/profile/media/footer/Actions";
import Media from "@/components/common/profile/media/views/Media";
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
  data: () => ({
    commentPage: 0,
    popupView: true,
    dropdownOpened: false,
    currentCommentReply: null,
    showAddComment: true,
    viewCounted: false,
    showPreview: false
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
  computed: {
    postId() {
      return this.post.productId;
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
    },
    isAuthor() {
      if (!this.$store.state.auth.user) {
        return false;
      }
      return this.$props.post.author.id === this.$store.state.auth.user.id;
    }
  },
  methods: {
    mediaClickHandler() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "signup"
        });
        return;
      }
      if (this.$props.post.media.canView) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user.isPaymentCardConnected) {
          this.$store.dispatch("global/flashToast", {
            text: "You should add card in payment settings",
            type: "warning"
          });
          this.$router.push("/settings/payments");
          return;
        }

        this.$store.dispatch("modal/show", {
          name: "mediaPayConfirm",
          data: {
            price: this.$props.post.price,
            paymentType: "message",
            messageId: this.$props.post.productId
          }
        });
      }
    },
    back() {
      if (window.location.hash) {
        window.location.hash = "";
        return;
      }
      this.$router.push("/");
    },
    playHandler() {
      // if (this.isAuthor || this.viewCounted) {
      //   return;
      // }
      // console.log("update view counter");
      // this.$store.dispatch(
      //   "profile/media/incrementViewCounter",
      //   this.$props.post.productId,
      //   { root: true }
      // );
      // this.viewCounted = true;
    },
    switchToPreview() {
      this.showPreview = !this.showPreview;
    }
  }
};
</script>

<style lang="scss" scoped>
.postPage-content__inside {
  flex-flow: column nowrap !important;
  flex-basis: auto;
  & > div {
    width: 100% !important;
    margin: 0 !important;
  }
  & > div:last-child {
    max-width: 100%;
    .post-header {
      max-width: 100%;
      width: 100%;
    }
    width: 100%;
  }
}
.withMinHeight {
  min-height: auto;
}
</style>
