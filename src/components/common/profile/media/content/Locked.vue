<template>
  <div
    class="locked-picture icn-item icn-pos_center"
    @click.prevent="openModal"
  >
    <video
      v-if="
        media.videoPreview &&
          media.videoPreview.source &&
          mediaSize !== 'preview'
      "
      class="video-content"
      :class="{ halfHeight: $mq === 'desktop' }"
      disableremoteplayback
      webkit-playsinline
      playsinline
      controls
      controlslist="nodownload"
      autoplay
      loop
      :poster="media.preview.source"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
      ref="video"
      style="margin: auto"
    >
      <source :src="media.videoPreview.source" type="video/mp4" />
    </video>
    <img
      v-else
      class="locked"
      :src="media.preview.source"
      :width="`${size.width}`"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
      style="object-fit: contain; transform: scale(1)"
    />
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "LockedPicture",
  mixins: [PostMediaPropsMixin],
  props: {
    media: Object,
    mediaSize: String
  },
  computed: {
    size() {
      const { preview, src } = this.media;
      return {
        width: preview.width || src.width,
        height: preview.height || src.height
      };
    }
  }
};
</script>
