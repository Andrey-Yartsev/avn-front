<template>
  <div
    class="media"
    :class="{ maxHeight: $mq === 'mobile' }"
    :style="mediaStyle"
  >
    <!-- <div class="loader-container loader-container_center">
      <Loader
        :fullscreen="false"
        text="Media is currently processing"
        :semidark="true"
        class="processing-loader text-light"
        :small="true"
      />
    </div> -->
    <template>
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
        />
      </figure>
    </template>
  </div>
</template>

<script>
import Locked from "@/components/common/profile/media/content/Locked";
import Video from "@/components/common/profile/media/content/Video";
import Loader from "@/components/common/Loader";
import VideoLinked from "@/components/post/parts/media/content/VideoLinked";

export default {
  name: "Media",
  components: {
    Locked,
    Video,
    VideoLinked,
    Loader
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
    }
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

      if (!canView) return "Locked";
      if (type === "gif") return `Gif${LinkedPrefix}`;
      if (type === "photo") return `Photo${LinkedPrefix}`;
      if (type === "video") return `Video${LinkedPrefix}`;

      throw new Error("Invalid media format");
    }
  }
};
</script>

<style lang="scss" scoped>
.media {
  flex-grow: 2;
  &.maxHeight {
    max-height: 350px;
  }
}
</style>
