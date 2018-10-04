<template>
    <div class="media">
        <template v-if="medias.length > 1 && showSlider">
            <div class="media-slider">
                <figure :key="key" v-for="(media, key) in medias" :class="[{ active: currentSlide === key }, 'media-item']">
                    <component :is="getMediaViewType(media)" :media="media" :postId="postId"></component>
                </figure>
            </div>
        </template>
        <template v-else >
            <figure :key="key" v-for="(media, key) in medias" class="media-item active">
                <component :is="getMediaViewType(media)" :media="media" :postId="postId"></component>
            </figure>
        </template>
        <template v-if="medias.length > 1 && showSlider">
            <div class="media-slider-pagination">
                <span :key="key" v-for="(media, key) in medias" :class=" [{ active: key === currentSlide }, 'item']" @click="currentSlide = key"></span>
            </div>
            <div class="media-slider-navigation">
                <span :class="[{hidden: currentSlide === 0}, 'btn-prev']" @click="currentSlide -= 1"></span>
                <span :class="[{hidden: currentSlide === medias.length - 1}, 'btn-next']" class="" @click="currentSlide += 1"></span>
            </div>
        </template>
    </div>
</template>

<script>
import Locked from "./content/Locked";
import Video from "./content/Video";
import Gif from "./content/Gif";
import Photo from "./content/Photo";
import PhotoLinked from "./content/PhotoLinked";

export default {
  name: "Media",
  components: {
    Locked,
    Video,
    Gif,
    Photo,
    PhotoLinked
  },
  data: () => ({
    currentSlide: 0
  }),
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
    }
  },
  methods: {
    getMediaViewType({ canView, type }) {
      if (!canView) return "Locked";
      if (type === "video") return "Video";
      if (type === "gif" && this.shouldHasLink) return "Gif";
      if (type === "gif" && !this.shouldHasLink) return "Photo";
      if (type === "photo" && this.shouldHasLink) return "PhotoLinked";
      if (type === "photo" && !this.shouldHasLink) return "Photo";

      return "Image";
    }
  }
};
</script>
