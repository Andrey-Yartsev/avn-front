export default {
  computed: {
    showVoteButton() {
      if (!this.profile.nominee) {
        return false;
      }
      if (this.enabledNominations().length) {
        return true;
      }
      return false;
    }
  },
  methods: {
    clickVoteHandler() {
      const filteredList = this.enabledNominations();
      if (!filteredList.length) {
        return;
      }
      if (filteredList.length === 1) {
        this.$router.push(this.url(filteredList[0]));
      } else {
        this.$store.dispatch("modal/show", {
          name: "voting",
          data: { list: filteredList }
        });
      }
    },
    url(v) {
      const awardsType =
        v.eventId == process.env.VUE_APP_AWARDS_EVENT_ID
          ? "/avn_awards/"
          : "/gayvn_awards/";
      return "/vote/" + v.nomineeId + awardsType + v.categoryId;
    },
    enabledNominations() {
      let list = [];
      if (this.$store.state.init.data.enableVoting) {
        const straightNominationsList = this.profile.nominatedList.filter(
          item => item.eventId == process.env.VUE_APP_AWARDS_EVENT_ID
        );
        list = [...list, ...straightNominationsList];
      }
      if (this.$store.state.init.data.enableGayVoting) {
        const gayNominationsList = this.profile.nominatedList.filter(
          item => item.eventId == process.env.VUE_APP_GAY_AWARDS_EVENT_ID
        );
        list = [...list, ...gayNominationsList];
      }
      return list;
    }
  }
};
