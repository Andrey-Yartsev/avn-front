export default {
  data() {
    return {
      genderId: 91
    };
  },
  computed: {
    isUserNominatable() {
      return (
        this.profile.nominee &&
        this.filterNominationLinksByGender(this.genderId).length
      );
    }
  },
  methods: {
    clickVoteHandler() {
      const filteredList = this.filterNominationLinksByGender(this.genderId);
      if (!this.profile.nominatedList || !filteredList.length) {
        return;
      }
      if (filteredList.length === 1) {
        this.$router.push(this.url(this.profile.nominatedList[0]));
      } else {
        this.$store.dispatch("modal/show", {
          name: "voting",
          data: { list: this.profile.nominatedList }
        });
      }
    },
    filterNominationLinksByGender(genderId) {
      return this.profile.nominatedList.filter(
        item => item.eventId == genderId
      );
    },
    url(v) {
      return "/vote/" + v.nomineeId + "/avn_awards/" + v.categoryId;
    },
    setGenderId(id) {
      this.genderId = id;
    }
  }
};
