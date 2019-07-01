<template>
  <Modal>
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <Video :message="message" />
      </div>
      <button
        type="button"
        class="close close_default icn-item"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Video from "./Video";

export default {
  name: "ChatVideoModal",
  components: {
    Modal,
    Video
  },
  computed: {
    message() {
      return this.$store.state.modal.chatVideo.data;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", {
        name: "chatVideo"
      });
    }
  }
};
</script>
