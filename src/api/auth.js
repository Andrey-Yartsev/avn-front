import request from "@/utils/request";

export default {
  login() {
    // for debug
    return new Promise(resolve => {
      const mockUser = require("@/mock/user.json");
      return resolve(mockUser);
    });
  },
  _login(creds) {
    return new Promise(async (resolve, reject) => {
      const response = await request("users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      });
      const data = await response.json();
      if (data.error) {
        reject(data.error);
      }
      resolve(data);
    });
  }
};
