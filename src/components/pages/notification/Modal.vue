<template>
  <Modal :onClose="close">
    <div class="popup-container notifications-popup" slot="content">
      <div class="content">
        <Content mode="modal"/>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./Index";
import ModalRouter from "@/mixins/modalRouter";

export default {
  name: "NotifModal",

  mixins: [ModalRouter],

  components: {
    Modal,
    Content
  }
};
</script>

<style scoped>
.content {
  padding: 0;
}
</style>
