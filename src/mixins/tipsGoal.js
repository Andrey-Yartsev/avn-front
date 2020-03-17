export default {
  data() {
    return {
      tipsGoal: {
        amount: "",
        description: ""
      },
      showTipsGoalForm: false
    };
  },
  computed: {
    activeTipsGoal() {
      return this.$store.state.lives.currentLive.tipsGoal;
    },
    isTipsGoalExists() {
      return this.activeTipsGoal.description && this.activeTipsGoal.amount;
    }
  },
  methods: {
    sendTipGoal() {
      if (!this.tipsGoal.amount.trim() || !this.tipsGoal.description.trim()) {
        return;
      }
      const data = JSON.stringify({
        act: "stream_goal",
        stream_user_id: this.user.id,
        stream_id: this.startedStreamId,
        description: this.tipsGoal.description,
        amount: this.tipsGoal.amount,
        sess: this.$store.state.auth.token
      });
      console.log(data);
      this.$root.ws.ws.send(data);
      this.tipsGoal.amount = 0;
      this.tipsGoal.description = "";
      this.showTipsGoalForm = false;
    },
    toggleTipGoalForm() {
      this.showTipsGoalForm = !this.showTipsGoalForm;
    }
  }
};
