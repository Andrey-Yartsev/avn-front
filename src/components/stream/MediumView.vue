<template>
  <div
    class="explore-item explore-item_col explore-item_col-4 liveView"
    @click="run"
  >
    <div class="postLink live">
      <figure
        class="explore-media"
        :class="{
          'explore-media_avatar': this.post.user.avatar === null && !imageSrc
        }"
      >
        <img
          :src="imageSrc"
          @contextmenu.prevent="() => false"
          @dragstart.prevent="() => false"
          v-if="this.post.user.avatar !== null || imageSrc"
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
            <span class="name">{{ user.name }} </span>
            <span v-if="user.isVerified" class="verified-user icn-item" />
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
export default {
  name: "Live",
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    interval: undefined,
    imageSrc: undefined
  }),
  computed: {
    user() {
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
    }
  },
  methods: {
    run() {
      this.$store.dispatch("modal/show", {
        name: "stream",
        data: {
          stream: this.post
        }
      });
    },
    updateMediaSrc() {
      const random = Math.random().toFixed(3) * 1000;
      this.imageSrc = `${this.post.thumbUrl}?v=${random}`;
    }
  },
  mounted() {
    this.imageSrc = this.post.user.avatar;
    this.interval = setInterval(() => {
      this.updateMediaSrc();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
