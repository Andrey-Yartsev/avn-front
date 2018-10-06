<template>
  <Modal>
    <div class="popup-container chat-popup" slot="content">
      <div class="previous"></div>
      <div class="content">

      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "ChatModal",

  components: {
    Modal
  }
};
</script>
