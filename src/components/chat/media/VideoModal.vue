<template>
  <Modal class="popup-video">
    <div class="popup-container popup-image" slot="content">
      <div class="content content_relative">
        <Video :message="message" />
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
