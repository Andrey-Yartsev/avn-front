<template>
  <div class="explore-all-story" :data-id="post.user.id">
    <router-link :to="`/stories/${post.user.id}`" :class="['avatar', {'with-story': post.user.hasNotViewedStory}]">
      <img v-if="post.user.avatar" :src="post.user.avatar" />
    </router-link>
    <a :href="`/${post.user.username}`" class="name">
      {{ post.user.name || post.user.username }}
    </a>
  </div>
</template>

<script>
export default {
  name: "StorySmall",
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  }
};
</script>
