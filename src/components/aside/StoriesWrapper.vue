<template>
  <div class="stories-wrapper">
    <div class="storyCollectionView">
      <h4>Stories</h4>
      <div class="stories-group__outer">
        <div class="stories-group">
          <VuePerfectScrollbar class="stories-group__inner">
            <div
              v-if="!hasMine"
              class="storyView create-story-button"
              @click.prevent="addNewStory"
            >
              <div class="story">
                <div
                  class="story-avatar avatar_gap-r-md avatar_gap-r-md_reset-mob"
                >
                  <a class="avatar avatar_not-shadow avatar_lg new-story">
                    <span class="avatar__img">
                      <img v-if="user.avatar" :src="user.avatar" />
                    </span>
                  </a>
                  <span class="btn-add">
                    <svg aria-hidden="true" class="icn icn-plus">
                      <use xlink:href="#icon-plus-in-circle"></use>
                    </svg>
                  </span>
                </div>
                <div class="story-info">
                  <div class="name">Your story</div>
                  <div class="user-login reset-ml">
                    <a class="new-story">Create new story</a>
                  </div>
                </div>
              </div>
            </div>
            <StreamCollection :stories="streams" />
            <StoryCollection :stories="stories" />
          </VuePerfectScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoryCollection from "@/components/common/storyCollection/Index";
import StreamCollection from "@/components/common/streamCollection/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "StoriesWrapper",
  components: {
    VuePerfectScrollbar,
    StoryCollection,
    StreamCollection
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    streams() {
      return this.$store.state.lives.posts;
    },
    hasMine() {
      if (this.stories[0]) {
        return this.stories[0].user.id === this.user.id;
      }
      return false;
    }
  },
  methods: {
    addNewStory() {
      document.getElementById("storyFileSelect").click();
    }
  }
};
</script>
