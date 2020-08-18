<template>
  <div
    class="media"
    :style="mediaStyle"
    :class="{
      maxHeight: medias.type === 'processing',
      minHeight: medias.type === 'processing'
    }"
  >
    <!-- <div
    class="media"
    :class="{
      maxHeight: $mq === 'mobile' || medias.type === 'processing',
      minHeight:
        getMediaViewType(medias) === 'Locked' || medias.type === 'processing'
    }"
  > -->
    <div
      class="loader-container loader-container_center"
      v-if="medias.type === 'processing'"
    >
      <Loader
        :fullscreen="false"
        text="Media is currently processing"
        :semidark="true"
        class="processing-loader text-light"
        :small="true"
      />
    </div>
    <template v-else>
      <template v-if="post.mediaSet && post.mediaSet.length">
        <swiper
          ref="mySwiper"
          class="media-slider"
          :options="swiperOption"
          :key="uniqId"
        >
          <swiperSlide :key="media.id" v-for="media in post.mediaSet">
            <component
              :is="getMediaViewType(media)"
              :media="media"
              :postId="postId"
              :post="post"
              :authorId="authorId"
              :openModal="openModal"
              :mediaSize="mediaSize"
              :autoplay="autoplay"
              @playCallback="$emit('playCallback')"
              ref="media"
              :showPreview="showPreview"
              :isAuthor="isAuthor"
            />
          </swiperSlide>
        </swiper>
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
      <figure v-else class="media-item active">
        <component
          :is="getMediaViewType(medias)"
          :media="medias"
          :postId="postId"
          :post="post"
          :authorId="authorId"
          :openModal="openModal"
          :mediaSize="mediaSize"
          :autoplay="autoplay"
          @playCallback="$emit('playCallback')"
          ref="media"
          :showPreview="showPreview"
          :isAuthor="isAuthor"
        />
      </figure>
    </template>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Locked from "@/components/common/profile/media/content/Locked";
import Video from "@/components/common/profile/media/content/Video";
import Photo from "@/components/common/profile/media/content/Photo";
import PhotoLinked from "@/components/common/profile/media/content/PhotoLinked";
import Audio from "@/components/common/profile/media/content/Audio";
import LockedAudio from "@/components/common/profile/media/content/LockedAudio";
import Loader from "@/components/common/Loader";
import VideoLinked from "@/components/common/profile/media/content/VideoLinked";

export default {
  name: "Media",
  components: {
    Locked,
    Video,
    VideoLinked,
    Loader,
    Audio,
    LockedAudio,
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
  props: {
    medias: {
      type: Object,
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
    },
    showPreview: Boolean,
    isAuthor: Boolean
  },
  computed: {
    mediaStyle() {
      return this.medias && this.medias.background
        ? {
            "background-image": `url(data:image/jpeg;base64,${
              this.medias.background
            })`
          }
        : {};
    },
    postId() {
      return this.post.id;
    }
  },
  methods: {
    getMediaViewType({ canView, type }) {
      const LinkedPrefix = this.shouldHasLink ? "Linked" : "";

      if (!canView && type === "audio") return "LockedAudio";
      if (!canView) return "Locked";
      if (type === "gif") return `Gif${LinkedPrefix}`;
      if (type === "photo") return `Photo${LinkedPrefix}`;
      if (type === "video") return `Video${LinkedPrefix}`;
      if (type === "audio") return `Audio`;

      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.media {
  flex-grow: 2 !important;
  &:after {
    display: none !important;
  }
  &.maxHeight {
    max-height: 350px;
  }
  &.minHeight {
    min-height: 300px;
  }
}
.media-item {
  .active {
    width: 100%;
  }
}
</style>
