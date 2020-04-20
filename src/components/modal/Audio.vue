<template>
  <Modal :onClose="close">
    <div class="popup-container popup-image" slot="content">
      <div class="media-wrapper audio-wrapper audio-chat-message">
        <audio
          class="audio"
          controls
          controlsList="nodownload"
          :src="src"
        ></audio>
      </div>
      <button
        type="button"
        class="close close_light close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "AudioModal",
  components: {
    Modal
  },
  computed: {
    src() {
      return this.$store.state.modal.audio.data.src;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "audio" });
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-container {
  &.popup-image {
    width: 100vw !important;
    audio {
      width: 100%;
    }
  }
}
</style>
