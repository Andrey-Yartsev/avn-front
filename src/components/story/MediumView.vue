<template>
  <div class="storyView" :data-id="post.user.id">
    <router-link :to="`/stories/${post.user.id}`" class="story">
      <div class="story-preview">
        <img :src="image">
        <div :class="['avatar', {'with-story': post.user.hasNotViewedStory}]">
          <img v-if="post.user.avatar" :src="post.user.avatar" />
        </div>
      </div>
      <div class="story-header">
        <div class="name">{{ post.user.name }}</div>
        <span v-if="post.user.isVerified" class="verified-user"></span>
      </div>
      <div class="user-login">
        {{ post.user.name }}
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "StoryMedium",
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
  computed: {
    image() {
      const { post } = this;
      return post.mediaThumb
        ? post.mediaThumb
        : post.mediaPreview
          ? post.mediaPreview
          : post.mediaSrc;
    }
  }
};
</script>
