<template>
  <div
    class="storyView"
    :class="{ outofviewport: isVisible === false }"
    :data-id="post.user.id"
    v-observe-visibility="visibilityChanged"
  >
    <div v-if="isVisible === false" :style="{ height: `${height}px` }" />
    <a
      v-else
      :href="`/stories/${post.user.id}`"
      @click.prevent="go"
      class="story"
    >
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
          <span
            v-if="post.user && post.user.isVerified"
            class="verified-user"
          ></span>
        </div>
        <div class="user-login reset-ml">{{ post.user.username }}</div>
      </div>
    </a>
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
  },
  methods: {
    go() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$router.push(`/stories/${this.post.user.id}`);
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;
      this.height = entry.boundingClientRect.height;
    }
  }
};
</script>
