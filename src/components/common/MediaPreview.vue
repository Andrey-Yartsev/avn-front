<template>
  <div :class="['addFileView', { uploading: isSaving }, { audio: isAudio }]">
    <AudioPreview v-if="isAudio" :media="media" />
    <span
      v-else
      class="filename"
      :class="{ 'error-upload': media.uploadError }"
    >
      <img v-if="hasPreview" :src="preview" :title="media.userFileName" />
      <span v-else>{{ media.userFileName }}</span>
      <span
        class="attachment-status icn-item success-status"
        :class="{ checked: iconChecked, switchable }"
        v-if="media.processId"
        @click="switchChecked"
      />
      <span class="label" v-if="iconChecked">free</span>
      <span
        class="attachment-status icn-item error-status"
        v-if="media.uploadError"
      />
    </span>
    <div v-if="showLoader" class="progress">
      <div class="progress-loader" :style="{ width: `${media.loaded}%` }" />
    </div>
    <span
      v-if="deleteButton"
      class="remove"
      @mousedown.prevent.stop="() => {}"
      @click="remove"
    >
      <svg aria-hidden="true" class="icn icn-remove">
        <use xlink:href="#icon-remove"></use>
      </svg>
    </span>
    <div class="loader-container loader-container_center" v-if="showLoader">
      <Loader :fullscreen="false" text="" :small="true" :semidark="true" />
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import AudioPreview from "./AudioPreview";

export default {
  name: "MediaPreview",
  props: {
    media: {
      type: Object,
      required: true
    },
    isSaving: {
      type: Boolean,
      required: true
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    switchable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loader,
    AudioPreview
  },
  data() {
    return {
      iconChecked: false
    };
  },
  computed: {
    preview() {
      if (
        this.media.mediaType === "video" &&
        this.media.thumbs &&
        this.media.thumbs.length
      ) {
        return this.media.thumbs[this.media.thumbId - 1].url;
      }

      return this.media.preview;
    },
    hasPreview() {
      return this.media.preview || this.media.thumbs;
    },
    showLoader() {
      return !this.media.uploadError && !this.media.processId;
    },
    isAudio() {
      return this.media.mediaType === "audio";
    }
  },
  methods: {
    switchChecked() {
      if (!this.switchable) {
        return;
      }
      this.iconChecked = !this.iconChecked;
      this.$emit("clickCheckIcon", {
        id: this.media.id,
        iconChecked: this.iconChecked
      });
    },
    remove() {
      this.$emit("removeMedia", this.media.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.audio {
  width: 100%;
  overflow: initial;
}
</style>
