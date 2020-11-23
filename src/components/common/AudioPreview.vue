<template>
  <div class="audio-file-preview">
    <span
      class="attachment-status icn-item success-status"
      :class="{ checked: iconChecked }"
      v-if="media.userFileName"
      @click="switchChecked"
    />
    <span class="label" v-if="iconChecked">free</span>
    <audio
      controls
      controlsList="nodownload"
      :src="file"
      :title="media.userFileName"
    />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  name: "AudioPreview",
  props: {
    media: {
      type: Object,
      required: true
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
    file() {
      return URL.createObjectURL(this.media.file);
    }
  },
  methods: {
    switchChecked() {
      this.iconChecked = !this.iconChecked;
      this.$emit("clickCheckIcon", {
        id: this.media.id,
        iconChecked: this.iconChecked
      });
    }
  }
};
</script>
