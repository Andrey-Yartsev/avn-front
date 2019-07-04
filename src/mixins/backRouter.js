export default {
  data() {
    return {
      routeStack: []
    };
  },
  watch: {
    $route(to) {
      this.$store.commit("backRouter/push", to);
    }
  }
};
