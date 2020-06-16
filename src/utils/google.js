import request from "@/utils/request";
import BrowserStore from "store";

export default {
  getAuthToken: async token => {
    const data = { token };
    const storedOkevData = BrowserStore.get("okevData");
    if (storedOkevData) {
      data.sentry = storedOkevData;
      BrowserStore.remove("okevData");
    }
    return new Promise(async (resolve, reject) => {
      let response = await request("auth/social/google", {
        method: "POST",
        data
      });
      response = await response.json();
      if (response.error) {
        reject(response.error);
      }
      resolve(response);
    });
  }
};
