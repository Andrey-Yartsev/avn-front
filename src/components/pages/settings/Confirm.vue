<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">
          {{ title }}
        </div>
        <div class="popup-alert__body">
          Are you sure?
        </div>
        <div class="popup-alert__footer">
          <button class="btn" @click.prevent="yes">Confirm</button>
          <button class="btn alt" @click.prevent="close">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "Confirm",
  components: {
    Modal
  },

  computed: {
    title() {
      return this.$store.state.modal.confirm.data.title;
    },
    success() {
      return this.$store.state.modal.confirm.data.success;
    }
  },

  methods: {
    yes() {
      this.success();
      this.close();
    },
    close() {
      this.$store.dispatch("modal/hide", {
        name: "confirm"
      });
    }
  }
};
</script>
