<template>
  <div class="actions">
    <span
      :class="[{ active: post.isFavorite }, 'likes actions__btn']"
      @click="postLike"
      v-tooltip="'Like'"
      >{{ post.favoritesCount }}</span
    >
    <span
      class="comments actions__btn"
      @click="postShowCommentForm"
      v-if="post.canComment"
      v-tooltip="'Comments'"
      >{{ post.commentsCount }}</span
    >
    <template
      v-if="!isOwner(post.author.id) && post.author.canEarn && $root.showTips"
    >
      <span
        class="tips actions__btn"
        @click="$emit('toggleTip')"
        v-tooltip="'Fund'"
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
