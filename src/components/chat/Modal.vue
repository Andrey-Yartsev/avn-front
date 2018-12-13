<template>
  <Modal :onClose="close">
    <div
      class="popup-container chat-popup" slot="content"
      :class="{'chat-popup_new-msg': isNew}"
    >
      <div class="content" ref="content">
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
    },
    routePath() {
      return this.$store.state.modalRouter.path;
    },
    isNew() {
      return this.routePath === "chat/new";
    }
  },

  mounted() {
    let currentScroll = this.$refs.content.scrollTop;
    this.$refs.content.onscroll = () => {
      if (currentScroll < this.$refs.content.scrollTop) {
        document.body.classList.add("scroll-top");
      } else {
        document.body.classList.remove("scroll-top");
      }
      currentScroll = this.$refs.content.scrollTop;
    };
  }
};
</script>
