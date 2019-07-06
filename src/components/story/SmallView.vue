<template>
  <div class="storyView">
    <div class="story" :data-id="post.user.id">
      <a
        :href="`/stories/${post.user.id}`"
        class="avatar avatar_lg avatar_lg-desk"
        @click.prevent="go"
      >
        <span
          class="avatar__img"
          :class="{ 'with-story': post.user.hasNotViewedStory }"
        >
          <img v-if="post.user.avatar" :src="post.user.avatar" />
        </span>
      </a>
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
import User from "@/mixins/user";
import Story from "@/mixins/story";

export default {
  name: "StorySmall",
  mixins: [User, Story],
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    stories: {
      type: Array,
      default: () => []
    }
  }
};
</script>
