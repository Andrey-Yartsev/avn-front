<template>
  <div :class="['addFileView', { uploading: isSaving }]">
    <span class="filename" :class="{ 'error-upload': media.uploadError }">
      <img v-if="hasPreview" :src="preview" :title="media.userFileName" />
      <span v-else>{{ media.userFileName }}</span>
      <span class="attachment-status success-status" v-if="media.processId" />
      <span class="attachment-status error-status" v-if="media.uploadError" />
    </span>
    <div v-if="showLoader" class="progress">
      <div class="progress-loader" :style="{ width: `${media.loaded}%` }" />
    </div>
    <span
      class="remove centered"
      @mousedown.prevent.stop="() => {}"
      @click="remove"
    >
      <svg aria-hidden="true" class="icn icn-remove">
        <use xlink:href="#icon-remove"></use>
      </svg>
    </span>
    <Loader
      v-if="showLoader"
      :fullscreen="false"
      text=""
      class="small no-text"
    />
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
    }
  },
  components: {
    Loader
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
    }
  },
  methods: {
    remove() {
      this.$emit("removeMedia", this.media.id);
    }
  }
};
</script>
