<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <div class="popup-alert__title">You are about to unsubscribe from {{ data.name }}.</div>
        <div class="popup-alert__footer">
          <a href="#" class="btn alt" @click.prevent="no">Cancel</a>
          <a href="#" class="btn" @click.prevent="yes">Unsubscribe</a>
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
    data() {
      return this.$store.state.modal.confirm.data;
    }
  },

  methods: {
    yes() {
      this.$store.commit("confirm/yes");
      this.$store.dispatch("modal/hide", { name: "confirm" });
    },
    no() {
      this.$store.commit("confirm/no");
      this.$store.dispatch("modal/hide", { name: "confirm" });
    },
    close() {
      this.$store.commit("confirm/no");
      this.$store.dispatch("modal/hide", { name: "confirm" });
    }
  },

  mounted() {
    this.$store.commit("confirm/reset");
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
