export default {
  data() {
    return {
      lastUpdate: 0,
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
      if (time - this.lastUpdate > 5 * 1000) {
        console.log("check front update");
        this._checkFrontUpdate();
      }
    },
    async _checkFrontUpdate() {
      const version = await this.getVersion();
      if (version !== this.currentVersion) {
        console.log("updating front");
        // window.location.reload(true);
      }
    }
  },
  async created() {
    this.currentVersion = await this.getVersion();
    this.lastUpdate = new Date().getTime();
  }
};
