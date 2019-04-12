<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-image popup-alert_show-close"
      slot="content"
    >
      <div class="content">
        <img :src="src" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "imageModal",
  components: {
    Modal
  },
  computed: {
    src() {
      return this.$store.state.modal.image.data.src;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "image" });
    }
  }
};
</script>
