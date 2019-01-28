<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-alert popup-alert_show-close"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">Error</div>
        <div class="popup-alert__body">
          {{ error.message }}
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
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

<style scoped>
.content {
  padding: 50px;
  text-align: center;
}
</style>
