<template>
  <Modal :onClose="close">
    <div
      ref="container"
      class="popup-container popup-container_hfluid notifications-popup"
      slot="content"
      @scroll="onScroll"
    >
      <div class="content">
        <Content mode="modal" />
      </div>
      <button
        type="button"
        class="close close_shift-t close_shift-r close_default icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./Index";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import StickyHeader from "@/mixins/stickyHeader";

export default {
  name: "NotifModal",

  mixins: [ModalRouterGoto, StickyHeader],

  components: {
    Modal,
    Content
  }
};
</script>
