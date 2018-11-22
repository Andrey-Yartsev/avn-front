<template>
  <Modal>
    <div class="popup-container chat-popup" slot="content">
      <div class="content">
        <component :is="component" mode="modal" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Chat from "./Chat";
import NewMessage from "./NewMessage";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "ChatModal",

  mixins: [ModalRouterGoto],

  components: {
    Modal,
    Chat
  },

  computed: {
    component() {
      return this.$store.state.modalRouter.path === "chat/new"
        ? NewMessage
        : Chat;
    }
  }
};
</script>
