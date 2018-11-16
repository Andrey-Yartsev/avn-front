<template>
  <Modal>
    <div class="popup-container chat-popup" slot="content">
      <div class="content">
        <Chat mode="modal" />

      </div>
      <button type="button" class="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Chat from "./Chat";

export default {
  name: "ChatModal",

  components: {
    Modal,
    Chat
  }
};
</script>
