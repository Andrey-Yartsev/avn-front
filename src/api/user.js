import request from "@/utils/request";
import tokenRequest from "@/utils/tokenRequest";

export default {
  signUp(data) {
    return request("users/register", {
      method: "POST",
      data
    });
  },
  fetch() {
    return tokenRequest("users/me", {
      method: "GET"
    });
  },
  login(data) {
    return new Promise(async (resolve, reject) => {
      let response = await request("users/login", {
        method: "POST",
        data
      });
      response = await response.json();
      if (response.error) {
        reject(response.error);
      }
      resolve(response);
    });
  },
  update(user) {
    return tokenRequest("users/me", {
      method: "PUT",
      data: user
    });
  }
};
