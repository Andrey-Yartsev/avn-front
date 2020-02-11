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
        <div class="overlay" />
        <div class="live-short-info">
          <span class="explore-media__counter">
            <span class="btn-icon icn-viewer icn-item icn-size_lg"></span>
            {{ post.viewsCount }}
          </span>

          <div class="wrap-name wrap-name_center">
            <span class="name">{{ streamer.name }} </span>
            <span v-if="streamer.isVerified" class="verified-user icn-item" />
          </div>
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
import Access from "./access";

export default {
  name: "Live",
  mixins: [Access],
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
    imageSrc: undefined
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
    }
  },
  watch: {
    subsUpdate(data) {
      if (data.action === "subscribe") {
        if (data.data.userId === this.streamer.id) {
          this.openStream();
        }
      }
    }
  },
  methods: {
    run() {
      this.tryOpenStream(this.streamer, this.post, stream => {
        this.openStream(stream);
      });
    },
    updateMediaSrc() {
      const random = Math.random().toFixed(3) * 1000;
      this.imageSrc = `${this.post.thumbUrl}?v=${random}`;
    },
    async checkPermission() {
      try {
        await this.shouldBeUpdated(this.post);
        this.interval = setInterval(() => {
          this.updateMediaSrc();
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    this.imageSrc = this.streamer.avatar;
    this.checkPermission();
    // this.interval = setInterval(() => {
    //   this.updateMediaSrc();
    // }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
