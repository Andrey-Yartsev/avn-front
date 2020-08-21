export default {
  data() {
    return {
      tipsGoal: {
        amount: "",
        description: "",
        sources: [],
        sourceTypes: [
          { title: "Live stream tips", value: "localTips" },
          { title: "All other tips", value: "globalTips" },
          { title: "Clips", value: "clips" },
          { title: "Messages", value: "messages" },
          { title: "Subscriptions", value: "subscriptions" },
          { title: "Votes", value: "votes" }
        ]
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
    },
    startedStreamId() {
      return this.stream.id;
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
        sources: this.tipsGoal.sources.map(item => item.value),
        amount: this.tipsGoal.amount,
        sess: this.$store.state.auth.token
      });
      this.$store
        .dispatch("lives/setTipsGoal", {
          amount: this.tipsGoal.amount,
          description: this.tipsGoal.description,
          entityType: "users_streams",
          entityId: this.startedStreamId,
          source: this.tipsGoal.sources.map(item => item.value)
        })
        .then(() => {
          this.$root.ws.ws.send(data);
          this.tipsGoal.amount = 0;
          this.tipsGoal.description = "";
          this.tipsGoal.sources = [];
          this.showTipsGoalForm = false;
        });
    },
    toggleTipGoalForm() {
      if (!this.showTipsGoalForm && this.isTipsGoalExists) {
        this.tipsGoal.amount = this.activeTipsGoal.amount + "";
        this.tipsGoal.description = this.activeTipsGoal.description;
        this.tipsGoal.sources = this.activeTipsGoal.sources?.map(item => {
          const elem = this.tipsGoal.sourceTypes.find(i => i.value === item);
          return elem;
        });
      }
      this.showTipsGoalForm = !this.showTipsGoalForm;
    }
  }
};
