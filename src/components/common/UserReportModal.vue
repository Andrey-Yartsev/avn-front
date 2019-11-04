<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_block popup-reasons">
        <div class="content">
          <div class="reasonsView">
            <div class="reasons">
              <button
                type="button"
                class="close close_shift-t close_default close_visible-mob icn-item icn-size_lg"
                @click="close"
              />
              <form v-on:submit.stop.prevent="report">
                <h1 class="popup__header">Choose reason</h1>
                <div class="reasons__content bg-gradient_light">
                  <div class="form-group radio-group radio-group_no-gaps">
                    <label
                      class="form-group-inner"
                      :class="{ 'no-border-line': $mq === 'mobile' }"
                    >
                      <div class="radio-wrapper icn-item">
                        <input
                          type="radio"
                          name="reason"
                          value="4"
                          v-model="reason"
                        />
                        <span class="label"
                          >This profile posts violent or offensive content</span
                        >
                      </div>
                    </label>
                    <label
                      class="form-group-inner"
                      :class="{ 'no-border-line': $mq === 'mobile' }"
                    >
                      <div class="radio-wrapper icn-item">
                        <input
                          type="radio"
                          name="reason"
                          value="5"
                          v-model="reason"
                        />
                        <span class="label"
                          >This profile uses my personal data</span
                        >
                      </div>
                    </label>
                    <label
                      class="form-group-inner"
                      :class="{ 'no-border-line': $mq === 'mobile' }"
                    >
                      <div class="radio-wrapper icn-item">
                        <input
                          type="radio"
                          name="reason"
                          value="6"
                          v-model="reason"
                        />
                        <span class="label"
                          >This profile uses personal data from someone I
                          know</span
                        >
                      </div>
                    </label>
                    <div class="form-group">
                      <button
                        :disabled="!reason"
                        type="submit"
                        id="send-report"
                        class="btn btn_fix-width-all-w saveChanges"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "UserReportModal",

  components: {
    Modal
  },

  data() {
    return {
      reason: 0
    };
  },

  computed: {
    userId() {
      return this.$store.state.modal.userReport.data;
    }
  },

  methods: {
    report() {
      this.$store.dispatch("user/report", {
        userId: this.userId,
        reasonId: this.reason
      });
      this.$store.dispatch("global/flashToast", {
        text: "Report has been sent"
      });
      this.close();
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "userReport" });
    }
  }
};
</script>
