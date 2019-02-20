export default {
  data() {
    return {
      styleElement: null
    };
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    headTag() {
      return document.head || document.getElementsByTagName("head")[0];
    }
  },

  watch: {
    user() {
      if (this.user) {
        this.appendColorsCss();
      } else {
        this.removeColorsCss();
      }
    }
  },

  mounted() {
    this.appendColorsCss();
  },

  methods: {
    removeColorsCss() {
      if (this.styleElement) {
        this.headTag.removeChild(this.styleElement);
      }
    },
    appendColorsCss() {
      if (!this.user) {
        return;
      }
      this.removeColorsCss();
      this.styleElement = document.createElement("style");
      this.styleElement.type = "text/css";
      if (this.styleElement.styleSheet) {
        // This is required for IE8 and below
        this.styleElement.styleSheet.cssText = this.colorsCss();
      } else {
        this.styleElement.appendChild(
          document.createTextNode(this.colorsCss())
        );
      }
      this.headTag.appendChild(this.styleElement);
    },
    getNightModeColor: function() {
      const res = {
        white: "255, 255, 255",
        dark: "34, 43, 50",
        light: "248, 249, 250"
      };
      if (this.user.userSettings.nightMode) {
        res.white = "34, 43, 50";
        res.dark = "255, 255, 255";
        res.light = "0, 0, 0";
      }
      return res;
    },
    colorsCss() {
      const { primaryColor, secondColor } = this.user;
      const nightMode = this.getNightModeColor();
      return (
        ":root {" +
        "--primary-color: var(--color-" +
        primaryColor +
        ");" +
        "--secondary-color: var(--color-" +
        secondColor +
        ");" +
        "--primary-color-darken: var(--color-darken-" +
        primaryColor +
        ");" +
        "--secondary-color-darken: var(--color-darken-" +
        secondColor +
        ");" +
        "--primary-color-06: var(--color-06-" +
        primaryColor +
        ");" +
        "--secondary-color-06: var(--color-06-" +
        secondColor +
        ");" +
        "--primary-color-10: var(--color-10-" +
        primaryColor +
        ");" +
        "--secondary-color-10: var(--color-10-" +
        secondColor +
        ");" +
        "--primary-color-12: var(--color-12-" +
        primaryColor +
        ");" +
        "--secondary-color-12: var(--color-12-" +
        secondColor +
        ");" +
        "--primary-color-20: var(--color-20-" +
        primaryColor +
        ");" +
        "--secondary-color-20: var(--color-20-" +
        secondColor +
        ");" +
        "--white: rgb(" +
        nightMode.white +
        ");" +
        "--dark: rgb(" +
        nightMode.dark +
        ");" +
        "--light: rgb(" +
        nightMode.light +
        ");" +
        "}"
      );
    }
  }
};
