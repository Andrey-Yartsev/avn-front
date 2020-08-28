export default {
  computed: {
    blockedByList() {
      this.$store.state.auth.user?.paidBlockedBy;
    }
  },
  methods: {
    isPaidBlockedBy(userId) {
      return this.blockedByList.some(item => item.id === userId);
    }
  },
  openPaidUnblockModal(userId) {
    this.$store.dispatch(
      "modal/show",
      {
        name: "paidUnblock",
        data: {
          userId
        }
      },
      { root: true }
    );
  }
};
