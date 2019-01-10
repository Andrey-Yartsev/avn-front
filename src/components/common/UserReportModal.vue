<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-reasons">
        <div class="content">
          <div class="reasonsView">
            <div class="reasons">
              <button type="button" class="close" @click="close"></button>
              <form v-on:submit.stop.prevent="report">
                <h1 class="form-title">Choose reason</h1>
                <div class="shadow-block">
                  <div class="container">
                    <div class="form-group form-group_with-label radio-group">
                      <label class="form-group-inner">
                        <div class="radio-wrapper">
                          <input type="radio" name="reason" value="4" v-model="reason">
                          <span class="radio"></span>
                          <span class="label">This profile posts violent or offensive content</span>
                        </div>
                      </label>
                      <label class="form-group-inner">
                        <div class="radio-wrapper">
                          <input type="radio" name="reason" value="5" v-model="reason">
                          <span class="radio"></span>
                          <span class="label">This profile uses my personal data</span>
                        </div>
                      </label>
                      <label class="form-group-inner">
                        <div class="radio-wrapper">
                          <input type="radio" name="reason" value="6" v-model="reason">
                          <span class="radio"></span>
                          <span class="label">This profile uses personal data from someone I know</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="form-group form-group_with-label">
                    <button
                      :disabled="!reason"
                      type="submit" id="send-report" class="btn lg saveChanges">Report
                    </button>
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
      this.$store.dispatch("global/flashToast", "Report has been sent");
      this.close();
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "userReport" });
    }
  }
};
</script>
