export default {
  props: {
    mode: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      routeParams: null
    };
  },
  watch: {
    defaultRouterParams: {
      immediate: true,
      handler(params) {
        if (!params) {
          return;
        }
        if (this.mode === "default") {
          this.routeParams = params;
        }
      }
    },
    modalRouterParams: {
      immediate: true,
      handler(params) {
        if (!params) {
          return;
        }
        if (this.mode !== "default") {
          this.routeParams = params;
        }
      }
    }
  },
  computed: {
    defaultRouterParams() {
      return this.$route.params;
    },
    modalRouterParams() {
      if (!this.$store.state.modalRouter.route) {
        return null;
      }
      return this.$store.state.modalRouter.route.params;
    },
    routePath() {
      if (this.mode === "default") {
        return this.$route.path;
      } else {
        return this.$store.state.modalRouter.route.path;
      }
    },
    routeName() {
      if (this.mode === "default") {
        return this.$route.name;
      } else {
        return this.$store.state.modalRouter.route.name;
      }
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
