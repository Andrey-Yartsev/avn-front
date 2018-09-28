import request from "@/utils/request";
import tokenRequest from "@/utils/tokenRequest";

export default {
  fetch() {
    return tokenRequest("users/me", {
      method: "GET"
    });
  },
  login(creds) {
    return new Promise(async (resolve, reject) => {
      const response = await request("users/login", {
        method: "POST",
        body: JSON.stringify(creds)
      });
      const data = await response.json();
      if (data.error) {
        reject(data.error);
      }
      resolve(data);
    });
  },
  update(user) {
    return tokenRequest("users/me", {
      method: "PUT",
      data: user
    });
  }
};
