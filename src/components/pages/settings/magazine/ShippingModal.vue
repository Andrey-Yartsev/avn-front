<template>
  <Modal :onClose="close">
    <div
      class="popup-container"
      :class="{ showYScroll: autoPopup }"
      slot="content"
    >
      <div class="content magazine">
        <h1 class="popup__header">Shipping Info</h1>
        <button
          type="button"
          class="close close_shift-t close_default close_visible-mob icn-item icn-size_lg"
          @click="close"
        />
        <div
          class="bg-gradient_light shipping-form"
          :class="{ autoPopup: autoPopup }"
        >
          <div v-if="autoPopup" class="shipping-form-title">
            Congratulations, you qualify for a complimentary subscription to AVN
            Magazine Print Edition!<br />
            Please confirm your mailing address and click Activate.
          </div>
          <ShippingForm @close="close" :autoPopup="autoPopup" />
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
  computed: {
    autoPopup() {
      return this.$store.state.modal.magShipping.data.autoPopup;
    }
  },
  methods: {
    close() {
      if (this.autoPopup) {
        this.$router.push("/settings/magazine");
      }
      this.$store.dispatch("modal/hide", { name: "magShipping" });
    }
  }
};
</script>
