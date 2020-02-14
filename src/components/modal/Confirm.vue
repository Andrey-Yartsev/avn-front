<template>
  <Modal :onClose="close" extraClassName="confirm-modal">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">
          {{ title }}
        </div>
        <div class="popup-alert__body" v-if="!hideQuestion">
          {{ text || "Are you sure?" }}
        </div>
        <div class="popup-alert__footer">
          <button class="btn" @click.prevent="yes">Confirm</button>
          <button class="btn alt" @click.prevent="no">Cancel</button>
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
    text() {
      return this.$store.state.modal.confirm.data.text;
    },
    hideQuestion() {
      return this.$store.state.modal.confirm.data.hideQuestion;
    },
    success() {
      return this.$store.state.modal.confirm.data.success;
    },
    abort() {
      return this.$store.state.modal.confirm.data.abort;
    }
  },
  methods: {
    yes() {
      this.success();
      this.close();
    },
    no() {
      if (typeof this.abort === "function") {
        this.abort();
      }
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
