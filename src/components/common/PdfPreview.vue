<template>
  <div :class="['addFileView', { uploading: isSaving }]">
    <span class="filename" :class="{ 'error-upload': media.uploadError }">
      <span>{{ media.userFileName }}</span>
      <span class="icn-file-pdf icn-item"></span>
      <span
        class="attachment-status icn-item success-status"
        v-if="media.processId"
      />
      <span
        class="attachment-status icn-item error-status"
        v-if="media.uploadError"
      />
    </span>
    <div v-if="showLoader" class="progress">
      {{ showLoader }}
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
    }
  },
  components: {
    Loader
  },
  computed: {
    showLoader() {
      return !this.media.uploadError && this.media.loaded < 100;
    },
    isAudio() {
      return this.media.mediaType === "audio";
    }
  },
  methods: {
    remove() {
      this.$emit("removeMedia", this.media.id);
    }
  }
};
</script>
