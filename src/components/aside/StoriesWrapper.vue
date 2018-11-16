<template>
  <div class="stories-wrapper">
    <div class="storyCollectionView">
      <h4>Stories</h4>
      <button
        v-if="stories.length"
        class="btn-watch-all"
        type="button"
        @click="watchAll"
      >Watch All</button>
      <div class="stories-group__outer">
        <scrolly class="stories-group" @scrollchange="scrollFunction">
          <scrolly-viewport class="stories-group__inner">
            <div v-if="!hasMine" class="storyView create-story-button" @click.prevent="addNewStory">
              <div class="story">
                <div class="story-avatar">
                    <a class="avatar new-story">
                        <img v-if="user.avatar" :src="user.avatar">
                    </a>
                    <span class="btn-add">
                        <svg aria-hidden="true" class="icn icn-plus">
                            <use xlink:href="#icon-plus-in-circle"></use>
                        </svg>
                    </span>
                </div>
                <div class="story-info">
                    <div class="name">Your story</div>
                    <div class="user-login">
                        <a class="new-story">Create new story</a>
                    </div>
                </div>
              </div>
            </div>
            <StoryCollection :stories="stories" />
          </scrolly-viewport>
          <scrolly-bar axis="x"></scrolly-bar>
          <scrolly-bar axis="y"></scrolly-bar>
        </scrolly>
      </div>
    </div>
  </div>
</template>

<script>
import StoryCollection from "@/components/common/storyCollection/Index";
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";

export default {
  name: "StoriesWrapper",
  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar,
    StoryCollection
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    storiesLoading() {
      return this.$store.state.stories.loading;
    },
    storiesAllDataReceived() {
      return this.$store.state.stories.allDataReceived;
    },
    hasMine() {
      if (this.stories[0]) {
        return this.stories[0].user.id === this.user.id;
      }
      return false;
    },
    userIds() {
      return this.stories.map(s => s.user.id);
    }
  },
  methods: {
    scrolledEnought(e) {
      if (e.y.visible) {
        const { viewportHeight, scrollTop, scrollHeight } = e.y;
        return scrollHeight - (viewportHeight + scrollTop) < 450;
      }

      if (e.x.visible) {
        const { viewportWidth, scrollLeft, scrollWidth } = e.x;
        return scrollWidth - (viewportWidth + scrollLeft) < 450;
      }

      return false;
    },
    scrollFunction(e) {
      if (
        this.scrolledEnought(e) &&
        !this.storiesLoading &&
        !this.storiesAllDataReceived
      ) {
        this.$store.dispatch("stories/getPosts");
      }
    },
    addNewStory() {
      document.getElementById("storyFileSelect").click();
    },
    watchAll() {
      const userIds = [...this.userIds];
      const userId = userIds.shift();

      this.$store.dispatch("common/setStoryList", {
        storyList: userIds
      });

      this.$router.push(`/stories/${userId}`);
    }
  }
};
</script>
