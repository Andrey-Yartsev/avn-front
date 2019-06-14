<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">{{ error.title || "Error" }}</div>
        <div class="popup-alert__body">
          {{ error.message }}
        </div>
      </div>
      <button
        type="button"
        class="close close_default close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  components: {
    Modal
  },

  computed: {
    error() {
      return this.$store.state.global.error;
    }
  },

  methods: {
    close() {
      this.$store.dispatch("global/setError", null);
    }
  }
};
</script>
