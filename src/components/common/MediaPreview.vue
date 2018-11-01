<template>
  <div :class="['addFileView', {uploading: isSaving }]" >
    <span class="filename">
      <template v-if="media.preview">
        <img :src="media.preview" :title="media.userFileName"/>
      </template>
    </span>
    <div class="progress" :style="{'width': `${media.loaded}%` }"></div>
    <span class="remove centered" @mousedown.prevent.stop="() => {}" @click="remove">
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
