<template>
  <div
    class="locked-picture icn-item icn-pos_center"
    @click.prevent="openModal"
  >
    <video
      v-if="media.preview.source && mediaSize !== 'preview'"
      class="video-content"
      :class="{ halfHeight: $mq === 'desktop' }"
      disableremoteplayback
      webkit-playsinline
      playsinline
      controls
      controlslist="nodownload"
      autoplay
      loop
      :poster="media.thumb.source"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
      ref="video"
    >
      <source :src="media.preview.source" type="video/mp4" />
    </video>
    <img
      v-else
      class="locked"
      :src="media.thumb.source"
      :width="`${size.width}`"
      height="350"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
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
