export default {
  data() {
    return {
      scriptsLoading: true
    };
  },
  methods: {
    loadScript(path) {
      path = process.env.VUE_APP_CDN_PATH + "static/js/" + path + ".js";

      return new Promise(accept => {
        let script = document.createElement("script");
        script.onload = () => {
          accept();
        };
        script.async = true;
        script.src = path;
        document.head.appendChild(script);
      });
    },
    async load() {
      const paths = [
        "amcharts/amcharts",
        "amcharts/serial",
        "amcharts/amstock",
        "amcharts/pie",
        "ammap/ammap",
        "ammap/worldLow"
      ];
      for (const path of paths) {
        await this.loadScript(path);
      }
      this.scriptsLoading = false;
    }
  },
  mounted() {
    this.load();
  }
};
