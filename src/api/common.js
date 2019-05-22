import anyRequest from "@/utils/anyRequest";
import tokenRequest from "@/utils/tokenRequest";

export default {
  getPages() {
    return anyRequest("pages", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  },
  webPushes(add, subscription) {
    return tokenRequest(`users/web-push-token`, {
      method: add ? "PUT" : "DELETE",
      mode: "cors",
      data: { subscription }
    });
  }
};
