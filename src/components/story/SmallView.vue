<template>
  <div class="explore-all-story" :data-id="post.id">
    <a :href="`/stories/${post.id}`" :class="['avatar', {'with-story': post.user.hasNotViewedStory}]">
      <img v-if="post.user.avatar" :src="post.user.avatar" />
    </a>
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
  },
  methods: {
    openModal() {
      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
    }
  }
};
</script>
