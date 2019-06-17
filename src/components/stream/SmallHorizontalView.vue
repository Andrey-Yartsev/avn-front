<template>
  <div class="storyView">
    <div class="story">
      <a
        :href="`/${post.user.username}`"
        class="avatar avatar_not-shadow avatar_lg avatar_gap-r-md avatar_gap-r-md_reset-mob new-story"
        @click.prevent="run"
      >
        <span class="avatar__img">
          <img :src="post.user.avatar" v-if="post.user.avatar" />
        </span>
        <div class="stream-online-label">live</div>
      </a>
      <div class="story-info">
        <div class="story-header">
          <a
            :href="`/${post.user.username}`"
            class="name"
            @click.prevent="run"
            >{{ post.user.name }}</a
          >
          <div class="timestamp hidden-mobile" v-if="$mq === 'desktop'">
            {{ dateTime }}
          </div>
        </div>
        <div class="user-login reset-ml hidden-mobile" v-if="$mq === 'desktop'">
          <router-link :to="`/${post.user.username}`">{{
            post.user.username
          }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";

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
      return fromNow(this.post.startedAt);
    }
  },
  methods: {
    run() {
      this.$store.dispatch("modal/show", {
        name: "stream",
        data: {
          stream: this.post
        }
      });
    }
  }
};
</script>
