<template>
    <Modal>
        <template slot="content">
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
                                            :value="reason.id">
                                        <span class="radio"></span>
                                        <span class="label">{{ reason.name }}</span>
                                    </div>
                                </label>
                                    </div>
                                </div>
                            </div>
                            <div class="container">
                                <div class="form-group">
                                    <button type="submit" id="send-report" class="btn lg saveChanges" disabled>
                                Report
                            </button>
                                </div>
                            </div>
                        </form>
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
      this.$store.dispatch("modal/hide", "postReport");
    }
  }
};
</script>
