<template>
  <div class="storyView">
    <div class="story">
      <router-link :to="`/${post.user.username}`" class="avatar">
        <img :src="post.user.avatar">
        <div class="stream-online-label">live</div>
      </router-link>
      <div class="story-info">
        <div class="story-header">
          <router-link :to="`/${post.user.username}`" class="name">{{ post.user.name }}</router-link>
          <div class="story-timestamp">{{ dateTime }}</div>
        </div>
        <div class="user-login">
          <router-link :to="`/${post.user.username}`" class="">{{ post.user.username }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";

export default {
  name: "StreamSmallView",
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateTime: function() {
      return dateFns.distanceInWordsStrict(new Date(), this.post.startedAt);
    }
  }
};
</script>
