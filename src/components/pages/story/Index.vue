<template>
  <div class="StoryPageCollectionView">
    <template v-if="!loading && length && currentStory">
      <div class="stories-slideshow">
        <div
          class="StoryPageView active"
          v-touch:swipe.top="topSwipeHandler"
          v-touch:swipe.bottom="bottomSwipeHandler"
        >
          <template v-if="currentStory.mediaType === 'photo'">
            <img class="storyItem_bg" :src="imageSource(currentStory)" alt />
            <div
              class="story-image"
              @mousedown="pause"
              @mouseup="resume"
              @touchstart="pause"
              @touchend="resume"
            >
              <img
                class="storyItem"
                :src="imageSource(currentStory)"
                ref="storyItem"
                alt
              />
            </div>
          </template>
          <video
            v-if="currentStory.mediaType === 'video'"
            class="story-video-element storyItem"
            autoplay
            :playsinline="$mq === 'mobile'"
            :src="currentStory.src.source"
            ref="storyItem"
            @mousedown="pause"
            @mouseup="resume"
            @touchstart="pause"
            @touchend="resume"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
        </div>
      </div>
      <template v-if="length > 1">
        <button
          type="button"
          class="btn-direction btn-direction_lr-sides btn-direction_prev btn-direction_prev-left icn-item icn-pos_center"
          v-if="currIndex > 0"
          @click="currIndex = currIndex - 1"
        />
        <button
          type="button"
          class="btn-direction btn-direction_lr-sides btn-direction_next btn-direction_next-right icn-item icn-pos_center"
          v-if="currIndex < length - 1"
          @click="currIndex = currIndex + 1"
        />
      </template>
      <div class="progress-pagination">
        <div
          v-for="(value, key) in stories"
          :class="[
            'item',
            {
              active: key === currActiveIndex,
              paused: isPaused,
              fullActive: key < currActiveIndex,
              video: value.mediaType === 'video'
            }
          ]"
          :key="key"
          @click="() => (currIndex = key)"
        >
          <div
            class="item-filler"
            :style="
              value.mediaType === 'video'
                ? { width: `${videoProgress[value.id]}%` }
                : {}
            "
          />
        </div>
      </div>
      <div class="head-story">
        <a
          @click.prevent="addNewStory"
          :href="isOwner(author.id) ? `/${author.username}` : ''"
          :class="[
            'avatar avatar_md avatar_not-shadow',
            { 'new-story': isOwner(author.id) }
          ]"
        >
          <span class="avatar__img">
            <img v-if="author.avatar" :src="author.avatar" />
          </span>
          <template v-if="isOwner(author.id) && !isCollections">
            <span class="btn-add" @click="addNewStory">
              <svg aria-hidden="true" class="icn icn-plus">
                <use xlink:href="#icon-plus-in-circle"></use>
              </svg>
            </span>
          </template>
        </a>
        <div class="user-name">
          <span v-if="isCollections">
            {{ collection.title }}
          </span>
          <template v-else>
            <router-link class="name" :to="`/${author.username}`">
              {{
                isOwner(author.id)
                  ? "Your story"
                  : author.name || author.username
              }}
            </router-link>
          </template>
        </div>
      </div>
      <div
        v-if="isOwner(author.id)"
        :class="[
          'more-functions more-functions_sticky more-functions_sticky-br more-functions_dir-inverse',
          { open: showDropdownMenu }
        ]"
        v-click-outside="hideDropdown"
      >
        <div
          class="more-functions__overlay"
          @click.prevent="hideDropdown"
        ></div>
        <div class="more-functions__btn" @click.prevent="openDropdown"></div>
        <div class="more-functions__dropdown">
          <div class="more-functions__dropdown-inside">
            <ul v-if="!isCollections" class="more-functions__list">
              <li class="more-functions__item">
                <button
                  class="deleteStory more-functions__link"
                  type="button"
                  @click="deleteStory"
                >
                  <span class="more-functions__option">
                    Delete
                  </span>
                </button>
              </li>
              <li class="more-functions__item">
                <button
                  class="saveFile more-functions__link"
                  type="button"
                  @click="saveToHighlights"
                >
                  <span class="more-functions__option">
                    Save
                  </span>
                </button>
              </li>
              <li class="more-functions__item">
                <button
                  class="saveFile more-functions__link"
                  type="button"
                  @click="addLinkModal"
                >
                  <span class="more-functions__option">
                    Add redirect link
                  </span>
                </button>
              </li>
              <li class="more-functions__item">
                <button
                  class="storySettings more-functions__link"
                  type="button"
                  @click="storySettings"
                >
                  <span class="more-functions__option">
                    Story Settings
                  </span>
                </button>
              </li>
            </ul>
            <ul class="more-functions__list" v-else>
              <li class=" more-functions__item">
                <button
                  class="storySettings more-functions__link"
                  type="button"
                  @click="editHighlight"
                >
                  <span class="more-functions__option">
                    Edit highlight
                  </span>
                </button>
              </li>
              <li class="more-functions__item">
                <button
                  class="saveFile more-functions__link"
                  type="button"
                  @click="removeFromHighlight"
                >
                  <span class="more-functions__option">
                    Remove from highlight
                  </span>
                </button>
              </li>
              <li v-if="copied" class="more-functions__item">
                <button
                  class="btn-copy-link copied more-functions__link"
                  type="button"
                >
                  <span class="more-functions__option">
                    Copied!
                  </span>
                </button>
              </li>
              <li class="more-functions__item" v-else>
                <button
                  class="storySettings more-functions__link"
                  type="button"
                  @click="copyHighlightLink"
                >
                  <span class="more-functions__option">
                    Copy link
                  </span>
                </button>
              </li>
              <li class="more-functions__item">
                <button
                  class="deleteStory more-functions__link"
                  type="button"
                  @click="removeHighlight"
                >
                  <span class="more-functions__option">
                    Remove highlight
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="stream-forms" v-if="!isMine && showComments">
        <div class="form-comments">
          <form class="form-comments__wrapper">
            <textarea
              placeholder="Comment"
              maxlength="200"
              class="form-comments__input rounded lg"
              @focus="pause"
              @blur="resume"
              v-model="comment"
              @keypress.enter.prevent="sendComment"
            />
            <button
              @click="sendComment"
              type="button"
              :disabled="!comment.length"
              class="btn-send btn-send_inside-field icn-item icn-size_lg"
            />
          </form>
        </div>
      </div>
      <div
        v-if="hasRedirectUrl"
        class="bottom-btn swipeLink"
        :class="{
          swipeLink_mobile: $mq === 'mobile',
          moveBottom: this.showComments && !isOwner(author.id)
        }"
      >
        <span
          class="btn-icon icn-item icn-size_lg btn-direction_prev-up"
          style="margin-right: 0"
        />
        <p @click="handleRedirect">
          Swipe
        </p>
      </div>
      <div class="bottom-btns">
        <Tip
          ref="tip"
          v-if="showTip"
          :user="author"
          @cancel="closeTip"
          :tipId="`h${currentStory.id}`"
          class="tip-form_viewer"
          :needLgClassName="true"
        />
        <span
          class="btn-story-details bottom-btn icn-item"
          @click.prevent="saveToHighlights"
          v-tooltip="'Add to highlights'"
          v-if="isOwner(author.id) && !isCollections"
        />
        <div
          class="story-viewer bottom-btn story-viewer_clickable"
          v-if="
            isOwner(author.id) && currentStory.viewersCount && !isCollections
          "
          @click="openViewersModal"
        >
          <span class="looking btn-icon icn-item icn-size_lg" />{{
            viewersText
          }}
        </div>
        <button
          @click="openTip"
          v-if="!isOwner(author.id) && author.canEarn"
          type="button"
          class="btn-tip bottom-btn"
          :class="{ selected: activeTip }"
        >
          <span class="btn-icon icn-tips icn-item" v-tooltip="'Tip'"></span>
        </button>
        <span
          class="bottom-btn"
          v-if="!isMine"
          @click="openComments"
          :class="{ selected: activeComments && showComments }"
        >
          <span
            class="btn-icon comments icn-item icn-size_lg"
            v-tooltip="'Comments'"
          />
        </span>
        <span
          class="btn-send bottom-btn icn-item"
          v-tooltip="'Redirects amount'"
          v-if="isOwner(author.id) && hasRedirectUrl"
        >
          {{ getRedirectCounter }}
        </span>
      </div>
      <button
        type="button"
        class="close close_light icn-item icn-size_lg"
        @click="closePage"
      />
      <div
        :class="['play-button-wrapper', { hidden: !showVideoPlay }]"
        ref="videoPlayButton"
      >
        <div class="play-button"></div>
      </div>
      <div class="swipeFooter" :class="{ visible: showSwipeFooter }">
        <span class="swipeFooter_content" @click="handleRedirect">
          {{ getLinkTitle }}
        </span>
      </div>
    </template>
    <div
      class="loader-container loader-container_center processing-loader"
      v-if="!isReady || loadingFinal"
    >
      <Loader
        v-if="!isReady"
        :fullscreen="false"
        text="Media is processing..."
        :semidark="true"
        class="text-light processing-loader"
      />
      <Loader
        v-else-if="loadingFinal"
        :fullscreen="false"
        class="text-light processing-loader"
        :semidark="true"
      />
    </div>

    <div
      class="stories-collection-overlay"
      :class="{ show: showTitle }"
      v-if="isCollections"
    >
      <div class="stories-collection-name">
        {{ collection.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";
import StoryTimer from "@/helpers/StoryTimer";
import ClickOutside from "vue-click-outside";
import Tip from "@/components/common/tip/User";
import ModalRouterParams from "@/mixins/modalRouter/params";
import Vue2TouchEvents from "vue2-touch-events";

Vue.use(Vue2TouchEvents);

export default {
  name: "StoryPage",
  mixins: [User, ModalRouterParams],
  components: {
    Loader,
    Tip
  },
  data() {
    return {
      showTitle: this.$route.meta.collections,
      isCollections: this.$route.meta.collections,
      currIndex: 0,
      currActiveIndex: -1,
      timer: undefined,
      videos: [],
      videoProgress: {},
      showDropdownMenu: false,
      showLoader: false,
      showVideoPlay: false,
      copied: false,
      isPaused: false,
      videoDoesNotExists: false,
      showTip: false,
      showComments: false,
      comment: "",
      activeTip: false,
      activeComments: true,
      forceWaitingEvent: false,
      showSwipeFooter: false
    };
  },
  computed: {
    collection() {
      return this.$store.state.stories.page.collection || {};
    },
    length() {
      return this.$store.state.stories.page.posts.length;
    },
    stories() {
      return this.$store.state.stories.page.posts;
    },
    error() {
      return this.$store.state.stories.page.error;
    },
    author() {
      return this.$store.state.stories.page.user;
    },
    loading() {
      return this.$store.state.stories.page.loading;
    },
    loadingFinal() {
      if (this.videoDoesNotExists) {
        return false;
      }
      return this.loading || this.showLoader || !this.currentStory;
    },
    isReady() {
      if (!this.currentStory) {
        return true;
      }
      return this.currentStory.isReady;
    },
    userId() {
      // console.log(this.$store.state.modalRouter);
      return this.routeParams.userId;
    },
    currentStory() {
      if (!this.stories) {
        return;
      }
      return this.stories[this.currIndex];
    },
    newPost() {
      return this.$store.state.story.newPost;
    },
    deletedPost() {
      return this.$store.state.story.deletedPost;
    },
    viewersText() {
      if (!this.currentStory) return;

      const { viewersCount, viewers } = this.currentStory;
      const othersCount = viewersCount - 2;
      const othersText = othersCount > 0 ? ` and ${othersCount} others` : "";
      const firstTwo = viewers
        .slice(0, 2)
        .map(el => el.name)
        .join(", ");

      return `${firstTwo}${othersText}`;
    },
    viewersPage() {
      return this.$store.state.modal.storyViewers.show;
    },
    chooseHighlightPage() {
      return this.$store.state.modal.chooseHighlight.show;
    },
    isMine() {
      return this.isOwner(this.author.id);
    },
    isFollowedOrFollowing() {
      return this.author.followedBy || this.author.followedOn;
    },
    hasRedirectUrl() {
      return !!(this.currentStory.linkTitle && this.currentStory.linkUrl);
    },
    getLinkTitle() {
      return this.currentStory.linkTitle;
    },
    getRedirectCounter() {
      return this.currentStory.redirectCounter || "0";
    }
  },
  methods: {
    bottomSwipeHandler() {
      if (this.hasRedirectUrl) {
        this.showSwipeFooter = false;
      }
    },
    topSwipeHandler() {
      if (this.hasRedirectUrl) {
        this.showSwipeFooter = true;
      }
    },
    handleRedirect() {
      if (this.hasRedirectUrl) {
        this.saveRedirectLinkStat();
        window.open(this.currentStory.linkUrl);
      }
    },
    addLinkModal() {
      this.pause();
      this.showDropdownMenu = false;
      this.$store.dispatch("modal/show", {
        name: "addRedirectLink",
        data: {
          storyId: this.currentStory.id,
          linkUrl: this.currentStory.linkUrl,
          linkTitle: this.currentStory.linkTitle,
          cb: this.resume
        }
      });
    },
    openTip() {
      this.pause();
      this.showComments = false;
      this.showTip = true;
      this.activeTip = true;
      this.activeComments = false;
    },
    closeTip() {
      this.resume();
      this.showTip = false;
      this.$refs.tip.reset();
    },
    openComments() {
      if (!this.isFollowedOrFollowing) {
        this.$store.dispatch(
          "global/flashToast",
          {
            text: "You need to follow user to send a message",
            type: "warning"
          },
          {
            root: true
          }
        );
        return;
      }
      this.pause();
      this.showComments = true;
      this.showTip = false;
      this.activeTip = false;
      this.activeComments = true;
    },
    next() {
      if (this.currIndex === this.length - 1) {
        this.findNextUserStory();
        return;
      }

      this.currIndex += 1;
    },
    runProgress() {
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
    launchImage() {
      // this.showLoader = true;

      this.$refs.storyItem.onload = () => {
        this.timer = new StoryTimer(() => this.next(), 4000);
        // this.showLoader = false;

        setTimeout(() => {
          this.currActiveIndex = this.currIndex;
        }, 99);
      };
    },
    launchVideo() {
      const videoId = this.currentStory.id;
      const videoTag = this.$refs.storyItem;

      this.$refs.storyItem.onerror = () => {
        this.videoDoesNotExists = true;
      };

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
          this.forceWaitingEvent = true;
          this.showLoader = false;
          this.showVideoPlay = true;
          if (this.$refs.videoPlayButton) {
            this.$refs.videoPlayButton.addEventListener(
              "click",
              this.launchVideo
            );
          }
        });
    },
    activateVideoEvents() {
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
    deactivateVideoEvents() {
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
    videoEventTimeupdate() {
      const videoId = this.currentStory.id;
      const videoTag = this.videos[videoId];

      if (videoTag) {
        this.videoProgress = {
          [videoId]: (videoTag.currentTime * 100) / videoTag.duration
        };
      }
    },
    videoEventEnded() {
      this.deactivateVideoEvents();
      this.next();
    },
    resetState() {
      if (this.timer) {
        this.timer.kill();
        delete this.timer;
      }

      this.deactivateVideoEvents();
      this.videos = {};
      this.showLoader = false;
    },
    findNextUserStory() {
      const userIds = [...this.$store.state.common.storyList];
      const userId = userIds.shift();

      if (userId) {
        this.$store.dispatch("common/setStoryList", {
          storyList: userIds
        });

        this.currActiveIndex = -1;
        this.goTo(`/stories/${userId}`);
      } else {
        this.closePage();
      }
    },
    preloadNextImages() {
      const nextStory = this.findNextStory();
      if (nextStory) {
        const img = new Image();
        img.src = this.imageSource(nextStory);
      }
    },
    imageSource(story) {
      return story.src.source || story.preview.source;
    },
    findNextStory() {
      if (this.stories[this.currIndex + 1]) {
        return this.stories[this.currIndex + 1];
      } else {
        return null;
      }
    },
    closePage() {
      this.resetState();
      this.$store.dispatch("common/resetStoryList");
      if (this.mode === "modal") {
        // closing modal-router
        this.close();
        return;
      }
      if (global.storyFirstEnter) {
        this.$router.push("/");
      } else {
        this.$router.go(-1);
      }
    },
    pause() {
      this.isPaused = true;

      const { mediaType, id } = this.currentStory;

      if (this.timer) {
        this.timer.pause();
      }

      if (mediaType === "video") {
        const videoTag = this.videos[id];
        videoTag.pause();
      }
    },
    resume() {
      this.isPaused = false;

      if (this.timer) {
        this.timer.resume();
      }

      if (this.currentStory.mediaType === "video") {
        const videoTag = this.videos[this.currentStory.id];
        videoTag.play();
      }
    },
    deleteStory() {
      this.hideDropdown();

      this.$store.dispatch("story/deletePost", {
        postId: this.currentStory.id
      });

      this.$store.dispatch(
        "global/flashToast",
        { text: "Story deleted" },
        {
          root: true
        }
      );

      if (this.currIndex === this.length - 1) {
        if (this.stories.length === 1) {
          this.$store.dispatch("story/removePost", {
            authorId: this.$store.state.auth.user.id
          });
        }
        this.closePage();
      }
    },
    storySettings() {
      this.$router.push("/settings/story");
    },
    saveToHighlights() {
      this.pause();
      this.$store.dispatch("modal/show", {
        name: "chooseHighlight",
        data: {
          storyId: this.currentStory.id
        }
      });
    },
    videoEventPlay() {
      if (this.currentStory.mediaType === "video") {
        const videoTag = this.videos[this.currentStory.id];
        videoTag.muted = false;
      }
    },
    videoEventWaiting() {
      if (this.forceWaitingEvent) {
        return;
      }
      this.showLoader = true;
    },
    videoEventPlaying() {
      this.showVideoPlay = false;
      this.showLoader = false;
    },
    addNewStory() {
      if (this.isOwner(this.author.id)) {
        this.pause();
        document.getElementById("storyFileSelect").click();
      }
    },
    openDropdown() {
      this.showDropdownMenu = true;
      this.pause();
    },
    hideDropdown() {
      if (this.showDropdownMenu) {
        this.showDropdownMenu = false;
        this.resume();
      }
    },
    init() {
      this.resetState();
      this.$store.dispatch("stories/page/resetPageState");
      if (this.isCollections) {
        this.$store.dispatch("stories/page/getCollection", { id: this.userId });
      } else {
        this.$store.dispatch("stories/page/getUserPosts", {
          userId: this.userId
        });
      }
    },
    openViewersModal() {
      this.$store.dispatch("modal/show", {
        name: "storyViewers",
        data: {
          stories: this.stories,
          currIndex: this.currIndex,
          fromCollection: this.isCollections
        }
      });
    },
    saveRedirectLinkStat() {
      this.$root.ws.send({
        act: "collect",
        message: "story_link_redirect",
        data: {
          story_user_id: this.author.id,
          story_id: this.currentStory.id,
          link_url: this.currentStory.linkUrl
        }
      });
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
    },
    editHighlight() {
      this.hideDropdown();
      this.pause();
      this.$store.dispatch("modal/show", {
        name: "createHighlights",
        data: {
          editMode: true,
          collection: this.collection
        }
      });
    },
    removeFromHighlight() {
      this.pause();
      if (this.length === 1) {
        this.removeHighlight();
      } else {
        this.$store
          .dispatch("highlights/removeStoryFromCollection", {
            collection: this.collection,
            storyId: this.currentStory.id
          })
          .then(() => {
            global.document.location.reload();
          });
      }
    },
    copyHighlightLink() {
      this.$copyText(global.document.location.href).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      });
    },
    removeHighlight() {
      this.pause();
      this.$store
        .dispatch("highlights/removeCollection", {
          collection: this.collection
        })
        .then(() => {
          this.$router.push(`/${this.user.username}`);
        });
    },
    sendComment() {
      if (!this.comment.trim()) {
        this.comment = "";
        return;
      }

      this.$store.dispatch("chat/sendMessage", {
        userId: this.author.id,
        data: {
          text: "Story message: " + this.comment,
          storyId: this.currentStory.id
        }
      });

      this.$store.commit("global/toastShowTrigger", {
        text: `Message has sent to ${this.author.username} chat`,
        type: "success"
      });

      this.comment = "";
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
    setTimeout(() => {
      this.showTitle = false;
    }, 3000);
  },
  directives: {
    ClickOutside
  },
  watch: {
    chooseHighlightPage() {
      if (this.chooseHighlightPage) {
        this.pause();
      } else {
        this.resume();
      }
    },
    viewersPage() {
      if (this.viewersPage) {
        this.pause();
      } else {
        this.resume();
      }
    },
    error() {
      if (this.error) {
        console.log("error", this.error);
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
    currIndex() {
      this.showSwipeFooter = false;
    },
    currentStory() {
      if (!this.currentStory) return;

      this.resetState();
      this.$nextTick(() => {
        this.runProgress();
      });
      this.showSwipeFooter = false;
      this.saveStat();
      this.preloadNextImages();
    },
    $route() {
      this.init();
    },
    newPost() {
      this.init();
    },
    deletedPost() {
      this.init();
    },
    asideType() {
      if (this.asideType === "comments") {
        this.$nextTick(() => {
          this.$refs.commentInput.focus();
        });
      } else {
        this.newComment = "";
      }
    }
  },
  beforeDestroy() {
    this.resetState();
  }
};
</script>

<style lang="scss" scoped>
.swipeLink {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;
  & > p {
    cursor: pointer;
  }
}
.swipeLink_mobile {
  bottom: 20px;
  font-size: 12px;
  &.moveBottom {
    bottom: 0;
  }
}
.swipeFooter {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
  height: 50px;
  color: white;
  transform: translateY(150px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  &.visible {
    transform: translateY(0px);
  }
  .swipeFooter_content {
    background-color: rgba(95, 95, 95, 0.85);
    padding: 10px 40px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
