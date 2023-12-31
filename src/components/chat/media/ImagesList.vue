<template>
  <div class="media-imagesList" :class="{ blurred: showBlurCover }">
    <div v-if="showBlurCover" class="blurImageCover" @click="hideBlurCover" />
    <template v-if="images.length > 1">
      <swiper
        ref="mySwiper"
        class="media-slider"
        :options="swiperOption"
        :key="uniqId"
      >
        <swiperSlide v-for="(media, index) in images" :key="media.id">
          <div
            class="media media-item"
            :class="{ isFree: !media.locked }"
            @click.stop="imageClick(media)"
          >
            <figure class="media-item active media-item_photo" data-index="0">
              <template v-if="!media.locked">
                <a
                  class="postLink"
                  :href="media.src.source"
                  target="_blank"
                  @click.prevent="openImageList(images, index)"
                >
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
                <div class="postLink">
                  <img
                    :src="`data:image/jpeg;base64,${media.locked}`"
                    :width="media.thumb.width"
                    :height="media.thumb.height"
                    class="media-content"
                    :style="{
                      width: `${media.thumb.width}px`,
                      height: `${media.thumb.height}px`
                    }"
                  />
                </div>
              </template>
            </figure>
          </div>
        </swiperSlide>
      </swiper>
    </template>
    <template v-else>
      <MediaImage :message="message" ref="img" />
    </template>
    <template v-if="images.length > 1">
      <div :class="`media-slider-pagination pagination-${uniqId}`" />
      <div
        :class="`media-slider-navigation navigation-${uniqId}`"
        v-if="$mq === 'desktop'"
      >
        <span
          @click.stop="() => {}"
          :class="
            `btn-direction btn-direction_lr-sides btn-direction_prev btn-direction_prev-left btn-prev btn-prev-${uniqId} icn-item icn-item icn-pos_center`
          "
        />
        <span
          @click.stop="() => {}"
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
import MediaImage from "./Image";

export default {
  name: "MediaImagesList",
  components: {
    MediaImage,
    swiper,
    swiperSlide
  },
  props: {
    images: Array,
    message: Object
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
    isOwner() {
      return this.$store.state.auth.user.id === this.message?.fromUser?.id;
    },
    showBlurCover() {
      return (
        this.$store.state.auth.user.blurIncomingMessages &&
        !this.isOwner &&
        this.blurImage
      );
    }
  },
  methods: {
    openImageList(images, index) {
      this.$store.dispatch("modal/show", {
        name: "imageSwiper",
        data: {
          images: images.filter(v => v.canView),
          index
        }
      });
    },
    hideBlurCover() {
      this.blurImage = false;
    },
    imageClick(media) {
      if (media.canView) {
        return;
      }
      this.$emit("clickPassed");
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
