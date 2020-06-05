<template>
  <a
    class="postLink"
    :href="media.src.source"
    target="_blank"
    @click.prevent="openImage(media.src.source)"
  >
    <img
      :src="media.thumb.source"
      :class="{ 'no-media-text': noText }"
      :width="media.thumb.width"
      :height="media.thumb.height"
      class="media-content"
    />
  </a>
</template>

<script>
export default {
  props: {
    media: Object,
    noText: Boolean
  },
  methods: {
    openImage(src) {
      this.$store.dispatch("modal/show", {
        name: "image",
        data: {
          src
        }
      });
    }
  }
};
</script>
