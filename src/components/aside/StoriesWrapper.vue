<template>
  <div class="stories-wrapper">
    <div
      class="storyCollectionView storyCollectionView_col storyCollectionView_tape"
    >
      <div class="storyCollectionView__header">
        <h4>Stories</h4>
        <span v-if="$mq === 'desktop'" class="add-story-link" @click="addStory"
          >+ Add story</span
        >
        <template v-else>
          <div class="btn-post" v-if="user.isPerformer">
            <router-link class="b-check-state b-check-state_live" to="/stream">
              <span
                class="b-check-state__icon icn-live icn-item icn-size_lg"
              ></span>
              <span class="btn-post__text exception">Go live</span></router-link
            >
          </div>
        </template>
      </div>
      <div class="stories-group__outer">
        <div class="stories-group">
          <perfect-scrollbar
            class="stories-group__inner"
            v-if="!streamsLoading && !storiesLoading"
          >
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
                  <div class="story-header">
                    <div class="name">Your Story</div>
                  </div>
                  <div class="user-login reset-ml hidden-mobile">
                    <a class="new-story">Create new story</a>
                  </div>
                </div>
              </div>
            </div>
            <StreamCollection :stories="streams" v-if="streams.length" />
            <StoryCollection :stories="stories" v-if="stories.length" />
          </perfect-scrollbar>
          <div class="loader-stories" v-else>
            <Loader :fullscreen="false" :inline="true" :small="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoryCollection from "@/components/common/storyCollection/Index";
import StreamCollection from "@/components/common/streamCollection/Index";
import Loader from "@/components/common/Loader";
import uniqBy from "lodash.uniqby";

export default {
  name: "StoriesWrapper",
  components: {
    StoryCollection,
    StreamCollection,
    Loader
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    stories() {
      return this.$store.state.stories.feed.posts;
    },
    streams() {
      const filteredStreams = this.$store.state.lives.posts.filter(
        stream => !stream.stream_public
      );
      return uniqBy(filteredStreams, "id");
    },
    hasMine() {
      if (this.stories[0]) {
        return this.stories[0].user.id === this.user.id;
      }
      return false;
    },
    storiesLoading() {
      return this.$store.state.stories.feed.loading;
    },
    streamsLoading() {
      return this.$store.state.lives.loading;
    }
  },
  methods: {
    addNewStory() {
      document.getElementById("storyFileSelect").click();
    },
    addStory: function() {
      document.getElementById("storyFileSelect").click();
    }
  }
};
</script>
