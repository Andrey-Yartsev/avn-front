<template>
    <div class="actions">
        <span :class="[{ active: post.isFavorite }, 'likes actions__btn']" @click="postLike">{{ post.favoritesCount }}</span>
        <span class="comments actions__btn" @click="postShowCommentForm">{{ post.commentsCount }}</span>
        <template v-if="!isOwner(post.id) && post.author.canEarn">
          <span class="tips actions__btn" @click="$emit('toggleTip')"></span>
        </template>
        <time class="timestamp" :datetime="post.postedAt">
          <a class="postLink" :href="`/post/${post.id}`" @click.prevent="openModal">
            {{ dateTime }}
          </a>
        </time>
    </div>
</template>

<script>
import datetimeHelper from "@/helpers/datetime";
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
    dateTime: function() {
      return datetimeHelper(this.post.postedAt);
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
