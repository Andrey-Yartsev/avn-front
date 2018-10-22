<template>
  <div class="StoryPageCollectionView" v-if="!loading && length">
    <div class="stories-slideshow">
      <div class="StoryPageView active">
        <template v-if="currentStory.mediaType === 'photo'">
          <img class="bg" :src="currentStory.mediaSrc" alt>
          <img class="storyItem" :src="currentStory.mediaSrc" ref="storyItem" alt>
        </template>
        <video v-if="currentStory.mediaType === 'video'"
          class="story-video-element storyItem" 
          :src="currentStory.mediaSrc"
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
        :class="['item', {
          active: key === currActiveIndex,
          fullActive: key < currActiveIndex,
          video: value.mediaType === 'video'
        }]"
        :key="key"
        @click="() => currIndex = key"
      >
        <div
          class="item-filler"
          :style="value.mediaType === 'video' ? { width: `${videoProgress[value.id]}%` } : {}"
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
              <svg aria-hidden="true" class="icn icn-plus">
                <use xlink:href="#icon-plus-in-circle"></use>
              </svg>
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
    <span class="story-dropdown-menu-btn" @click="toggleDropdawnMenu"></span>
    <div :class="['dropdown-menu', { hidden: !showDropdawnMenu }]">
      <template v-if="isOwner(author.id)">
        <button class="deleteStory" type="button" @click="deleteStory">Delete</button>
        <button class="saveFile" type="button" @click="saveFile">Save</button>
        <button class="storySettings" type="button" @click="storySettings">Story Settings</button>
      </template>
      <button class="cancelDropdown" type="button" @click="toggleDropdawnMenu">Cancel</button>
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
    <button type="button" class="close" @click="close"></button>
    <div :class="['play-button-wrapper', { hidden: !showVideoPlay }]" ref="videoPlayButton">
      <div class="play-button-outer">
        <div class="play-button"></div>
      </div>
    </div>
    <Loader v-if="showLoader" :fullscreen="false"></Loader>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";
import StoryTimer from "@/helpers/StoryTimer";

export default {
  name: "StoryPage",
  mixins: [userMixin],
  components: {
    Loader
  },
  data: () => ({
    currIndex: 0,
    currActiveIndex: -1,
    timer: undefined,
    videos: [],
    videoProgress: {},
    showDropdawnMenu: false,
    showLoader: false,
    showVideoPlay: false
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
    next: function() {
      if (this.currIndex === this.length - 1) {
        this.close();
        return;
      }

      this.currIndex += 1;
    },

    runProgress: function() {
      setTimeout(() => {
        this.currActiveIndex = this.currIndex;
      }, 99);

      if (this.isAuth() && !this.currentStory.isLook) {
        this.$store.dispatch("stories/watch", { postId: this.currentStory.id });
      }

      return this.currentStory.mediaType === "video"
        ? this.launchVideo()
        : this.launchImage();
    },

    launchImage: function() {
      // console.log("launchImage");
      this.timer = new StoryTimer(() => this.next(), 4000);
    },

    launchVideo: function() {
      // console.log("launchVideo");
      const videoId = this.currentStory.id;
      const videoTag = this.$refs.storyItem;

      if (!this.videos[videoId]) {
        this.videos[videoId] = videoTag;
      }

      this.activateVideoEvents();

      videoTag
        .play()
        .then(function() {})
        .catch(() => {
          this.showVideoPlay = true;
          this.$refs.videoPlayButton.addEventListener(
            "click",
            this.launchVideo
          );
        });
    },

    activateVideoEvents: function() {
      const videoId = this.currentStory.id;
      const videoTag = this.videos[videoId];

      if (videoTag) {
        videoTag.addEventListener("timeupdate", this.videoEventTimeupdate);
        videoTag.addEventListener("ended", this.videoEventEnded);
        videoTag.addEventListener("waiting", this.videoEventWaiting);
        videoTag.addEventListener("playing", this.videoEventPlaying);
        // once
        videoTag.addEventListener("play", this.videoEventPlay);
      }
    },

    deactivateVideoEvents: function() {
      for (let videoId in this.videos) {
        if (this.videos.hasOwnProperty(videoId)) {
          this.videoProgress[videoId] = 0;
          let videoTag = this.videos[videoId];
          videoTag.removeEventListener("timeupdate", this.videoEventTimeupdate);
          videoTag.removeEventListener("ended", this.videoEventEnded);
          videoTag.removeEventListener("waiting", this.videoEventWaiting);
          videoTag.removeEventListener("playing", this.videoEventPlaying);
          // once
          videoTag.removeEventListener("play", this.videoEventPlay);
        }
      }
    },

    videoEventTimeupdate: function() {
      const videoId = this.currentStory.id;
      const videoTag = this.videos[videoId];

      if (videoTag) {
        this.videoProgress = {
          [videoId]: (videoTag.currentTime * 100) / videoTag.duration
        };
      }
    },

    videoEventEnded: function() {
      this.deactivateVideoEvents();
      this.next();
    },

    resetState: function() {
      if (this.timer) {
        clearInterval(this.timer.get());
        delete this.timer;
      }

      this.deactivateVideoEvents();
      this.videos = {};
      this.showLoader = false;
      // app.resetNextStoryList();
    },

    close: function() {
      this.resetState();
      this.$router.go(-1);
    },

    toggleDropdawnMenu: function() {
      this.showDropdawnMenu = !this.showDropdawnMenu;
      if (this.showDropdawnMenu) {
        this.pause();
      } else {
        this.resume();
      }
    },

    pause: function() {
      if (this.timer) {
        this.timer.pause();
      }

      if (this.currentStory.mediaType === "video") {
        const videoTag = this.videos[this.currentStory.id];
        videoTag.pause();
      }
    },

    resume: function() {
      if (this.timer) {
        this.timer.resume();
      }

      if (this.currentStory.mediaType === "video") {
        const videoTag = this.videos[this.currentStory.id];
        videoTag.play();
      }
    },

    deleteStory: function() {
      // var currentModel = this.collection.at(this.collection.activeIndex);
      // currentModel.destroy().then(
      //   function() {
      //     $.toast({
      //       text: "Story deleted",
      //       position: "top-center",
      //       icon: "success"
      //     });
      //   }.bind(this),
      //   function() {
      //     $.toast({
      //       text: "Story deletion failed",
      //       position: "top-center",
      //       icon: "error"
      //     });
      //   }.bind(this)
      // );
    },

    storySettings: function() {
      this.$router.push("/settings/story");
      this.toggleDropdawnMenu();
    },

    saveFile: function() {
      window.open(this.currentStory.mediaSrc, "_blank");
      this.toggleDropdawnMenu();
    },

    videoEventPlay: function() {
      if (this.currentStory.mediaType === "video") {
        const videoTag = this.videos[this.currentStory.id];
        videoTag.muted = false;
      }
    },

    videoEventWaiting: function() {
      this.showLoader = true;
    },

    videoEventPlaying: function() {
      this.showVideoPlay = false;
      this.showLoader = false;
    }
  },
  created() {
    this.$store.dispatch("stories/resetPageState");
    this.$store.dispatch("stories/getUserPosts", { userId: this.userId });
  },
  watch: {
    currentStory() {
      if (!this.currentStory) return;

      this.resetState();
      this.$nextTick(() => {
        this.runProgress();
      });
    }
  }
};
</script>
