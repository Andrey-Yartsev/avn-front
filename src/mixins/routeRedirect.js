import BrowserStore from "store";

export default {
  methods: {
    clearRouteRedirect(storageName, condition = true) {
      const isRedirectRouteSaved = BrowserStore.get(storageName);
      if (isRedirectRouteSaved && condition) {
        BrowserStore.remove(storageName);
      }
    },
    useRouteRedirect(storageName, path, condition = true) {
      const isRedirectRouteSaved = BrowserStore.get(storageName);
      if (isRedirectRouteSaved && condition) {
        this.$router.push(path);
      }
    }
  }
};
