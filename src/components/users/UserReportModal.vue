<template>
  <ReportModal type="user" :reportAction="report" />
</template>

<script>
import ReportModal from "@/components/common/ReportModal";

export default {
  name: "UserReportModal",
  components: {
    ReportModal
  },
  methods: {
    report(reasonId) {
      const userId = this.$store.state.modal.userReport.data;
      this.$store.dispatch("user/report", {
        userId,
        reasonId
      });
    }
  }
};
</script>
