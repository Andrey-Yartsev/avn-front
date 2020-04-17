<template>
  <div class="storyView">
    <div class="story">
      <a
        :href="`/stories/${post.user.id}`"
        class="avatar avatar_gap-r-md avatar_gap-r-md_reset-mob avatar_lg online-state"
        @click.prevent="() => watchAll(post.user.id)"
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
          <a
            :href="`/${post.user.username}`"
            class="name"
            @click.prevent="() => watchAll(post.user.id)"
          >
            {{ post.user.name }}
          </a>
          <span
            class="verified-user icn-item"
            :class="{
              fullyMonetized:
                post.user && post.user.canEarn && post.user.canPayoutsRequest
            }"
            v-if="
              post.user &&
                (post.user.isVerified ||
                  (post.user.canEarn && post.user.canPayoutsRequest)) &&
                $mq === 'desktop'
            "
          ></span>
          <div class="timestamp hidden-mobile" v-if="$mq === 'desktop'">
            {{ dateTime }}
          </div>
        </div>
        <div class="user-login reset-ml hidden-mobile" v-if="$mq === 'desktop'">
          <a
            :href="`/${post.user.username}`"
            @click.prevent="() => watchAll(post.user.id)"
            >{{ post.user.username }}</a
          >
          <span class="followme" v-if="post.user.subscribedOn">
            <span class="followme__txt">Follows you</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import Story from "@/mixins/story";

export default {
  name: "StorySmallHorizontal",
  mixins: [Story],
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateTime: function() {
      return fromNow(this.post.createdAt);
    }
  },
  methods: {
    watchAll(id) {
      const userIds = [...this.userIds];
      const index = userIds.indexOf(id);

      this.$store.dispatch("common/setStoryList", {
        storyList: userIds.slice(index + 1, userIds.length)
      });

      this.goToModalRoute(`/stories/${id}`);
    }
  }
};
</script>
