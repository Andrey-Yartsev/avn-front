<template>
  <div class="media media-item">
    <figure class="media-item active media-item_photo" data-index="0">
      <template v-if="!media.locked">
        <ImageInner :media="media" :noText="!message.textLength" />
      </template>
      <template v-else>
        <div class="postLink">
          <img
            :src="`data:image/jpeg;base64,${media.locked}`"
            :width="media.thumb.width"
            :height="media.thumb.height"
            class="media-content"
            :style="{
              width: `${media.thumb.width}px`,
              height: `${media.thumb.height}px`
            }"
          />
        </div>
      </template>
    </figure>
  </div>
</template>

<script>
import ImageInner from "./ImageInner";

export default {
  components: {
    ImageInner
  },
  props: {
    message: Object
  },
  computed: {
    media() {
      return this.message.media[0];
    }
  }
};
</script>
