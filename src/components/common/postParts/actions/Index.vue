<template>
  <div class="actions">
    <span
      :class="[{ active: post.isFavorite }, 'actions__btn']"
      @click="postLike"
    >
      <span
        class="btn-icon likes"
        v-tooltip="post.favoritesCount > 1 ? 'Likes' : 'Like'"
      ></span>
      {{ post.favoritesCount ? post.favoritesCount : "" }}
    </span>
    <span
      class="actions__btn comments-btn"
      :class="{ 'clickable-state': showTips }"
      @click="postShowCommentForm"
      v-if="post.canComment"
    >
      <span class="btn-icon comments" v-tooltip="'Comments'"></span>
      {{ post.commentsCount ? post.commentsCount : "" }}
    </span>
    <template
      v-if="!isOwner(post.author.id) && post.author.canEarn && $root.showTips"
    >
      <span class="actions__btn" @click="toggleTip"
        ><span class="btn-icon tips" v-tooltip="'Fund'"></span
      ></span>
    </template>
    <time class="timestamp">
      <a class="postLink" :href="`/post/${post.id}`" @click.prevent="openModal">
        {{ dateTime }}
      </a>
    </time>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import userMixin from "@/mixins/user";

export default {
  name: "Actions",
  mixins: [userMixin],
  props: {
    post: {
      type: Object,
      isRequired: true
    },
    openModal: {
      type: Function,
      default: () => {}
    },
    showTips: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dateTime() {
      return fromNow(this.post.postedAt);
    }
  },
  methods: {
    postLike() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("postLike");
    },
    postShowCommentForm() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("postShowCommentForm");
    },
    toggleTip() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("toggleTip");
    }
  }
};
</script>
