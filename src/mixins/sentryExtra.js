import * as Sentry from "@sentry/browser";
import Store from "@/store";

const addSentryExtra = () => {
  Sentry.configureScope(function(scope) {
    const user = Store.state.auth.user;
    if (user) {
      scope.setExtra("username", user.username);
    }
    if (Store.state.version.currentVersion) {
      scope.setExtra("version", Store.state.version.currentVersion);
    }
  });
};

export default {
  computed: {
    version() {
      return Store.state.version.currentVersion;
    }
  },
  watch: {
    version: {
      immediate: true,
      handler() {
        addSentryExtra();
      }
    },
    user: {
      immediate: true,
      handler() {
        addSentryExtra();
      }
    }
  }
};
