<template>
  <div class="locked-picture">
    <img
      class="locked"
      :src="image"
      :width="`${size.width}px`"
      :height="`${size.height}px`"
    />
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "LockedPicture",
  mixins: [PostMediaPropsMixin],
  computed: {
    size() {
      const { preview, src } = this.media;
      return {
        width: preview.width || src.width,
        height: preview.height || src.height
      };
    },
    image() {
      return `data:image/jpeg;base64,${this.media.locked}`;
    }
  }
};
</script>
