<template>
  <Modal>
    <div class="iframe-wrapper" slot="content">
      <iframe :src="link" frameborder="0" width="100%" height="100%"></iframe>
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
    link() {
      return this.$store.state.modal.iframe.data.link;
    }
  }
};
</script>

<style scoped>
.iframe-wrapper {
  width: 400px;
  height: 200px;
  background: #fff;
}
</style>
