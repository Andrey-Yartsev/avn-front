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
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "ChatModal",

  mixins: [ModalRouterGoto],

  components: {
    Modal,
    Chat
  }
};
</script>
