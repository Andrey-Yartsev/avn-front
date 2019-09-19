export default {
  data() {
    return {
      lastCheck: 0,
      currentVersion: ""
    };
  },
  watch: {
    $route() {
      this.checkFrontUpdate();
    }
  },
  methods: {
    async getVersion() {
      const response = await fetch("/version.txt");
      return await response.text();
    },
    checkFrontUpdate() {
      const time = new Date().getTime();
      if (time - this.lastCheck > 30 * 1000) {
        console.log("check front update");
        this._checkFrontUpdate();
      }
    },
    async _checkFrontUpdate() {
      const version = await this.getVersion();
      this.lastCheck = new Date().getTime();
      if (version !== this.currentVersion) {
        window.location.reload(true);
      }
    }
  },
  async created() {
    this.currentVersion = await this.getVersion();
    this.lastCheck = new Date().getTime();
  }
};
