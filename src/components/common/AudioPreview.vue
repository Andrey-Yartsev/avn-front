<template>
  <audio
    controls
    controlsList="nodownload"
    :src="file"
    :title="media.userFileName"
  />
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
  computed: {
    file() {
      return URL.createObjectURL(this.media.file);
    }
  },
  methods: {}
};
</script>
