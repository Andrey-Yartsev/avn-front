<template>
  <div class="StoryPageCollectionView" v-if="!loading && length">
    <div class="stories-slideshow">
      <div class="StoryPageView active">
        <template v-if="post.mediaType === 'photo'">
          <img class="bg" :src="post.mediaSrc" alt>
          <img class="storyItem" :src="post.mediaSrc" ref="storyItem" alt>
        </template>
        <video v-if="post.mediaType === 'video'"
          class="story-video-element storyItem" 
          :src="post.mediaSrc"
          ref="storyItem"
        ></video>
      </div>
    </div>
    <template v-if="length > 1">
      <button
        type="button"
        class="btn-prev"
        v-if="currIndex > 0"
        @click="currIndex = currIndex - 1"
      />
      <button
        type="button"
        class="btn-next"
        v-if="currIndex < length - 1"
        @click="currIndex = currIndex + 1"
      />
    </template>
    <div class="progress-pagination">
      <div
        v-for="(value, key) in stories"
        :class="['item', { active: key === currIndex, fullActive: key < currIndex, video: value.mediaType === 'video' }]"
        :key="key"
        @click="() => currIndex = key"
      >
        <div
          class="item-filler"
          :style="value.mediaType === 'video' ? { width: `${videoProgress}%` } : {}"
        />
      </div>
    </div>
    <div class="head-story">
      <div class="story-avatar">
          <a 
            :href="isOwner(author.id) ? `/${author.username}` : ''"
            :class="['avatar', {'new-story': isOwner(author.id)}]"
          >
            <img v-if="author.avatar" :src="author.avatar">
          </a>
          <template v-if="isOwner(author.id)">
            <span class="btn-add">
              <svg aria-hidden="true" class="icn icn-plus"><use xlink:href="#icon-plus-in-circle"></use></svg>
            </span>
            <input
              type="file"
              class="hidden storyFileSelect"
              accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
            />
          </template>
      </div>
      <div class="user-name">
        <a 
          :href="isOwner(author.id) ? `/${author.username}` : ''"
          :class="{'new-story': isOwner(author.id)}"
        >
          {{ isOwner(author.id) ? 'Your story' : author.name || author.username }}
        </a>
        <span class="time"></span>
      </div>
    </div>    
    <span class="story-dropdown-menu-btn"></span>
    <div class="dropdown-menu hidden">
      <template v-if="isOwner(author.id)">
        <button class="deleteStory" type="button">Delete</button>
        <button class="saveFile" type="button">Save</button>
        <button class="storySettings" type="button">Story Settings</button>
      </template>
      <button class="cancelDropdown" type="button">Cancel</button>
    </div>
    <div class="bottom-btns">
      <template v-if="!isOwner(author.id) && author.canEarn">
        <button type="button" class="btn-tip"></button>
        <form class="tip-form hidden">
          <button type="button" role="button" class="btn btn-cancel">Cancel</button>
          <div class="tip-amount-field">
            <input class="tip-amount-input rounded" type="text" pattern="\d{1,5}(?:\.\d{0,2})?" maxlength="8" placeholder="Enter tip amount">
          </div>    
          <button type="submit" class="btn btn-send" disabled>Send tip</button>
        </form>
      </template>
    </div>
    <button type="button" class="close"></button>
    <div class="play-button-wrapper hidden" id="video-play-button">
      <div class="play-button-outer">
        <div class="play-button"></div>
      </div>
    </div>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";
import StoryTimer from "@/helpers/StoryTimer";

export default {
  name: "StoryPage",
  mixins: [userMixin],
  data: () => ({
    currIndex: undefined,
    timer: undefined,
    videos: [],
    videoProgress: 0
  }),
  computed: {
    length() {
      return this.$store.state.stories.posts.length;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    author() {
      return this.$store.state.stories.user;
    },
    post() {
      return this.$store.state.stories.posts[this.currIndex || 0];
    },
    loading() {
      return this.$store.state.stories.loading;
    },
    userId() {
      return this.$route.params.userId;
    },
    currentStory() {
      return this.stories[this.currIndex];
    }
  },
  methods: {
    run: function() {
      const firstStoryItem = this.$refs.storyItem;
      const { complete, tagName } = firstStoryItem;

      if (complete || tagName === "VIDEO") {
        this.next();
      } else {
        firstStoryItem.onload = () => {
          this.next();
        };
      }
    },
    next: function() {
      if (this.currIndex === this.length - 1) {
        this.allStoryWatched();
        return;
      }

      this.currIndex = this.currIndex === undefined ? 0 : this.currIndex + 1;
    },

    runProgress: function(callback) {
      return this.currentStory.mediaType === "video"
        ? this.launchVideo()
        : this.launchImage();
    },

    launchImage: function() {
      console.log("launchImage");
      this.timer = new StoryTimer(() => this.next(), 4000);
    },

    launchVideo: function() {
      console.log("launchVideo");
      const videoId = this.currentStory.id;
      const videoTag = this.$refs.storyItem ;

      if (!this.videos[videoId]) {
        console.log(4444)
        this.videos[videoId] = videoTag; 
      }

      this.activateVideoEvents();

      videoTag
        .play()
        .then(function() {})
        .catch(error => {
          // The user interaction is required on mobile devices
          // to trigger play via a click event.
          // const videoPlayButton = this.$el.find("#video-play-button");
          // videoPlayButton.removeClass("hidden");
          // videoPlayButton.one("click", this.launchVideo.bind(this));
        });
    },

    activateVideoEvents: function() {
      const videoId = this.currentStory.id;
      const videoTag = this.videos[videoId];

      if (videoTag) {
        console.log('addEventListener');
        videoTag.addEventListener("timeupdate", this.videoEventTimeupdate);
        // videoTag.addEventListener("waiting", this.videoEventWaiting);
        // videoTag.addEventListener("playing", this.videoEventPlaying);
        videoTag.addEventListener("ended", this.videoEventEnded);
        // // one
        // videoTag.addEventListener("play", this.videoEventPlay);
      }
    },

    deactivateVideoEvents: function() {
      console.log('deacti');
      this.videoProgress = 0;
      for (let videoId in this.videos) {
        if (this.videos.hasOwnProperty(videoId)) {
          let videoTag = this.videos[videoId];
          // videoTag.stop();
          videoTag.removeEventListener("timeupdate", this.videoEventTimeupdate);
          // videoTag.removeEventListener("waiting", this.videoEventWaiting);
          // videoTag.removeEventListener("playing", this.videoEventPlaying);
          videoTag.removeEventListener("ended", this.videoEventEnded);
          // // one
          // videoTag.removeEventListener("play", this.videoEventPlay);
        }
      }
    },

    videoEventTimeupdate: function() {
      const videoId = this.currentStory.id;
      const videoTag = this.videos[videoId];

      console.log(12)
      
      if (videoTag) {
        this.videoProgress = (videoTag.currentTime * 100) / videoTag.duration;
      }
    },
    // videoEventPlay: function() {
    //   this.videos[this.collection.activeIndex].video.muted = false;
    // },
    videoEventEnded: function() {
      this.deactivateVideoEvents();
      this.next();
    },

    resetState: function() {
      this.deactivateVideoEvents();

      if (this.timer) {
        clearInterval(this.timer.get());
      }

      this.videos = {};
      // app.resetNextStoryList();
    },

    // videoEventWaiting: function() {
    //   this.showLoader();
    // },
    // videoEventPlaying: function() {
    //   var videoPlayButton = this.$el.find("#video-play-button");
    //   videoPlayButton.addClass("hidden");

    //   this.hideLoader();
    // },

    allStoryWatched: function() {
      console.log("all done");
    }

    // hideLoader: function() {
    //   // if (this.loader) {
    //   //   this.loader.parentNode.removeChild(this.loader);
    //   //   this.loader = null;
    //   // }
    // },
    // next: function() {
    //   this.hideLoader();
    //   this.resetTimer();
    //   // this.collection.next();
    // },
    // resetTimer: function() {
    //   // window.clearTimeout(this.timer.getId());
    //   // this.timer = null;
    //   // if (
    //   //   this.videos[this.collection.activeIndex] &&
    //   //   this.videos[this.collection.activeIndex].video
    //   // ) {
    //   //   this.videos[this.collection.activeIndex].video.pause();
    //   //   this.videos[this.collection.activeIndex].video.currentTime = 0;
    //   // }
    // },
  },
  created() {
    this.$store.dispatch("stories/resetPageState");
    this.$store.dispatch("stories/getUserPosts", { userId: this.userId });
  },
  watch: {
    length() {
      this.$nextTick(() => {
        if (!this.length) return;
        this.run();
      });
    },
    currentStory() {
      this.$nextTick(() => {
        this.resetState();
        this.runProgress();
      });
    }
  }
};
</script>
