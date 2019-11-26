<template>
  <div
    class="locked-picture icn-item icn-pos_center"
    @click.prevent="openModal"
  >
    <img
      class="locked"
      :src="media.thumb.source"
      :width="`${size.width}`"
      :height="`${size.height}`"
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
