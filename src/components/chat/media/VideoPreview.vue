<template>
  <div class="media media-item">
    <figure class="media-item active media-item_photo" data-index="0">
      <template v-if="isMyMessage || isFree || isUnlocked">
        <a
          class="postLink video-placeholder icn-item rounded-corners"
          :class="{ processing }"
          :href="media.src.source"
          target="_blank"
          @click.prevent="openVideo"
        >
          <div
            class="lds-dual-ring transparent small with-text not-fullscreen processing-loader rounded-corners"
            v-if="processing"
          >
            <div class="loader-text">Media is currently processing</div>
          </div>
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
        <div class="postLink video-placeholder icn-item rounded-corners">
          <div
            class="lds-dual-ring transparent small with-text not-fullscreen processing-loader rounded-corners"
            v-if="processing"
          >
            <div class="loader-text">Media is currently processing</div>
          </div>
          <img
            :src="media.thumb.source"
            :class="{ 'no-media-text': !message.textLength }"
            :width="media.thumb.width"
            :height="media.thumb.height"
            class="media-content"
          />
        </div>
      </template>
    </figure>
  </div>
</template>

<script>
import User from "@/mixins/user";

export default {
  mixins: [User],
  props: {
    message: Object
  },
  computed: {
    media() {
      return this.message.media[0];
    },
    processing() {
      return !this.message.isMediaReady;
    },
    isFree() {
      return this.message.isFree;
    },
    isUnlocked() {
      return this.message.isOpened && !this.message.isFree;
    },
    isMyMessage() {
      return this.message.fromUser.id === this.user.id;
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
