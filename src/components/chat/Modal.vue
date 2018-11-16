<template>
  <Modal>
    <div class="popup-container chat-popup" slot="content">
      <div class="content">
        <Chat mode="modal" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Chat from "./Chat";
import ModalRouter from "@/mixins/modalRouter";

export default {
  name: "ChatModal",

  mixins: [ModalRouter],

  components: {
    Modal,
    Chat
  }
};
</script>
