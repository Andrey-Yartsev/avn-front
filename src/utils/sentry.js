import * as Sentry from "@sentry/browser";
import * as SentryIntegrations from "@sentry/integrations";

export default Vue => {
  Sentry.init({
    dsn: "https://3309a55a4d2549f2b4aa2aa1c67589fc@bug.stars.avn.com/2",
    integrations: [
      new SentryIntegrations.Vue({
        Vue,
        attachProps: true
      }),
      new SentryIntegrations.RewriteFrames()
    ],
    environment: process.env.VUE_APP_LOG_MODE,
    beforeSend(event, hint) {
      try {
        if (hint.originalException.message === "Failed to fetch") {
          return null;
        }
        if (
          hint.originalException.message.match(
            /Non-Error promise rejection captured with/
          )
        ) {
          return null;
        }
      } catch (_) {
        return event;
      }
      return event;
    }
  });
};
