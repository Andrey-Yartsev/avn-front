export default {
  props: {
    mode: {
      type: String,
      default: "default"
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
      window.currentScrollTop = document.scrollingElement.scrollTop;
      path = path.replace(/^\/*(.)/, "$1");
      this.$store.dispatch("modalRouter/updatePath", path);
    },
    close() {
      window.location.hash = "";
      document.scrollingElement.scrollTop = window.currentScrollTop;
    }
  }
};
