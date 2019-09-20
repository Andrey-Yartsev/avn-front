<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="popup-alert__title">
          Switch To Gay Context
        </div>
        <div class="popup-alert__body">
          Would you like to switch your viewing preference to a gay context?
        </div>
        <div class="popup-alert__footer">
          <button class="btn btn_decision-size" @click.prevent="yes">
            Yes
          </button>
          <button class="btn alt btn_decision-size" @click.prevent="no">
            No
          </button>
          <button class="btn border" @click.prevent="notAsk">
            Do not ask anymore
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import gayDomain from "@/helpers/gayDomain";

export default {
  name: "GayContextConfirmModal",
  components: {
    Modal
  },
  methods: {
    yes() {
      window.location = gayDomain();
      this.close();
    },
    no() {
      this.close();
    },
    notAsk() {
      this.$store.dispatch("explore/gender/doNotSuggest");
      this.close();
    },
    close() {
      this.$store.dispatch("modal/hide", {
        name: "gayContextConfirm"
      });
    }
  }
};
</script>
