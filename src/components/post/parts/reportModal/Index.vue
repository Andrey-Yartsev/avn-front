<template>
  <ReportModal type="post" :reportAction="report" />
</template>

<script>
import ReportModal from "@/components/common/ReportModal";

export default {
  name: "PostReportModal",
  components: {
    ReportModal
  },
  methods: {
    report(reasonId) {
      const { postId } = this.$store.state.modal.postReport.data;
      this.$store.dispatch("post/report", {
        postId,
        reasonId
      });
    }
  }
};
</script>
