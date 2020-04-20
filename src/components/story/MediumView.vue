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
      <div
        class="story-preview story-preview_list bg-gradient bg-gradient_light"
      >
        <img :src="image" class="story-preview__img" />
        <div class="avatar avatar_ex-lg">
          <span
            class="avatar__img"
            :class="{ 'with-story': post.user.hasNotViewedStory }"
          >
            <img v-if="post.user.avatar" :src="post.user.avatar" />
          </span>
        </div>
      </div>
      <div class="user-names">
        <div class="wrap-name">
          <div class="name">{{ post.user.name }}</div>
          <span
            class="verified-user icn-item"
            :class="{
              fullyMonetized:
                post.user && post.user.canEarn && post.user.canPayoutsRequest
            }"
            v-if="
              post.user &&
                (post.user.isVerified ||
                  (post.user.canEarn && post.user.canPayoutsRequest))
            "
          ></span>
        </div>
        <div class="user-login reset-ml">{{ post.user.username }}</div>
      </div>
    </a>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import Story from "@/mixins/story";

export default {
  name: "StoryMedium",
  mixins: [UserMixin, Story],
  data() {
    return {
      isVisible: undefined,
      height: undefined
    };
  },
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
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;
      this.height = entry.boundingClientRect.height;
    }
  }
};
</script>
