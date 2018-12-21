<template>
  <div class="storyView">
    <div class="story">
      <a
        :href="`/stories/${post.user.id}`"
        :class="['avatar', {'with-story': post.user.hasNotViewedStory}]"
        @click.prevent="() => watchAll(post.user.id)"
      >
        <span class="avatar__img">
          <img v-if="post.user.avatar" :src="post.user.avatar" />
        </span>
      </a>
      <div class="story-info">
        <div class="story-header">
          <a :href="`/${post.user.username}`" class="name" @click.prevent="() => watchAll(post.user.id)">
            {{ post.user.name || post.user.username }}
          </a>
          <span v-if="post.user.isVerified" class="verified-user"></span>
          <div class="story-timestamp">{{ dateTime }}</div>
        </div>
        <div class="user-login">
          <a :href="`/${post.user.username}`">{{ post.user.name || post.user.username }}</a>
          <span class="followme" v-if="post.user.subscribedOn">
            <span class="followme__txt">Follows you</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";

export default {
  name: "StorySmallHorizontal",
  props: {
    post: {
      type: Object,
      required: true
    },
    stories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dateTime: function() {
      return dateFns.distanceInWordsStrict(new Date(), this.post.createDate);
    },
    userIds() {
      return this.stories.map(s => s.user.id);
    }
  },
  methods: {
    watchAll(id) {
      const userIds = [...this.userIds];
      const index = userIds.indexOf(id);

      this.$store.dispatch("common/setStoryList", {
        storyList: userIds.slice(index + 1, userIds.length)
      });

      this.$router.push(`/stories/${id}`);
    }
  }
};
</script>
