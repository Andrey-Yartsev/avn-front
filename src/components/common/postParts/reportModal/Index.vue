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
                @click="this.close"
              />
              <form>
                <h1 class="popup__header">Choose reason</h1>
                <div class="reasons__content bg-gradient_light">
                  <div class="form-group radio-group radio-group_no-gaps">
                    <label
                      class="form-group-inner"
                      v-for="reason in reasons"
                      :key="reason.id"
                      :class="{ 'no-border-line': $mq === 'mobile' }"
                    >
                      <div class="radio-wrapper icn-item">
                        <input
                          type="radio"
                          name="reason"
                          :value="reason.id"
                          @click="reasonId = reason.id"
                        />
                        <span class="label">{{ reason.name }}</span>
                      </div>
                    </label>
                    <div class="form-group">
                      <button
                        type="submit"
                        id="send-report"
                        class="btn btn_fix-width-all-w saveChanges"
                        @click="sendReport"
                        :disabled="!reasonId"
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
  name: "PostReportModal",
  created() {
    this.$store.dispatch("post/getPostReportReasons", { type: "post" });
  },
  data: () => ({
    reasonId: undefined
  }),
  computed: {
    reasons() {
      return this.$store.state.post.postReportReasons;
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

      this.$store.dispatch(
        "global/flashToast",
        { text: "Report has been sent" },
        {
          root: true
        }
      );
    }
  }
};
</script>
