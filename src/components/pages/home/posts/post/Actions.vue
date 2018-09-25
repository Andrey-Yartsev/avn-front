<template>
    <div class="actions">
        <span :class="[{ active: post.isFavorite }, 'likes']" @click="$emit('postLike')">{{ post.favoritesCount }}</span>
        <span class="comments" @click="$emit('postShowCommentForm')">{{ post.commentsCount }}</span>
        <template v-if="!isOwner(post.id) && post.author.canEarn">
          <span class="tips"></span>
        </template>
        <time class="date" :datetime="post.postedAt">
          <router-link class="postLink" to="`/post/${post.id}`">{{ dateTime }}</router-link>
        </time>
    </div>
</template>

<script>
import datetimeHelper from "../../../../../helpers/datetime";
import userMixin from "../../../../../mixins/user";

export default {
  name: "Actions",
  mixins: [userMixin],
  props: {
    post: {
      type: Object,
      isRequired: true
    }
  },
  computed: {
    dateTime: function() {
      return datetimeHelper(this.post.postedAt);
    }
  }
};
</script>
