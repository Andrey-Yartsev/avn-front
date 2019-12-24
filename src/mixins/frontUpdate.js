import Store from "@/store";

export default {
  watch: {
    $route() {
      this.checkFrontUpdate();
    }
  },
  methods: {
    checkFrontUpdate() {
      const currentVersion = Store.state.version.currentVersion;
      const newVersion = Store.state.version.newVersion;

      if (currentVersion && newVersion && currentVersion != newVersion) {
        window.location.reload(true);
      }
    }
  }
};
