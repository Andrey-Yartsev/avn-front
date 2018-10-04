<template>
    <div class="post">
        <div class="post-details">
            <PostHeader :id="item.id" :user="item.author" :isProfilePost="isProfilePost"></PostHeader>
            <p class="text">{{ item.text }}</p>
            <div class="media">
                <template v-if="item.media.length > 1">
                  <div class="media-slider">
                    <figure :key="key" v-for="(value, key) in item.media" :class="[{ active: currentSlide === key }, 'media-item']" :data-index="key">
                      <component :is="getMediaViewType(value)" :media="value"></component>
                    </figure>
                  </div>
                </template>
                <template v-else >
                    <figure :key="key" v-for="(value, key) in item.media" class="media-item active">
                      <component :is="getMediaViewType(value)" :media="value"></component>
                    </figure>
                </template>
                <template v-if="item.media.length > 1">
                  <div class="media-slider-pagination">
                    <span :key="key" v-for="(value, key) in item.media" :class=" [{ active: key === currentSlide }, 'item']" @click="currentSlide = key"></span>
                  </div>
                  <div class="media-slider-navigation">
                    <span :class="[{hidden: currentSlide === 0}, 'btn-prev']" @click="currentSlide -= 1"></span>
                    <span :class="[{hidden: currentSlide === item.media.length - 1}, 'btn-next']" class="" @click="currentSlide += 1"></span>
                  </div>
                </template>
            </div>
            <Actions 
              :post="item" 
              v-on:postShowCommentForm="showAddCommentForm = !showAddCommentForm"
              v-on:postLike="likePost"
            ></Actions>
        </div>
        <AddComment :class="{hidden: !showAddCommentForm}" v-on:postAddComment="sendNewComment"></AddComment>
        <CommentsList :comments="item.comments || []" :shownCommentsCount="item.shownCommentsCount"></CommentsList>
    </div>
</template>

<script>
import AddComment from "./comments/AddComment";
import CommentsList from "./comments/CommentsList";
import PostHeader from "./PostHeader";
import Actions from "./Actions";
import LockedPicture from "./mediaContent/LockedPicture";
import Video from "./mediaContent/Video";
import Gif from "./mediaContent/Gif";
import Simple from "./mediaContent/Simple";

export default {
  name: "Post",
  data: function() {
    return {
      isShowPostDropdawn: false,
      currentSlide: 0,
      showAddCommentForm: false
    };
  },
  components: {
    CommentsList,
    AddComment,
    Actions,
    PostHeader,
    LockedPicture,
    Video,
    Gif,
    Simple
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isProfilePost: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actionPrefix() {
      return this.isProfilePost ? "profile/home" : "home";
    }
  },
  methods: {
    getMediaViewType(media) {
      switch (true) {
        case !media.canView:
          return "LockedPicture";
        case media.type === "video":
          return "Video";
        case media.type === "gif":
          return "Gif";
        default:
          return "Simple";
      }
    },
    getComments() {
      const { id, commentsCount } = this.item;

      if (commentsCount) {
        this.$store.dispatch(this.actionPrefix + "/getPostComments", {
          postId: id
        });
      }
    },
    sendNewComment(msg) {
      this.$store.dispatch(this.actionPrefix + "/sendPostComment", {
        postId: this.item.id,
        text: msg
      });
    },
    likePost() {
      this.$store.dispatch(this.actionPrefix + "/likePost", {
        postId: this.item.id,
        addLike: !this.item.isFavorite
      });
    }
  },
  created() {
    this.getComments();
  }
};
</script>
