<template>
    <div class="actions">
        <span :class="[{ active: post.isFavorite }, 'likes']">{{ post.favoritesCount }}</span>
        <span class="comments">{{ post.commentsCount }}</span>
        <template v-if="!isOwner && author.canEarn">
            <span class="tips"></span>
        </template>
        <time class="date" :datetime="post.postedAt">
            <router-link class="postLink" to="`/post/${post.id}`">{{ dateTime }}</router-link>
        </time>
    </div>
</template>

<script>
import datetimeHelper from "../../../helpers/datetime";

export default {
  name: "Actions",
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
