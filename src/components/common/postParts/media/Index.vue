<template>
  <div class="media" :style="mediaStyle">
    <div class="lds-dual-ring transparent small with-text not-fullscreen">
      <div class="loader-text">Media is currently processing</div>
    </div>
    <template v-if="medias.length > 1 && showSlider">
      <swiper ref="mySwiper" class="media-slider" :options="swiperOption" :key="uniqId">
        <swiperSlide :key="key" v-for="(media, key) in medias" >
          <component
            :is="getMediaViewType(medias[key])"
            :media="medias[key]"
            :postId="postId"
            :openModal="openModal"
            :mediaSize="mediaSize"
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
          :openModal="openModal"
          :mediaSize="mediaSize"
        />
      </figure>
    </template>
    <template v-if="medias.length > 1 && showSlider">
      <div :class="`media-slider-pagination pagination-${uniqId}`" :style="{ zIndex: 999 }" />
      <div :class="`media-slider-navigation navigation-${uniqId}`" v-if="$mq === 'desktop'">
        <span :class="`btn-prev btn-prev-${uniqId}`" :style="{ zIndex: 999 }"/>
        <span :class="`btn-next btn-next-${uniqId}`" :style="{ zIndex: 999 }"/>
      </div>
    </template>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Locked from "./content/Locked";
import Video from "./content/Video";
import VideoLinked from "./content/VideoLinked";
import Gif from "./content/GifLinked";
import GifLinked from "./content/GifLinked";
import Photo from "./content/Photo";
import PhotoLinked from "./content/PhotoLinked";

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
    swiperSlide
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
      }
    };
  },
  computed: {
    mediaStyle() {
      return this.mediaSize === "full" &&
        this.medias.length &&
        this.medias[this.activeSlide].background
        ? {
            "background-image": `url(data:image/jpeg;base64,${
              this.medias[this.activeSlide].background
            })`
          }
        : {};
    }
  },
  props: {
    medias: {
      type: Array,
      required: true
    },
    showSlider: {
      type: Boolean,
      required: true
    },
    shouldHasLink: {
      type: Boolean,
      required: true
    },
    postId: {
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
    }
  },
  methods: {
    getMediaViewType({ canView, type }) {
      const LinkedPrefix = this.shouldHasLink ? "Linked" : "";

      if (!canView) return "Locked";
      if (type === "gif") return `Gif${LinkedPrefix}`;
      if (type === "photo") return `Photo${LinkedPrefix}`;
      if (type === "video") return `Video${LinkedPrefix}`;

      throw new Error("Invalid media format");
    }
  }
};
</script>
