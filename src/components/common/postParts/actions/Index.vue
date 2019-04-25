<template>
  <div class="actions">
    <span
      :class="[{ active: post.isFavorite }, 'actions__btn']"
      @click="postLike"
    >
      <span class="btn-icon likes" v-tooltip="'Like'"></span>
      {{ post.favoritesCount }}
    </span>
    <span
      class="actions__btn"
      @click="postShowCommentForm"
      v-if="post.canComment"
    >
      <span class="btn-icon comments" v-tooltip="'Comments'"></span>
      {{ post.commentsCount }}
    </span>
    <template
      v-if="!isOwner(post.author.id) && post.author.canEarn && $root.showTips"
    >
      <span class="actions__btn" @click="$emit('toggleTip')">
        <span class="btn-icon tips" v-tooltip="'Fund'"></span>
      </span>
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
    }
  }
};
</script>
