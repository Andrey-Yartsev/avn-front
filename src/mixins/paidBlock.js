export default {
  computed: {
    blockedByList() {
      return this.$store.state.auth.user?.paidBlockedBy;
    }
  },
  methods: {
    isPaidBlockedBy(userId) {
      return this.blockedByList.some(item => item.id === userId);
    },
    openPaidUnblockModal({ userId, username }) {
      this.$store.dispatch(
        "modal/show",
        {
          name: "paidUnblock",
          data: {
            userId,
            username
          }
        },
        { root: true }
      );
    }
  }
};
