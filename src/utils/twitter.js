import request from "@/utils/request";

export default {
  getAuthToken: async (token, secret) => {
    const response = await request("users/social/twitter", {
      method: "POST",
      data: { token, secret }
    });
    return await response.json();
  },

  getLoginUrl: () => {
    return (
      `${process.env.VUE_APP_API_URL}/proxy/twitter` +
      `?return_url=${window.location.origin}/twitter` +
      `&callback=${process.env.VUE_APP_API_URL}/proxy/twitter` +
      "&response_type=token"
    );
  }
};
