<template>
  <div class="storyView">
    <div class="story">
      <router-link :to="`/stories/${post.user.id}`" :class="['avatar', {'with-story': post.user.hasNotViewedStory}]">
        <img v-if="post.user.avatar" :src="post.user.avatar" />
      </router-link>
      <div class="story-info">
        <div class="story-header">
          <router-link :to="`/${post.user.username}`" class="name">
            {{ post.user.name || post.user.username }}
          </router-link>
          <span v-if="post.user.isVerified" class="verified-user"></span>
          <div class="story-timestamp">{{ dateTime }}</div>
        </div>
        <div class="user-login">
          <router-link :to="`/${post.user.username}`">{{ post.user.name || post.user.username }}</router-link>
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
    }
  },
  computed: {
    dateTime: function() {
      return dateFns.distanceInWordsStrict(new Date(), this.post.createDate);
    }
  }
};
</script>
