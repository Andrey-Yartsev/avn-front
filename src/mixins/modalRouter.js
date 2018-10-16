export default {
  props: {
    mode: {
      type: String,
      default: "default"
    }
  },
  computed: {
    _route() {
      if (this.mode === "default") {
        return this.$route;
      } else {
        return this.$store.state.modalRouter.route;
      }
    },
    routeParams() {
      return this._route.params;
    },
    routePath() {
      return this._route.path;
    }
  },
  methods: {
    goTo(path) {
      if (this.mode === "default") {
        this.$router.push(path);
      } else {
        this.goToModalRoute(path);
      }
    },
    goToModalRoute(path) {
      path = path.replace(/^\/*(.)/, "$1");
      this.$store.dispatch("modalRouter/updatePath", path);
    },
    close() {
      window.location.hash = "";
    }
  }
};
