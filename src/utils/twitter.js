import request from "@/utils/request";

export default {
  getAuthToken: async (token, secret) => {
    const data = { token, secret };
    if (window.okev) {
      data.sentry = JSON.stringify(window.okev.all());
    }
    const response = await request("auth/social/twitter", {
      method: "POST",
      data
    });
    return await response.json();
  },

  getLoginUrl: () => {
    return (
      `${process.env.VUE_APP_API_URL}/proxy/twitter` +
      `?return_url=${window.location.origin}/twitter` +
      `&callback=${process.env.VUE_APP_API_URL}/proxy/twitter` +
      "&response_type=token" +
      "&user_avn_tz=" +
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  },

  getConnectUrl: function(returnUrl) {
    return (
      process.env.VUE_APP_API_URL +
      "/proxy/twitter" +
      "?return_url=" +
      window.location.origin +
      returnUrl +
      "&callback=" +
      process.env.VUE_APP_API_URL +
      "/proxy/twitter" +
      "&response_type=token"
    );
  }
};
