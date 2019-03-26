<template>
  <div :class="['addFileView', { uploading: isSaving }]">
    <span class="filename">
      <template v-if="media.preview">
        <img :src="media.preview" :title="media.userFileName" />
        <span class="attachment-status success-status" v-if="media.processId" />
        <span class="attachment-status error-status" v-if="media.uploadError" />
      </template>
      <template v-else>
        <span>{{ media.userFileName }}</span>
        <div class="loader centered" v-if="!media.previewError"></div>
      </template>
    </span>
    <div
      v-if="!media.uploadError && !media.processId"
      class="progress"
      :style="{ width: `${media.loaded}%` }"
    />
    <span
      class="remove centered"
      @mousedown.prevent.stop="() => {}"
      @click="remove"
    >
      <svg aria-hidden="true" class="icn icn-remove">
        <use xlink:href="#icon-remove"></use>
      </svg>
    </span>
  </div>
</template>

<script>
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
  methods: {
    remove() {
      this.$emit("removeMedia", this.media.id);
    }
  }
};
</script>
