<template>
    <div class="popup">
        <div class="overlay"></div>
        <div class="popup-container">
            <div class="previous hidden"></div>
            <div class="content">
                <div class="reasonsView">
                    <div class="reasons">
                        <button type="button" class="close"></button>
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
        </div>
    </div>
</template>

<script>
export default {
  name: "PostReportModal",
  created() {
    this.$store.dispatch("home/getPostReportReasons", { type: "post" });
  },
  computed: {
    reasons() {
      return this.$store.state.home.postReportReasons;
    }
  }
};
</script>
