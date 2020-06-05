<template>
  <div class="media-wrapper">
    <template v-if="showPreviewVideo">
      <template
        v-if="
          media.videoPreview.status &&
            media.videoPreview.status === 'processing'
        "
      >
        <div
          class="media maxHeight minHeight previewLoader"
          :class="{ previewLoaderMobile: $mq === 'mobile' }"
        >
          <div class="loader-container loader-container_center">
            <Loader
              :fullscreen="false"
              text="Media is currently processing"
              :semidark="true"
              class="processing-loader text-light"
              :small="true"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <video
          class="video-content"
          :class="{ halfHeight: $mq === 'desktop' }"
          disableremoteplayback
          webkit-playsinline
          playsinline
          controls
          controlslist="nodownload"
          :autoplay="autoplay"
          loop
          v-if="video"
          @play="play"
          @contextmenu.prevent="() => false"
          @dragstart.prevent="() => false"
          ref="video"
          :src="media.videoPreview.source"
          type="video/mp4"
        />
      </template>
    </template>
    <template v-else-if="followersOnly">
      <div class="locked-picture icn-item icn-pos_center">
        <video
          class="video-content"
          :class="{ halfHeight: $mq === 'desktop' }"
          disableremoteplayback
          webkit-playsinline
          playsinline
          :controls="false"
          controlslist="nodownload"
          :autoplay="true"
          loop
          @click="registerOrFollow"
          :poster="media.preview.source"
          v-if="video"
          @play="play"
          @contextmenu.prevent="() => false"
          @dragstart.prevent="() => false"
          ref="video"
          :src="media.videoPreview.source"
          type="video/mp4"
        />
      </div>
    </template>
    <template v-else>
      <video
        class="video-content"
        :class="{ halfHeight: $mq === 'desktop' }"
        disableremoteplayback
        webkit-playsinline
        playsinline
        :controls="canPlay"
        controlslist="nodownload"
        :autoplay="autoplay"
        loop
        @click="checkAccess"
        :poster="media.preview.source"
        v-if="video"
        @play="play"
        @contextmenu.prevent="() => false"
        @dragstart.prevent="() => false"
        ref="video"
        :src="video.source"
        type="video/mp4"
      />
    </template>
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";
import Loader from "@/components/common/Loader";

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin],
  props: {
    post: Object,
    authorId: Number,
    autoplay: Boolean,
    media: Object,
    showPreview: Boolean,
    isAuthor: Boolean,
    openModal: Function
  },
  components: {
    Loader
  },
  data() {
    return {
      video: this.media.src,
      playTimer: 0,
      playDuration: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    videoHeight() {
      const ratio = global.innerWidth / this.media.preview.width;
      return this.media.preview.height * ratio;
    },
    followersOnly() {
      return (
        !this.canPlay &&
        this.post.media.videoPreview &&
        this.post.media.videoPreview.source
      );
    },
    showPreviewVideo() {
      if (
        this.isAuthor &&
        this.post.media.videoPreview &&
        this.post.media.videoPreview.source &&
        this.showPreview
      ) {
        return true;
      }
      return false;
    },
    canPlay() {
      if (
        !this.isAuthor &&
        this.post.followRequired &&
        (!this.user || !this.post.author.followedBy)
      ) {
        return false;
      }
      return true;
    }
  },
  watch: {
    media() {
      this.video = undefined;
      setTimeout(() => {
        this.video = this.media.src;
      }, 100);
    }
  },
  methods: {
    play() {
      this.playTimer = new Date().getTime();
      this.$emit("playCallback");
    },
    checkAccess(e) {
      if (!this.canPlay) {
        e.preventDefault();
        this.registerOrFollow();
        return;
      }
    },
    registerOrFollow() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () =>
              this.$router.push(`/${this.post.author.username}/media`)
          }
        });
      } else if (!this.post.author.followedBy) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            text:
              "You need to follow this model to watch the media content. Do you want to follow?",
            success: () => {
              this.$store
                .dispatch(`profile/home/follow`, this.post.author.id)
                .then(() => {
                  this.$store.commit("profile/media/updateFollowStatus", null, {
                    root: true
                  });
                });
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.video-content {
  width: 100%;
  height: 360px;
  margin: auto;
  &.halfHeight {
    height: 50vh !important;
  }
}
.previewLoader {
  height: 300px;
  width: 620px !important;
  margin: auto !important;
}
.previewLoaderMobile {
  width: 100vw !important;
}
</style>
