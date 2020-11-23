<template>
  <div :class="['addFileView', { uploading: isSaving }]">
    <span class="filename" :class="{ 'error-upload': media.uploadError }">
      <span>{{ media.userFileName }}</span>
      <span class="icn-file-pdf icn-item"></span>
      <span
        class="attachment-status icn-item success-status"
        :class="{ checked: iconChecked, switchable }"
        v-if="media.fileName"
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

export default {
  name: "PdfPreview",
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
    Loader
  },
  data() {
    return {
      iconChecked: false
    };
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
