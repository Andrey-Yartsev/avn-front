export default {
  computed: {
    isHome() {
      return this.$route.name === "Settings";
    }
  }
};
