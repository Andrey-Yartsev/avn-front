<template>
  <Modal :onClose="close">
    <div class="popup-container" slot="content">
      <div class="content magazine">
        <h1 class="popup__header">Shipping Info</h1>
        <button
          type="button"
          class="close close_shift-t close_default icn-item icn-size_lg"
          @click="close"
        />
        <div class="bg-gradient_light shipping-form">
          <ShippingForm @close="close" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import ShippingForm from "./ShippingForm";

export default {
  name: "MagShippingModal",
  components: {
    Modal,
    ShippingForm
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "magShipping" });
    }
  }
};
</script>
