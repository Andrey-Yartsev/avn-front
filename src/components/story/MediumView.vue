<template>
  <div class="storyView" :data-id="post.user.id">
    <router-link :to="`/stories/${post.user.id}`" class="story">
      <div class="story-preview bg-gradient bg-gradient_light">
        <img :src="image" />
        <div
          :class="[
            'avatar avatar_ex-lg',
            { 'with-story': post.user.hasNotViewedStory }
          ]"
        >
          <span class="avatar__img">
            <img v-if="post.user.avatar" :src="post.user.avatar" />
          </span>
        </div>
      </div>
      <div class="user-names">
        <div class="wrap-name">
          <div class="name">{{ post.user.name }}</div>
          <span v-if="post.user.isVerified" class="verified-user"></span>
        </div>
        <div class="user-login reset-ml">{{ post.user.username }}</div>
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
      const {
        post: { src, preview, thumb }
      } = this;
      return (
        (thumb && thumb.source) ||
        (preview && preview.source) ||
        (src && src.source)
      );
    }
  }
};
</script>
