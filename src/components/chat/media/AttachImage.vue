<template>
  <div class="media media-item">
    <figure class="media-item active media-item_photo" data-index="0">
      <ImageInner :media="media" :noText="true" />
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
    media: Object
  }
};
</script>
