<template>
  <Modal :onClose="close">
    <div class="popup-container" slot="content">
      <div class="content">
        <h3>Are you sure?</h3>
        <button @click="yes" class="btn large yes">Yes</button>
        <button @click="no" class="btn large">No</button>
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
