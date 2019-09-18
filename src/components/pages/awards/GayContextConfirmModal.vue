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
          <button class="btn" @click.prevent="yes">Yes</button>
          <button class="btn alt" @click.prevent="no">No</button>
          <button class="btn alt" @click.prevent="notAsk">
            Do not ask anymore
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "GayContextConfirmModal",
  components: {
    Modal
  },
  methods: {
    yes() {
      let gayHost;
      const l = window.location;
      if (process.env.NODE_ENV === "development") {
        gayHost = "gayvn.localhost:" + l.port;
      } else {
        gayHost = process.env.VUE_APP_GAY_HOST;
      }
      window.location = l.protocol + "//" + gayHost + l.pathname;
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
