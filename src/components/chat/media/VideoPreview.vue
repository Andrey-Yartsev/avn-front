<template>
  <div class="media media-item">
    <figure class="media-item active media-item_photo" data-index="0">
      <template v-if="!media.locked">
        <a
          class="postLink"
          :href="media.src.source"
          target="_blank"
          @click.prevent="openVideo"
        >
          <img
            :src="media.thumb.source"
            :class="{ 'no-media-text': !message.textLength }"
            :width="media.thumb.width"
            :height="media.thumb.height"
            class="media-content"
          />
        </a>
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
    openVideo() {
      this.$store.dispatch("modal/show", {
        name: "chatVideo",
        data: this.message
      });
    }
  }
};
</script>
