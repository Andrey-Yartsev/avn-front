<template>
  <Modal :onClose="close">
    <div
      ref="container"
      class="popup-container popup-container_hfluid notifications-popup"
      slot="content"
    >
      <div class="content">
        <Content mode="modal" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./Index";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "NotifModal",

  mixins: [ModalRouterGoto],

  components: {
    Modal,
    Content
  },

  // mounted() {
  //   let currentScroll = this.$refs.container.scrollTop;
  //   this.$refs.container.onscroll = () => {
  //     if (currentScroll < this.$refs.container.scrollTop) {
  //       document.body.classList.add("scroll-top");
  //     } else {
  //       document.body.classList.remove("scroll-top");
  //     }
  //     currentScroll = this.$refs.container.scrollTop;
  //   };
  // },

  beforeDestroy() {
    // document.body.classList.remove("scroll-top");
  }
};
</script>
