<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <Loader
          v-if="loading"
          :fullscreen="false"
          text=""
          class="transparent small"
        />
        <template v-else-if="error">
          <div class="popup-alert__title">
            Error
          </div>
          <div class="popup-alert__body">
            {{ error.message }}
          </div>
          <button
            type="button"
            class="close close_default close_visible-mob"
            @click="close"
          ></button>
        </template>
        <template v-else>
          <div class="popup-alert__title">
            Trial Subscription
          </div>
          <div class="popup-alert__body">
            Do you wish to confirm trial subscription on {{ model.name }}
          </div>
          <div class="popup-alert__footer">
            <button class="btn" @click.prevent="yes">Confirm</button>
            <button class="btn alt" @click.prevent="no">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import BrowserStore from "store";

export default {
  name: "TrialConfirmModal",
  components: {
    Modal,
    Loader
  },
  computed: {
    data() {
      return this.$store.state.modal.trialConfirm.data;
    },
    code() {
      return this.data.code;
    },
    loading() {
      return (
        this.$store.state.trial.getModelLoading ||
        this.$store.state.trial.sendCodeStatusLoading
      );
    },
    model() {
      return this.$store.state.trial.getModelResult;
    },
    error() {
      return this.$store.state.trial.getModelError;
    }
  },
  methods: {
    async yes() {
      await this.sendTrialStatus("approved");
      this.$store.dispatch(
        "global/flashToast",
        "You have subscribed successfully"
      );
      this.close();
    },
    no() {
      this.sendTrialStatus("rejected");
      this.close();
    },
    close() {
      this.$store.commit("modal/hide", { name: "trialConfirm" });
    },
    sendTrialStatus(status) {
      return this.$store.dispatch("trial/sendCodeStatus", {
        trialCode: this.code,
        trialState: status
      });
    }
  },
  async created() {
    try {
      await this.$store.dispatch("trial/getModel", this.code);
    } catch (err) {
      return;
    }
    this.sendTrialStatus("pending").catch(() => {
      this.close();
    });
    BrowserStore.remove("trialCode");
  }
};
</script>
