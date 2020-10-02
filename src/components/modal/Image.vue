<template>
  <Modal :onClose="close" :extraClassName="'z-index-200'">
    <div class="popup-container popup-image" slot="content">
      <div class="content content_relative">
        <img :src="src" />
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
