<template>
  <Modal :onClose="close" extraClassName="confirm-modal">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">
          Block user with unblocking price
        </div>
        <div class="popup-alert__body">
          <div class="form-group form-group_with-label">
            <label
              class="form-group-inner subscription"
              :class="{
                disabled: disabled
              }"
            >
              <span class="label">Price</span>
              <span class="subscription__field field-symbol-currency">
                <span class="form-field">
                  <input
                    class="field-gap_currency field-gap_timeunit"
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    v-model="price"
                    :disabled="disabled"
                  />
                </span>
              </span>
            </label>
          </div>
        </div>
        <div class="popup-alert__footer">
          <button
            class="btn"
            @click.prevent="block"
            :disabled="disabled || !price"
          >
            Block
          </button>
          <button class="btn alt" @click.prevent="close" :disabled="disabled">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "PaidBlockModal",
  data() {
    return {
      disabled: false,
      price: ""
    };
  },
  components: {
    Modal
  },
  computed: {
    modalData() {
      return this.$store.state.modal.paidBlock.data;
    }
  },
  methods: {
    block() {
      this.disabled = true;
      this.$store
        .dispatch(this.modalData.actionPrefix + "/paidBlock", {
          userId: this.modalData.userId,
          price: this.price
        })
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.close();
        });
    },
    close() {
      this.$store.dispatch("modal/hide", {
        name: "paidBlock"
      });
    }
  }
};
</script>
