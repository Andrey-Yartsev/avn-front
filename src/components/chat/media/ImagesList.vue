<template>
  <div>
    <template v-if="images.length > 1">
      <swiper
        ref="mySwiper"
        class="media-slider"
        :options="swiperOption"
        :key="uniqId"
      >
        <swiperSlide v-for="(media, index) in images" :key="media.id">
          <div class="media media-item">
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
      }
    };
  },
  methods: {
    openImageList(images, index) {
      console.log(images, index);
      this.$store.dispatch("modal/show", {
        name: "imageSwiper",
        data: {
          images,
          index
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.media-slider {
  & > div {
    width: 100% !important;
  }
}
</style>
