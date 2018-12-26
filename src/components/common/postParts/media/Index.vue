<template>
  <div class="media" :style="mediaStyle">
    <div class="lds-dual-ring transparent small with-text not-fullscreen">
      <div class="loader-text">Media is currently processing</div>
    </div>
    <template v-if="medias.length > 1 && showSlider">
      <div class="media-slider">
        <figure :key="key" v-for="(media, key) in medias" :class="[{ active: currentSlide === key }, 'media-item']">
          <component
            :is="getMediaViewType(media)"
            :media="media"
            :postId="postId"
            :openModal="openModal"
            :mediaSize="mediaSize"
            @click="nextSlide"

          />
        </figure>
      </div>
    </template>
    <template v-else>
      <figure :key="key" v-for="(media, key) in medias" class="media-item active">
        <component
          :is="getMediaViewType(media)"
          :media="media"
          :postId="postId"
          :openModal="openModal"
          :mediaSize="mediaSize"
        />
      </figure>
    </template>
    <template v-if="medias.length > 1 && showSlider">
      <div class="media-slider-pagination">
        <span
          :key="key" v-for="(media, key) in medias"
          :class=" [{ active: key === currentSlide }, 'item']"
          @click="currentSlide = key"
        ></span>
      </div>
      <div class="media-slider-navigation">
        <span :class="[{hidden: currentSlide === 0}, 'btn-prev']" @click="currentSlide -= 1"></span>
        <span
          :class="[{hidden: currentSlide === medias.length - 1}, 'btn-next']" class=""
          @click="currentSlide += 1"
        ></span>
      </div>
    </template>
  </div>
</template>

<script>
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
    PhotoLinked
  },
  data: () => ({
    currentSlide: 0
  }),
  computed: {
    mediaStyle() {
      return this.mediaSize === "full" &&
        this.medias.length &&
        this.medias[this.currentSlide].background
        ? {
            "background-image": `url(data:image/jpeg;base64,${
              this.medias[this.currentSlide].background
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
    },

    nextSlide() {
      if (this.medias.length - 1 === this.currentSlide) {
        this.currentSlide = 0;
      } else {
        this.currentSlide++;
      }
    }
  }
};
</script>
