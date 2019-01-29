<template>
  <div class="storyView">
    <div class="story" :data-id="post.user.id">
      <router-link
        :to="`/stories/${post.user.id}`"
        :class="[
          'avatar avatar_lg avatar_lg-desk',
          { 'with-story': post.user.hasNotViewedStory }
        ]"
      >
        <span class="avatar__img">
          <img v-if="post.user.avatar" :src="post.user.avatar" />
        </span>
      </router-link>
      <div class="story-info">
        <div class="story-header">
          <router-link :to="`/${post.user.username}`" class="name">
            {{ post.user.name || post.user.username }}
          </router-link>
        </div>
      </div>
    </div>
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
