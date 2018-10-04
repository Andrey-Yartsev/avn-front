<template>
  <Modal>
    <template slot="content">
      <div class="popup-container">
        <div class="content">
            <div class="reasonsView">
                <div class="reasons">
                    <button type="button" class="close" @click="this.close"></button>
                    <form>
                        <h1 class="form-title">Choose reason</h1>
                        <div class="shadow-block">
                            <div class="container">
                                <div class="form-group radio-group">
                                    <label class="form-group-inner" v-for="reason in reasons" :key="reason.id">
                                      <div class="radio-wrapper">
                                          <input
                                            type="radio"
                                            name="reason"
                                            :value="reason.id"
                                            @click="reasonId = reason.id"
                                          >
                                          <span class="radio"></span>
                                          <span class="label">{{ reason.name }}</span>
                                      </div>
                                  </label>
                                </div>
                            </div>
                        </div>
                        <div class="container">
                            <div class="form-group">
                                <button
                                  type="submit"
                                  id="send-report"
                                  class="btn lg saveChanges"
                                  @click="sendReport"
                                  :disabled="!reasonId"
                                >
                                  Report
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
  name: "PostReportModal",
  created() {
    this.$store.dispatch("home/getPostReportReasons", { type: "post" });
  },
  data: () => ({
    reasonId: undefined
  }),
  computed: {
    reasons() {
      return this.$store.state.home.postReportReasons;
    }
  },
  components: {
    Modal
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "postReport" });
    },
    sendReport(e) {
      e.preventDefault();

      const { postId } = this.$store.state.modal.postReport.data;

      this.$store.dispatch("post/sendReport", {
        postId,
        reasonId: this.reasonId
      });

      this.close();

      this.$store.dispatch("global/flashToast", "Report has been sent", {
        root: true
      });
    }
  }
};
</script>
