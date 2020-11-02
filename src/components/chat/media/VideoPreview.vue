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
          <span
            class="loader-container loader-container_center"
            v-if="processing"
          >
            <Loader
              :fullscreen="false"
              text="Media is currently processing"
              :semidark="true"
              class="processing-loader rounded-corners text-light"
              :small="true"
            />
          </span>
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
            class="loader-container loader-container_center"
            v-if="processing"
          >
            <Loader
              :fullscreen="false"
              text="Media is currently processing"
              class="processing-loader rounded-corners text-light"
              :small="true"
              :semidark="true"
            />
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
import Loader from "@/components/common/Loader";

export default {
  mixins: [User],
  props: {
    message: Object
  },
  components: {
    Loader
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
      return this.message.fromUser?.id === this.user.id;
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
