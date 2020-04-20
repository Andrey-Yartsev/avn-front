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
      <figure class="media-item active">
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
import Locked from "@/components/common/profile/media/content/Locked";
import Video from "@/components/common/profile/media/content/Video";
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
    LockedAudio
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
