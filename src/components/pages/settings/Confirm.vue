<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <div class="popup-alert__title">
          {{ title }}
        </div>
        <div class="popup-alert__body">
          Are you sure?
        </div>
        <div class="popup-alert__footer">
          <a href="#" class="btn" @click.prevent="yes">Confirm</a>
          <a href="#" class="btn alt" @click.prevent="close">Cancel</a>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
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

<style scoped>
.content {
  padding: 50px;
  text-align: center;
}
.yes {
  margin-right: 15px;
}
</style>
