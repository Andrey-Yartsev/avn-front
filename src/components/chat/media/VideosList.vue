<template>
  <div class="media-imagesList" :class="{ blurred: showBlurCover }">
    <div v-if="showBlurCover" class="blurImageCover" @click="hideBlurCover" />
    <template v-if="videos.length > 1">
      <swiper
        ref="mySwiper"
        class="media-slider"
        :options="swiperOption"
        :key="uniqId"
      >
        <swiperSlide v-for="(media, index) in videos" :key="media.id">
          <div class="media media-item">
            <figure class="media-item active media-item_photo" data-index="0">
              <template v-if="isMyMessage || isFree || isUnlocked">
                <a
                  class="postLink video-placeholder icn-item rounded-corners"
                  :class="{ processing }"
                  :href="media.src.source"
                  target="_blank"
                  @click.prevent="openVideosList(message, videos, index)"
                >
                  <span
                    class="loader-container loader-container_center"
                    v-if="processing"
                  >
                    <Loader
                      :fullscreen="false"
                      text="Media is currently processing"
                      :semidark="true"
                      class="processing-loader rounded-corners text-light"
                      :small="true"
                    />
                  </span>
                  <img
                    :src="media.thumb.source"
                    :class="{ 'no-media-text': !message.textLength }"
                    :width="media.thumb.width"
                    :height="media.thumb.height"
                    class="media-content"
                  />
                </a>
              </template>
              <template v-else>
                <div
                  class="postLink video-placeholder icn-item rounded-corners"
                >
                  <div
                    class="loader-container loader-container_center"
                    v-if="processing"
                  >
                    <Loader
                      :fullscreen="false"
                      text="Media is currently processing"
                      class="processing-loader rounded-corners text-light"
                      :small="true"
                      :semidark="true"
                    />
                  </div>
                  <img
                    :src="media.thumb.source"
                    :class="{ 'no-media-text': !message.textLength }"
                    :width="media.thumb.width"
                    :height="media.thumb.height"
                    class="media-content"
                  />
                </div>
              </template>
            </figure>
          </div>
        </swiperSlide>
      </swiper>
    </template>
    <template v-else>
      <VideoPreview :message="message" :ref="'video' + message.id" />
    </template>
    <template v-if="videos.length > 1">
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
import VideoPreview from "./VideoPreview";
import User from "@/mixins/user";
import Loader from "@/components/common/Loader";

export default {
  name: "MediaVideosList",
  components: {
    VideoPreview,
    swiper,
    swiperSlide,
    Loader
  },
  mixins: [User],
  props: {
    videos: Array,
    message: Object,
    play: Function
  },
  data() {
    const uniqId = Math.random()
      .toString(36)
      .substr(2, 9);
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
      blurImage: true
    };
  },
  computed: {
    processing() {
      return !this.message.isMediaReady;
    },
    isFree() {
      return this.message.isFree;
    },
    isUnlocked() {
      return this.message.isOpened && !this.message.isFree;
    },
    isMyMessage() {
      return this.message.fromUser.id === this.user.id;
    },
    showBlurCover() {
      return (
        this.$store.state.auth.user.blurIncomingMessages &&
        !this.isMyMessage &&
        this.blurImage
      );
    }
  },
  methods: {
    openVideosList(message, videos, index) {
      this.$store.dispatch("modal/show", {
        name: "videoSwiper",
        data: {
          message,
          videos,
          index
        }
      });
    },
    hideBlurCover() {
      this.blurImage = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.media-imagesList {
  position: relative;
  .blurImageCover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    z-index: 3;
  }
}
.media-slider {
  & > div {
    width: 100% !important;
  }
}
</style>
