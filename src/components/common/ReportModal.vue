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

              <h1 class="popup__header">Choose reason</h1>
              <div class="reasons__content bg-gradient_light">
                <div class="form-group radio-group radio-group_no-gaps">
                  <label
                    v-for="v in reasons"
                    class="form-group-inner"
                    :class="{ 'no-border-line': $mq === 'mobile' }"
                    :key="v.id"
                  >
                    <div class="radio-wrapper icn-item">
                      <input
                        type="radio"
                        name="reason"
                        :value="v.id"
                        @click="select(v)"
                      />
                      <span class="label">{{ v.name }}</span>
                    </div>
                  </label>
                  <div class="form-group bottom-buttons">
                    <button class="btn" v-if="canBack" @click="back">
                      Back
                    </button>
                    <div v-else></div>
                    <button
                      :disabled="!reason"
                      id="send-report"
                      class="btn saveChanges"
                      @click="report"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
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
  name: "ReportModal",
  components: {
    Modal
  },
  props: {
    type: {
      type: String,
      required: true
    },
    reportAction: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      rootReasonId: 0,
      reason: 0,
      canBack: false
    };
  },
  computed: {
    modalName() {
      return this.type + "Report";
    },
    _reasons() {
      return this.$store.state[this.type].fetchReportReasonsResult;
    },
    reasons() {
      const reasons = this._reasons;
      if (this.rootReasonId) {
        const rootReason = this.findRootReason(this.rootReasonId);
        if (!rootReason.items || !rootReason.items.length) {
          return reasons;
        }
        return rootReason.items.map(v => {
          v.lastLevel = true;
          return v;
        });
      }
      return reasons;
    }
  },
  methods: {
    findRootReason(id) {
      return this._reasons.find(v => v.id === id);
    },
    select(reason) {
      if (!reason.lastLevel) {
        this.rootReasonId = reason.id;
        if (!reason.items || !reason.items.length) {
          this.reason = reason;
        } else {
          this.canBack = true;
        }
      } else {
        this.reason = reason;
      }
    },
    back() {
      this.rootReasonId = 0;
      this.canBack = false;
    },
    report() {
      this.reportAction(this.reason.id);
      this.$store.dispatch("global/flashToast", {
        text: "Report has been sent"
      });
      this.close();
    },
    close() {
      this.$store.dispatch("modal/hide", { name: this.modalName });
    }
  },
  created() {
    this.$store.dispatch(this.type + "/fetchReportReasons");
  }
};
</script>
