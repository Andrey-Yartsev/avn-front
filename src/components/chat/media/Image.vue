<template>
  <figure class="media-item active media-item_photo" data-index="0">
    <template v-if="!media.locked">
      <a
        class="postLink"
        :href="media.src.source"
        target="_blank"
        @click.prevent="openImage(media.src.source)"
      >
        <img
          :src="media.src.source"
          :class="{ 'no-media-text': !message.textLength }"
          :width="media.src.width"
          :height="media.src.height"
        />
      </a>
    </template>
    <template v-else>
      <div class="postLink">
        <img
          :src="`data:image/jpeg;base64,${media.locked}`"
          :width="media.src.width"
          :height="media.src.height"
          :style="{
            width: `${media.src.width}px`,
            height: `${media.src.height}px`
          }"
        />
      </div>
    </template>
  </figure>
</template>

<script>
export default {
  props: {
    message: Object
  },
  computed: {
    media() {
      return this.message.media[0];
    }
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
