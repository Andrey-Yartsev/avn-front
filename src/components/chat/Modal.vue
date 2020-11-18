<template>
  <Modal :onClose="_close">
    <div
      class="popup-container chat-popup"
      slot="content"
      :class="{ 'chat-popup_new-msg': isNew }"
    >
      <div
        class="content"
        ref="content"
        :class="{ 'content_column-mob': $mq === 'mobile' }"
      >
        <component :is="component" mode="modal" />
      </div>
      <button
        type="button"
        class="close close_shift-t close_default icn-item icn-size_lg"
        @click="_close"
      />
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
  methods: {
    _close() {
      this.$store.commit("chat/setChatsFilter", "all");
      this.close();
    }
  }
};
</script>
