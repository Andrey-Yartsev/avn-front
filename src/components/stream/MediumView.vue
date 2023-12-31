<template>
  <div
    class="explore-item explore-item_col explore-item_col-4 liveView"
    @click="run"
  >
    <div class="postLink live">
      <figure
        class="explore-media"
        :class="{
          'explore-media_avatar': streamer.avatar === null && !imageSrc
        }"
      >
        <img
          :src="imageSrc"
          @contextmenu.prevent="() => false"
          @dragstart.prevent="() => false"
          v-if="streamer.avatar !== null || imageSrc"
        />
        <div
          v-if="$mq === 'desktop'"
          class="item-length item-length_live hidden-mobile"
        >
          <span class="value">{{ duraion }}</span>
          <span class="icn-item icn-live"></span>
        </div>
        <div class="stream-online-label" :class="{ small: $mq === 'mobile' }">
          live
        </div>
        <div class="overlay" />
        <div class="live-short-info">
          <span class="explore-media__counter">
            <span class="btn-icon icn-viewer icn-item icn-size_lg"></span>
            {{ post.viewsCount }}
          </span>

          <div class="wrap-name wrap-name_center">
            <span class="name">{{ streamer.name }} </span>
            <span
              class="verified-user icn-item"
              :class="{
                fullyMonetized: streamer.canEarn && streamer.canPayoutsRequest
              }"
              v-if="
                streamer.isVerified ||
                  (streamer.canEarn && streamer.canPayoutsRequest)
              "
            ></span>
          </div>
        </div>
        <div v-if="showLockIcon" class="lockIcon">
          <div class="locked-picture icn-item icn-pos_center"></div>
        </div>
      </figure>
    </div>
    <span class="explore-media__counter explore-media__counter_likes">
      <span class="btn-icon likes icn-item icn-size_lg"></span>
      {{ post.likesCount }}
    </span>
    <span class="explore-media__counter explore-media__counter_comments">
      <span class="btn-icon comments icn-item icn-size_lg"></span>
      {{ post.viewsCount }}
    </span>
  </div>
</template>

<script>
import AccessMixin from "@/components/stream/mixins/access";

export default {
  name: "Live",
  mixins: [AccessMixin],
  props: {
    post: {
      type: Object,
      required: true
    },
    updatePageData: {
      type: Function
    }
  },
  data: () => ({
    interval: undefined,
    imageSrc: undefined,
    showLockIcon: false
  }),
  computed: {
    streamer() {
      return this.post.user;
    },
    duraion() {
      const time = this.post.startedAt;
      const date = Math.round(new Date(time).getTime() / 1000);
      const today = Math.round(Date.now() / 1000);
      const diff = today - date;
      let hours;
      let minutes;
      let result = "";
      if (3600 <= diff) {
        hours = Math.floor(diff / 3600);
        result = hours + " h";
      } else if (60 <= diff) {
        minutes = Math.ceil(diff / 300) * 5;
        result = minutes + " min";
      }
      return result;
    },
    subsUpdate() {
      return this.$store.state.subscription.updated;
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    subsUpdate(data) {
      if (data.action === "subscribe") {
        if (data.data.userId === this.streamer.id) {
          this.openStream(this.post);
          this.updateViewStatus();
        }
      }
    }
  },
  methods: {
    updateViewStatus() {
      this.showLockIcon = false;
      this.interval = setInterval(() => {
        this.updateMediaSrc();
      }, 5000);
    },
    run() {
      this.tryOpenStream(this.streamer, this.post, stream => {
        this.openStream(stream);
        this.updateViewStatus();
      });
    },
    updateMediaSrc() {
      const random = Math.random().toFixed(3) * 1000;
      this.imageSrc = `${this.post.thumbUrl}?v=${random}`;
    },
    checkPermission() {
      if (!this.user) {
        if (this.post.user.restrictLivePreview) {
          this.showLockIcon = true;
        } else {
          this.interval = setInterval(() => {
            this.updateMediaSrc();
          }, 5000);
        }
      } else {
        if (
          this.post.type === "subscribers" &&
          !this.$store.state.auth.connectedData.subscribe.includes(
            this.post.user.id
          ) &&
          this.post.user.restrictLivePreview
        ) {
          this.showLockIcon = true;
          return;
        } else if (
          this.post.type === "followers" &&
          !this.$store.state.auth.connectedData.follow.includes(
            this.post.user.id
          ) &&
          this.post.user.restrictLivePreview
        ) {
          this.showLockIcon = true;
          return;
        } else if (
          this.post.type === "list" &&
          this.post.listOptions.listType == "public" &&
          !this.$store.state.auth.connectedData.groups.includes(
            this.post.listOptions.listId
          ) &&
          this.post.user.restrictLivePreview
        ) {
          this.showLockIcon = true;
          return;
        } else {
          this.interval = setInterval(() => {
            this.updateMediaSrc();
          }, 5000);
        }
      }
    }
  },
  mounted() {
    this.imageSrc = this.streamer.avatar;
    this.checkPermission();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss" scoped>
.lockIcon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
.stream-online-label {
  left: 16px;
  top: 16px;
  &.small {
    left: 6px;
    top: 6px;
    font-size: 8px;
  }
}
</style>
