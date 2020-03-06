<template>
  <div class="media" :style="mediaStyle">
    <StreamEvents
      v-if="hasStreamEvents && !streamEventsLoading"
      class="stream-events"
      :events="streamEvents"
      ref="streamEvents"
    />

    <div class="loader-container loader-container_center">
      <Loader
        :fullscreen="false"
        text="Media is currently processing"
        :semidark="true"
        class="processing-loader text-light"
        :small="true"
      />
    </div>
    <template v-if="medias.length > 1">
      <swiper
        ref="mySwiper"
        class="media-slider"
        :options="swiperOption"
        :key="uniqId"
      >
        <swiperSlide :key="key" v-for="(media, key) in medias">
          <component
            :is="getMediaViewType(medias[key])"
            :media="medias[key]"
            :postId="postId"
            :authorId="authorId"
            :openModal="openModal"
            :mediaSize="mediaSize"
            :autoplay="autoplay"
            @playCallback="$emit('playCallback')"
          />
        </swiperSlide>
      </swiper>
    </template>
    <template v-else>
      <figure v-if="medias.length" class="media-item active">
        <component
          :is="getMediaViewType(medias[0])"
          :media="medias[0]"
          :postId="postId"
          :post="post"
          :authorId="authorId"
          :openModal="openModal"
          :mediaSize="mediaSize"
          :autoplay="autoplay"
          @playCallback="$emit('playCallback')"
          ref="media"
        />
      </figure>
    </template>
    <template v-if="medias.length > 1">
      <div :class="`media-slider-pagination pagination-${uniqId}`" />
      <div
        :class="`media-slider-navigation navigation-${uniqId}`"
        v-if="$mq === 'desktop'"
      >
        <span
          :class="
            `btn-direction btn-direction_lr-sides btn-direction_prev btn-direction_prev-left btn-prev btn-prev-${uniqId} icn-item icn-item icn-pos_center`
          "
        />
        <span
          :class="
            `btn-direction btn-direction_lr-sides btn-direction_next btn-direction_next-right btn-next btn-next-${uniqId} icn-item icn-item icn-pos_center`
          "
        />
      </div>
    </template>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Locked from "./content/Locked";
import Video from "./content/Video";
import VideoLinked from "./content/VideoLinked";
import Audio from "./content/Audio";
import AudioLinked from "./content/AudioLinked";
import Gif from "./content/GifLinked";
import GifLinked from "./content/GifLinked";
import Photo from "./content/Photo";
import PhotoLinked from "./content/PhotoLinked";
import Loader from "@/components/common/Loader";
import StreamEvents from "./events/StreamEvents";

export default {
  name: "Media",
  components: {
    Locked,
    Video,
    VideoLinked,
    Gif,
    GifLinked,
    Photo,
    PhotoLinked,
    swiper,
    swiperSlide,
    Loader,
    StreamEvents,
    Audio,
    AudioLinked
  },
  data() {
    const uniqId = Math.random()
      .toString(36)
      .substr(2, 9);

    const self = this;
    return {
      uniqId,
      activeSlide: 0,
      swiperOption: {
        autoHeight: true,
        spaceBetween: 10,
        preloadImages: true,
        pagination: {
          el: `.pagination-${uniqId}`,
          clickable: true,
          bulletClass: "item",
          bulletActiveClass: "active"
        },
        navigation: {
          nextEl: `.btn-next.btn-next-${uniqId}`,
          prevEl: `.btn-prev.btn-prev-${uniqId}`,
          hiddenClass: "hidden",
          disabledClass: "hidden"
        },
        on: {
          slideChange() {
            self.activeSlide = this.activeIndex;
          }
        }
      },
      streamEventsIntervalId: 0
    };
  },
  props: {
    medias: {
      type: Array,
      required: true
    },
    shouldHasLink: {
      type: Boolean,
      required: true
    },
    post: {
      type: Object,
      required: true
    },
    authorId: {
      type: Number,
      required: true
    },
    openModal: {
      type: Function,
      default: undefined
    },
    mediaSize: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    mediaStyle() {
      return this.medias.length && this.medias[this.activeSlide].background
        ? {
            "background-image": `url(data:image/jpeg;base64,${
              this.medias[this.activeSlide].background
            })`
          }
        : {};
    },
    postId() {
      return this.post.id;
    },
    hasStreamEvents() {
      if (this.mediaSize !== "full") {
        return;
      }
      return !!this.post.streamId;
    },
    streamEventsLoading() {
      return this.$store.state.post.fetchStreamEventsLoading;
    },
    streamEvents() {
      return this.$store.state.post.fetchStreamEventsResult;
    }
  },
  methods: {
    getMediaViewType({ canView, type }) {
      const LinkedPrefix = this.shouldHasLink ? "Linked" : "";

      if (!canView) return "Locked";
      if (type === "gif") return `Gif${LinkedPrefix}`;
      if (type === "photo") return `Photo${LinkedPrefix}`;
      if (type === "video") return `Video${LinkedPrefix}`;
      if (type === "audio") return `Audio`;

      throw new Error("Invalid media format");
    },
    fetchStreamEvents() {
      this.$store.dispatch("post/fetchStreamEvents", this.post.streamId);
    }
  },
  watch: {
    medias() {
      this.activeSlide = 0;
    }
  },
  mounted() {
    if (this.hasStreamEvents) {
      this.fetchStreamEvents();
      this.$nextTick(() => {
        this.streamEventsIntervalId = setInterval(() => {
          if (!this.$refs.media) {
            return;
          }
          if (!this.$refs.streamEvents) {
            return;
          }
          if (!this.$refs.media.$refs.video) {
            return;
          }
          const time = this.$refs.media.$refs.video.currentTime;
          if (time !== this.$refs.streamEvents.currentTime) {
            this.$refs.streamEvents.currentTime = time;
          }
        }, 1000);
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.streamEventsIntervalId);
  }
};
</script>
