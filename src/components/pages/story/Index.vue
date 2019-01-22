<template>
  <div class="StoryPageCollectionView">
    <template v-if="!loading && length && currentStory">
      <div class="stories-slideshow">
        <div class="StoryPageView active">
          <template v-if="currentStory.mediaType === 'photo'">
            <img class="bg" :src="currentStory.src.source || currentStory.preview.source" alt>
            <img class="storyItem" :src="currentStory.src.source || currentStory.preview.source" ref="storyItem" alt>
          </template>
          <video v-if="currentStory.mediaType === 'video'"
            class="story-video-element storyItem" 
            :src="currentStory.src.source"
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
              @click.prevent="addNewStory"
              :href="isOwner(author.id) ? `/${author.username}` : ''"
              :class="['avatar avatar_not-shadow', {'new-story': isOwner(author.id)}]"
            >
              <span class="avatar__img">
                <img v-if="author.avatar" :src="author.avatar">
              </span>
            </a>
            <template v-if="isOwner(author.id)">
              <span class="btn-add" @click="addNewStory">
                <svg aria-hidden="true" class="icn icn-plus">
                  <use xlink:href="#icon-plus-in-circle"></use>
                </svg>
              </span>
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
      <div  v-if="isOwner(author.id)" :class="['more-functions', { open: showDropdawnMenu }]" v-click-outside="hideDropdawn">
        <div class="more-functions__overlay" @click.prevent="hideDropdawn"></div>
        <div class="more-functions__btn" @click.prevent="openDropdawn"></div>
        <div class="more-functions__dropdown">
          <div class="more-functions__dropdown-inside">
            <ul>
              <li><button class="deleteStory" type="button" @click="deleteStory">Delete</button></li>
              <li><button class="saveFile" type="button" @click="saveFile">Save</button></li>
              <li><button class="storySettings" type="button" @click="storySettings">Story Settings</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom-btns">
        <div class="story-details-info">
            <a href="#" class="btn-story-details"></a>
            <div class="story-viewer">
                Johnny Mnemonic, Johm Smith and 24 others
            </div>
        </div>
        
        <template v-if="!isOwner(author.id) && author.canEarn">
          <button type="button" class="btn-tip"></button>
          <form class="tip-form hidden">
            <button type="button" role="button" class="btn btn-cancel">Cancel</button>
            <div class="tip-amount-field">
              <input
                class="tip-amount-input rounded"
                type="text"
                pattern="\d{1,5}(?:\.\d{0,2})?"
                maxlength="8"
                placeholder="Enter fund amount">
            </div>    
            <button type="submit" class="btn btn-send" disabled>Send fund</button>
          </form>
        </template>
      </div>
      <button type="button" class="close" @click="close"></button>
      <div :class="['play-button-wrapper', { hidden: !showVideoPlay }]" ref="videoPlayButton">
        <div class="play-button-outer">
          <div class="play-button"></div>
        </div>
      </div>
    </template>
    <Loader
      v-if="loading || showLoader || !currentStory || !currentStory.isReady" 
      :fullscreen="false"
    />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";
import StoryTimer from "@/helpers/StoryTimer";
import ClickOutside from "vue-click-outside";

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
    error() {
      return this.$store.state.stories.error;
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
    },
    newPost() {
      return this.$store.state.story.newPost;
    },
    deletedPost() {
      return this.$store.state.story.deletedPost;
    }
  },
  methods: {
    next: function() {
      if (this.currIndex === this.length - 1) {
        this.findNextUserStory();
        return;
      }

      this.currIndex += 1;
    },

    runProgress: function() {
      const { isLook, mediaType, id } = this.currentStory;

      if (this.isAuth() && !isLook) {
        this.$store.dispatch("story/watch", { postId: id });
      }

      if (mediaType === "video") {
        this.launchVideo();
      } else {
        this.launchImage();
      }
    },

    launchImage: function() {
      this.showLoader = true;

      this.$refs.storyItem.onload = () => {
        this.timer = new StoryTimer(() => this.next(), 4000);
        this.showLoader = false;

        setTimeout(() => {
          this.currActiveIndex = this.currIndex;
        }, 99);
      };
    },

    launchVideo: function() {
      const videoId = this.currentStory.id;
      const videoTag = this.$refs.storyItem;

      if (!this.videos[videoId]) {
        this.videos[videoId] = videoTag;
      }

      setTimeout(() => {
        this.currActiveIndex = this.currIndex;
      }, 99);

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
        this.timer.kill();
        delete this.timer;
      }

      this.deactivateVideoEvents();
      this.videos = {};
      this.showLoader = false;
      this.currActiveIndex = -1;
    },

    findNextUserStory: function() {
      const userIds = [...this.$store.state.common.storyList];
      const userId = userIds.shift();

      if (userId) {
        this.$store.dispatch("common/setStoryList", {
          storyList: userIds
        });

        this.$router.replace(`/stories/${userId}`);
      } else {
        this.close();
      }
    },

    close: function() {
      this.resetState();
      this.$store.dispatch("common/resetStoryList");
      this.$router.go(-1);
    },

    pause: function() {
      const { mediaType, id } = this.currentStory;

      if (this.timer) {
        this.timer.pause();
      }

      if (mediaType === "video") {
        const videoTag = this.videos[id];
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
      this.hideDropdawn();

      this.$store.dispatch("story/deletePost", {
        postId: this.currentStory.id
      });

      this.$store.dispatch("global/flashToast", "Story deleted", {
        root: true
      });

      if (this.currIndex === this.length - 1) {
        this.close();
      }
    },

    storySettings: function() {
      this.$router.push("/settings/story");
    },

    saveFile: function() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this.currentStory.src.source, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement("a");
        tag.href = imageUrl;
        tag.download = "story";
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
      };
      xhr.send();
      this.hideDropdawn();
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
    },
    addNewStory: function() {
      this.pause();
      document.getElementById("storyFileSelect").click();
    },
    openDropdawn: function() {
      this.showDropdawnMenu = true;
      this.pause();
    },
    hideDropdawn() {
      if (this.showDropdawnMenu) {
        this.showDropdawnMenu = false;
        this.resume();
      }
    },
    init() {
      this.resetState();
      this.$store.dispatch("stories/resetPageState");
      this.$store.dispatch("stories/getUserPosts", { userId: this.userId });
    },
    saveStat() {
      this.$root.ws.send({
        act: "collect",
        message: "look_story",
        data: {
          story_user_id: this.author.id,
          story_id: this.currentStory.id,
          owner: this.author.id
        }
      });
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
  },
  directives: {
    ClickOutside
  },
  watch: {
    error() {
      if (this.error) {
        this.$router.push("/");
      }
    },
    stories() {
      const index = this.stories.findIndex(element => element.isLook === false);
      if (index !== -1) {
        this.currIndex = index;
      } else {
        this.currIndex = 0;
      }
    },
    currentStory() {
      if (!this.currentStory) return;

      this.resetState();
      this.$nextTick(() => {
        this.runProgress();
      });

      this.saveStat();
    },
    $route() {
      this.init();
    },
    newPost() {
      this.init();
    },
    deletedPost() {
      this.init();
    }
  }
};
</script>
